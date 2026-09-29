from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

class CompilerAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.execute_url = reverse('compiler_execute')
        self.languages_url = reverse('compiler_languages')

    def test_supported_languages(self):
        res = self.client.get(self.languages_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('python', res.data['languages'])
        self.assertIn('javascript', res.data['languages'])

    def test_python_execution_success(self):
        payload = {
            'language': 'python',
            'source_code': 'print("AlgoForge Compiler Online")',
            'stdin': ''
        }
        res = self.client.post(self.execute_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['exit_code'], 0)
        self.assertEqual(res.data['status'], 'Success')
        self.assertEqual(res.data['stdout'].strip(), 'AlgoForge Compiler Online')
        self.assertGreaterEqual(res.data['execution_time_ms'], 0)

    def test_python_stdin_sum(self):
        payload = {
            'language': 'python',
            'source_code': 'import sys\nnums = map(int, sys.stdin.read().split())\nprint(sum(nums))',
            'stdin': '10 25 35'
        }
        res = self.client.post(self.execute_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['exit_code'], 0)
        self.assertEqual(res.data['stdout'].strip(), '70')

    def test_javascript_execution_success(self):
        payload = {
            'language': 'javascript',
            'source_code': 'console.log("JavaScript Execution Verified");',
            'stdin': ''
        }
        res = self.client.post(self.execute_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['exit_code'], 0)
        self.assertEqual(res.data['stdout'].strip(), 'JavaScript Execution Verified')

    def test_time_limit_exceeded(self):
        payload = {
            'language': 'python',
            'source_code': 'while True: pass',
            'stdin': '',
            'time_limit_sec': 1.0
        }
        res = self.client.post(self.execute_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'Time Limit Exceeded')
        self.assertEqual(res.data['exit_code'], 124)
        self.assertIn('timed out', res.data['stderr'].lower())

    def test_runtime_error_captured(self):
        payload = {
            'language': 'python',
            'source_code': 'print(1 / 0)',
            'stdin': ''
        }
        res = self.client.post(self.execute_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'Runtime Error')
        self.assertNotEqual(res.data['exit_code'], 0)
        self.assertIn('ZeroDivisionError', res.data['stderr'])

    def test_missing_language_bad_request(self):
        payload = {
            'source_code': 'print(1)'
        }
        res = self.client.post(self.execute_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_compiler_tracer_success(self):
        trace_url = reverse('compiler_trace')
        payload = {
            'language': 'python',
            'source_code': 'a = 10\nb = 20\nc = a + b\nprint(c)',
            'stdin': ''
        }
        res = self.client.post(trace_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('steps', res.data)
        self.assertGreater(res.data['total_steps'], 0)
        self.assertEqual(res.data['stdout'].strip(), '30')
        self.assertFalse(res.data['failure_analysis']['is_failed'])

    def test_compiler_tracer_failure_analysis(self):
        trace_url = reverse('compiler_trace')
        payload = {
            'language': 'python',
            'source_code': 'a = 5\nprint(a * 2)',
            'stdin': '',
            'expected_output': '99'
        }
        res = self.client.post(trace_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['failure_analysis']['is_failed'])
        self.assertEqual(res.data['failure_analysis']['expected'], '99')
        self.assertEqual(res.data['failure_analysis']['actual'], '10')
