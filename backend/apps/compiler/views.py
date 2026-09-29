from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.compiler.runner import CodeRunner
from apps.compiler.tracer import CodeTracer

class ExecuteCodeView(APIView):
    """
    POST /api/v1/compiler/execute/
    Executes source code in an isolated subprocess with resource quotas and returns stdout/stderr.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        language = request.data.get('language')
        source_code = request.data.get('source_code')
        stdin = request.data.get('stdin', '')
        time_limit_sec = float(request.data.get('time_limit_sec', 2.0))

        # Enforce maximum safety cap of 10s
        time_limit_sec = min(max(time_limit_sec, 0.5), 10.0)

        if not language:
            return Response(
                {'error': 'Field "language" is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if source_code is None:
            return Response(
                {'error': 'Field "source_code" is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = CodeRunner.execute(
            language=language,
            source_code=source_code,
            stdin=stdin,
            time_limit_sec=time_limit_sec
        )

        return Response(result, status=status.HTTP_200_OK)


class TraceCodeView(APIView):
    """
    POST /api/v1/compiler/trace/
    Traces code execution step-by-step capturing variables, active line, call stack,
    and failure diagnostics.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        language = request.data.get('language', 'python')
        source_code = request.data.get('source_code') or request.data.get('code', '')
        stdin = request.data.get('stdin') or request.data.get('test_input', '')
        expected_output = request.data.get('expected_output', None)

        if not source_code:
            return Response({'error': 'source_code is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if language == 'python':
            trace_result = CodeTracer.trace_python(source_code, stdin, expected_output)
            return Response(trace_result, status=status.HTTP_200_OK)
        else:
            # Fallback execution for non-python runtimes
            run_result = CodeRunner.execute(language=language, source_code=source_code, stdin=stdin)
            is_failed = False
            if expected_output is not None and run_result.get('stdout', '').strip() != expected_output.strip():
                is_failed = True

            return Response({
                'status': run_result.get('status', 'success'),
                'total_steps': 1,
                'steps': [
                    {
                        'step': 1,
                        'line': 1,
                        'code': '// Compiled execution',
                        'event': 'execution',
                        'variables': {'output': run_result.get('stdout', '')},
                        'call_stack': ['main'],
                        'stdout': run_result.get('stdout', '')
                    }
                ],
                'stdout': run_result.get('stdout', ''),
                'error_message': run_result.get('stderr', ''),
                'execution_time_ms': run_result.get('execution_time_ms', 10),
                'failure_analysis': {
                    'is_failed': is_failed,
                    'expected': expected_output,
                    'actual': run_result.get('stdout', ''),
                    'failing_line': None,
                    'explanation': f"Actual output '{run_result.get('stdout', '').strip()}' does not match expected '{expected_output}'" if is_failed else None
                }
            }, status=status.HTTP_200_OK)


class SupportedLanguagesView(APIView):
    """
    GET /api/v1/compiler/languages/
    Returns list of active runtimes detected on the server environment.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        languages = CodeRunner.get_supported_languages()
        return Response({'languages': languages}, status=status.HTTP_200_OK)
