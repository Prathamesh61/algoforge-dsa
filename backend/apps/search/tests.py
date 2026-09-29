from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.problems.models import Problem, ProblemTag
from apps.algorithms.models import Algorithm

class SearchAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.search_url = reverse('global_search')

        tag = ProblemTag.objects.create(name='Binary Search', slug='binary-search')
        self.prob = Problem.objects.create(
            title='Binary Search in Sorted Array',
            slug='binary-search-test',
            difficulty='Easy',
            description_markdown='Find target element in sorted array using binary search.',
            is_published=True
        )
        self.prob.tags.add(tag)

        self.algo = Algorithm.objects.create(
            name='Binary Search',
            slug='binary-search-algo',
            category='Searching',
            description='Efficient search in sorted arrays with logarithmic time complexity O(log n).'
        )

    def test_search_short_query_empty(self):
        res = self.client.get(f"{self.search_url}?q=a")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['total_results'], 0)

    def test_search_binary_success(self):
        res = self.client.get(f"{self.search_url}?q=binary")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(res.data['total_results'], 2)
        categories = [r['category'] for r in res.data['results']]
        self.assertIn('Algorithms', categories)
        self.assertIn('Problems', categories)

    def test_search_nonexistent_query(self):
        res = self.client.get(f"{self.search_url}?q=nonexistentqueryxyz")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['total_results'], 0)
        self.assertEqual(res.data['results'], [])
