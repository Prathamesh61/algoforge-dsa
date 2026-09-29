from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.problems.models import Problem, ProblemTag, ProblemTestCase

class ProblemAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.tag_array = ProblemTag.objects.create(name="Array", slug="array")
        self.tag_string = ProblemTag.objects.create(name="String", slug="string")

        self.prob1 = Problem.objects.create(
            title="Two Sum",
            slug="two-sum",
            difficulty="Easy",
            xp_reward=20,
            description_markdown="Given an array...",
            input_format="nums, target",
            output_format="indices",
            constraints="O(n)",
            starter_templates={"python": "def two_sum(): pass"},
            is_published=True
        )
        self.prob1.tags.add(self.tag_array)

        self.prob2 = Problem.objects.create(
            title="Reverse String",
            slug="reverse-string",
            difficulty="Medium",
            xp_reward=35,
            description_markdown="Reverse chars...",
            starter_templates={"python": "def reverse(): pass"},
            is_published=True
        )
        self.prob2.tags.add(self.tag_string)

        self.prob_draft = Problem.objects.create(
            title="Secret Unpublished",
            slug="secret-unpublished",
            difficulty="Hard",
            is_published=False
        )

        # Public test case
        ProblemTestCase.objects.create(
            problem=self.prob1,
            input_data="2 7 11 15\n9",
            expected_output="0 1",
            is_hidden=False,
            display_order=1
        )
        # Hidden test case
        ProblemTestCase.objects.create(
            problem=self.prob1,
            input_data="3 3\n6",
            expected_output="0 1",
            is_hidden=True,
            display_order=2
        )

    def test_problem_list(self):
        url = reverse('problem_list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Only published problems returned
        self.assertEqual(len(res.data), 2)
        slugs = [p['slug'] for p in res.data]
        self.assertIn('two-sum', slugs)
        self.assertNotIn('secret-unpublished', slugs)

    def test_problem_filtering_by_difficulty(self):
        url = reverse('problem_list')
        res = self.client.get(url, {'difficulty': 'Easy'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['slug'], 'two-sum')

    def test_problem_filtering_by_tag(self):
        url = reverse('problem_list')
        res = self.client.get(url, {'tag': 'string'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['slug'], 'reverse-string')

    def test_problem_search(self):
        url = reverse('problem_list')
        res = self.client.get(url, {'search': 'Reverse'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['title'], 'Reverse String')

    def test_problem_detail_and_hidden_cases_security(self):
        url = reverse('problem_detail', kwargs={'slug': 'two-sum'})
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['slug'], 'two-sum')
        self.assertEqual(res.data['difficulty'], 'Easy')
        self.assertEqual(res.data['xp_reward'], 20)
        self.assertIn('python', res.data['starter_templates'])

        # Security check: verify hidden test cases are NOT leaked in public_test_cases
        public_cases = res.data['public_test_cases']
        self.assertEqual(len(public_cases), 1)
        self.assertEqual(public_cases[0]['input_data'], "2 7 11 15\n9")
        self.assertFalse(public_cases[0]['is_hidden'])

    def test_problem_tags_list(self):
        url = reverse('problem_tag_list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)
        tag_names = [t['name'] for t in res.data]
        self.assertIn('Array', tag_names)
        self.assertIn('String', tag_names)
