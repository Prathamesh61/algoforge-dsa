from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import User, UserProfile
from apps.problems.models import Problem, ProblemTestCase
from apps.submissions.models import Submission

class SubmissionAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email='coder@algoforge.dev',
            username='coder',
            password='Password123!',
            full_name='Algo Coder'
        )
        self.profile = self.user.profile

        self.problem = Problem.objects.create(
            title='Two Sum Simple',
            slug='two-sum-simple',
            difficulty='Easy',
            xp_reward=25,
            description_markdown='Sum problem...',
            starter_templates={'python': 'pass'},
            time_limit_ms=2000
        )

        # Public test case
        ProblemTestCase.objects.create(
            problem=self.problem,
            input_data='2 3',
            expected_output='5',
            is_hidden=False,
            display_order=1
        )
        # Hidden test case
        ProblemTestCase.objects.create(
            problem=self.problem,
            input_data='10 20',
            expected_output='30',
            is_hidden=True,
            display_order=2
        )

    def test_submission_accepted_and_xp_awarded(self):
        self.client.force_authenticate(user=self.user)
        valid_code = (
            "import sys\n"
            "nums = list(map(int, sys.stdin.read().split()))\n"
            "print(sum(nums))\n"
        )
        url = reverse('submission_list_create')
        res = self.client.post(url, {
            'problem_slug': 'two-sum-simple',
            'language': 'python',
            'source_code': valid_code
        }, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['status'], 'Accepted')
        self.assertEqual(res.data['tests_passed'], 2)
        self.assertEqual(res.data['tests_total'], 2)

        # Check XP awarded to user profile
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.total_xp, 25)
        self.assertEqual(self.profile.problems_solved_count, 1)

    def test_submission_wrong_answer(self):
        self.client.force_authenticate(user=self.user)
        wrong_code = "print(999)\n"
        url = reverse('submission_list_create')
        res = self.client.post(url, {
            'problem_slug': 'two-sum-simple',
            'language': 'python',
            'source_code': wrong_code
        }, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['status'], 'Wrong Answer')
        self.assertEqual(res.data['tests_passed'], 0)

        # Profile XP should NOT be incremented
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.total_xp, 0)
        self.assertEqual(self.profile.problems_solved_count, 0)

    def test_submission_time_limit_exceeded(self):
        self.client.force_authenticate(user=self.user)
        loop_code = "while True: pass\n"
        url = reverse('submission_list_create')
        res = self.client.post(url, {
            'problem_slug': 'two-sum-simple',
            'language': 'python',
            'source_code': loop_code
        }, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['status'], 'Time Limit Exceeded')

    def test_submission_list(self):
        self.client.force_authenticate(user=self.user)
        Submission.objects.create(
            user=self.user,
            problem=self.problem,
            language='python',
            source_code='print(1)',
            status='Accepted',
            tests_passed=2,
            tests_total=2
        )
        url = reverse('submission_list_create')
        res = self.client.get(url, {'problem_slug': 'two-sum-simple'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['status'], 'Accepted')
