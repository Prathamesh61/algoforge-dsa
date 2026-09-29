import sys
import io
import json
import time
import traceback
from typing import Dict, Any, List

class CodeTracer:
    """
    Executes Python code line-by-line using sys.settrace to capture execution steps,
    local variables, call stack, stdout, and detect failing lines with exact diagnostics.
    """

    MAX_STEPS = 250
    MAX_VAR_REPR_LEN = 200

    @classmethod
    def serialize_val(cls, val):
        try:
            if isinstance(val, (int, float, bool, str, type(None))):
                return val
            if isinstance(val, (list, tuple)):
                if len(val) > 20:
                    return [cls.serialize_val(x) for x in val[:20]] + [f"...+{len(val)-20} more"]
                return [cls.serialize_val(x) for x in val]
            if isinstance(val, dict):
                items = list(val.items())[:15]
                res = {str(k): cls.serialize_val(v) for k, v in items}
                if len(val) > 15:
                    res["..."] = f"+{len(val)-15} more"
                return res
            if isinstance(val, set):
                return list(val)[:15]
            # Custom objects
            return repr(val)[:cls.MAX_VAR_REPR_LEN]
        except Exception:
            return "<unserializable>"

    @classmethod
    def trace_python(cls, source_code: str, stdin: str = '', expected_output: str = None) -> Dict[str, Any]:
        steps: List[Dict[str, Any]] = []
        code_lines = source_code.split('\n')
        total_code_lines = len(code_lines)
        captured_stdout = io.StringIO()
        original_stdout = sys.stdout
        original_stdin = sys.stdin

        call_stack: List[str] = ['<module>']
        step_counter = 0
        timed_out = False
        start_time = time.time()
        last_step_vars = {}
        last_line_executed = 1

        def tracer(frame, event, arg):
            nonlocal step_counter, timed_out, last_step_vars, last_line_executed

            if step_counter >= cls.MAX_STEPS:
                return None

            # Only trace code from user's file/module
            if frame.f_code.co_filename != '<string>':
                return tracer

            line_no = frame.f_lineno
            last_line_executed = line_no

            if event == 'call':
                fn_name = frame.f_code.co_name
                call_stack.append(fn_name)
            elif event == 'return':
                if len(call_stack) > 1:
                    call_stack.pop()

            # Filter user variables (omit modules, builtins, internal dunders)
            user_vars = {}
            for k, v in frame.f_locals.items():
                if k.startswith('__') and k.endswith('__'):
                    continue
                if callable(v) and not hasattr(v, '__self__') and not isinstance(v, type):
                    continue
                if isinstance(v, type(sys)):
                    continue
                user_vars[k] = cls.serialize_val(v)

            last_step_vars = user_vars
            step_counter += 1

            line_content = code_lines[line_no - 1] if 1 <= line_no <= total_code_lines else ''

            steps.append({
                'step': step_counter,
                'line': line_no,
                'code': line_content.strip(),
                'event': event,
                'variables': user_vars,
                'call_stack': list(call_stack),
                'stdout': captured_stdout.getvalue()
            })

            return tracer

        execution_status = 'success'
        error_message = None
        failing_line = None

        try:
            sys.stdout = captured_stdout
            sys.stdin = io.StringIO(stdin)
            compiled = compile(source_code, '<string>', 'exec')

            sys.settrace(tracer)
            global_scope = {'__name__': '__main__'}
            exec(compiled, global_scope)

        except Exception as e:
            execution_status = 'error'
            error_message = f"{type(e).__name__}: {str(e)}"
            tb = traceback.extract_tb(sys.exc_info()[2])
            for frame in reversed(tb):
                if frame.filename == '<string>':
                    failing_line = frame.lineno
                    break
        finally:
            sys.settrace(None)
            sys.stdout = original_stdout
            sys.stdin = original_stdin

        exec_time_ms = int((time.time() - start_time) * 1000)
        actual_output = captured_stdout.getvalue().strip()

        # Failure Analysis
        failure_analysis = {
            'is_failed': False,
            'expected': expected_output.strip() if expected_output is not None else None,
            'actual': actual_output,
            'failing_line': None,
            'failing_variables': None,
            'explanation': None
        }

        if execution_status == 'error':
            failure_analysis['is_failed'] = True
            failure_analysis['failing_line'] = failing_line or last_line_executed
            failure_analysis['failing_variables'] = last_step_vars
            failure_analysis['explanation'] = f"Runtime Exception at line {failure_analysis['failing_line']}: {error_message}"
        elif expected_output is not None:
            clean_exp = expected_output.strip().replace('\r\n', '\n')
            clean_act = actual_output.replace('\r\n', '\n')
            if clean_exp != clean_act:
                execution_status = 'failed'
                failure_analysis['is_failed'] = True
                failure_analysis['failing_line'] = last_line_executed
                failure_analysis['failing_variables'] = last_step_vars
                failure_analysis['explanation'] = (
                    f"Wrong Output: Algorithm produced '{clean_act}' but expected '{clean_exp}'. "
                    f"Last active state captured at line {last_line_executed}."
                )

        return {
            'status': execution_status,
            'total_steps': len(steps),
            'steps': steps,
            'stdout': actual_output,
            'error_message': error_message,
            'execution_time_ms': exec_time_ms,
            'failure_analysis': failure_analysis
        }
