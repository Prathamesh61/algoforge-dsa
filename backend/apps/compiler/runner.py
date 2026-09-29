import os
import sys
import time
import shutil
import tempfile
import subprocess
from pathlib import Path

# Detect executable paths
PYTHON_EXEC = sys.executable
NODE_EXEC = shutil.which('node') or r'C:\Program Files\nodejs\node.exe'
JAVAC_EXEC = shutil.which('javac')
JAVA_EXEC = shutil.which('java')
CPP_EXEC = shutil.which('g++')

SUPPORTED_LANGUAGES = ['python', 'javascript', 'java', 'cpp']

class CodeRunner:
    @staticmethod
    def get_supported_languages():
        langs = ['python', 'javascript']
        if JAVAC_EXEC and JAVA_EXEC:
            langs.append('java')
        if CPP_EXEC:
            langs.append('cpp')
        return langs

    @classmethod
    def execute(cls, language: str, source_code: str, stdin: str = '', time_limit_sec: float = 2.0):
        lang = language.lower().strip()
        if lang in ['py', 'python3']:
            lang = 'python'
        elif lang in ['js', 'node']:
            lang = 'javascript'
        elif lang in ['c++', 'g++']:
            lang = 'cpp'

        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)

            if lang == 'python':
                return cls._run_python(temp_path, source_code, stdin, time_limit_sec)
            elif lang == 'javascript':
                return cls._run_javascript(temp_path, source_code, stdin, time_limit_sec)
            elif lang == 'java':
                return cls._run_java(temp_path, source_code, stdin, time_limit_sec)
            elif lang == 'cpp':
                return cls._run_cpp(temp_path, source_code, stdin, time_limit_sec)
            else:
                return {
                    'stdout': '',
                    'stderr': f"Unsupported language: '{language}'. Supported: {', '.join(cls.get_supported_languages())}",
                    'exit_code': 1,
                    'execution_time_ms': 0,
                    'status': 'Compilation Error'
                }

    @staticmethod
    def _execute_process(cmd, cwd, stdin_data, timeout_sec):
        start_time = time.perf_counter()
        try:
            process = subprocess.Popen(
                cmd,
                cwd=str(cwd),
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding='utf-8',
                errors='replace'
            )
            stdout, stderr = process.communicate(input=stdin_data, timeout=timeout_sec)
            elapsed_ms = int((time.perf_counter() - start_time) * 1000)
            return {
                'stdout': stdout,
                'stderr': stderr,
                'exit_code': process.returncode,
                'execution_time_ms': elapsed_ms,
                'status': 'Success' if process.returncode == 0 else 'Runtime Error'
            }
        except subprocess.TimeoutExpired:
            process.kill()
            stdout, stderr = process.communicate()
            elapsed_ms = int(timeout_sec * 1000)
            return {
                'stdout': stdout or '',
                'stderr': f'Execution timed out after {timeout_sec}s (Time Limit Exceeded)',
                'exit_code': 124,
                'execution_time_ms': elapsed_ms,
                'status': 'Time Limit Exceeded'
            }
        except Exception as e:
            return {
                'stdout': '',
                'stderr': f'Execution error: {str(e)}',
                'exit_code': 1,
                'execution_time_ms': 0,
                'status': 'Runtime Error'
            }

    @classmethod
    def _run_python(cls, temp_path: Path, source_code: str, stdin: str, timeout_sec: float):
        file_path = temp_path / 'solution.py'
        file_path.write_text(source_code, encoding='utf-8')
        cmd = [PYTHON_EXEC, '-u', str(file_path)]
        return cls._execute_process(cmd, temp_path, stdin, timeout_sec)

    @classmethod
    def _run_javascript(cls, temp_path: Path, source_code: str, stdin: str, timeout_sec: float):
        if not NODE_EXEC or not os.path.exists(NODE_EXEC):
            return {
                'stdout': '',
                'stderr': 'Node.js runtime not found on server.',
                'exit_code': 1,
                'execution_time_ms': 0,
                'status': 'Runtime Error'
            }
        file_path = temp_path / 'solution.js'
        file_path.write_text(source_code, encoding='utf-8')
        cmd = [NODE_EXEC, str(file_path)]
        return cls._execute_process(cmd, temp_path, stdin, timeout_sec)

    @classmethod
    def _run_java(cls, temp_path: Path, source_code: str, stdin: str, timeout_sec: float):
        if not JAVAC_EXEC or not JAVA_EXEC:
            return {
                'stdout': '',
                'stderr': 'Java JDK not configured on server.',
                'exit_code': 1,
                'execution_time_ms': 0,
                'status': 'Compilation Error'
            }
        file_path = temp_path / 'Solution.java'
        file_path.write_text(source_code, encoding='utf-8')

        # Compile
        compile_res = subprocess.run(
            [JAVAC_EXEC, 'Solution.java'],
            cwd=str(temp_path),
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        if compile_res.returncode != 0:
            return {
                'stdout': '',
                'stderr': compile_res.stderr,
                'exit_code': compile_res.returncode,
                'execution_time_ms': 0,
                'status': 'Compilation Error'
            }

        # Run
        cmd = [JAVA_EXEC, 'Solution']
        return cls._execute_process(cmd, temp_path, stdin, timeout_sec)

    @classmethod
    def _run_cpp(cls, temp_path: Path, source_code: str, stdin: str, timeout_sec: float):
        if not CPP_EXEC:
            return {
                'stdout': '',
                'stderr': 'C++ GCC compiler not installed on host server.',
                'exit_code': 1,
                'execution_time_ms': 0,
                'status': 'Compilation Error'
            }
        src_file = temp_path / 'solution.cpp'
        bin_file = temp_path / 'solution.exe'
        src_file.write_text(source_code, encoding='utf-8')

        # Compile
        compile_res = subprocess.run(
            [CPP_EXEC, '-O2', 'solution.cpp', '-o', 'solution.exe'],
            cwd=str(temp_path),
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        if compile_res.returncode != 0:
            return {
                'stdout': '',
                'stderr': compile_res.stderr,
                'exit_code': compile_res.returncode,
                'execution_time_ms': 0,
                'status': 'Compilation Error'
            }

        # Run binary
        cmd = [str(bin_file)]
        return cls._execute_process(cmd, temp_path, stdin, timeout_sec)
