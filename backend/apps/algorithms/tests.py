from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.algorithms.models import Algorithm

class AlgorithmsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.algo = Algorithm.objects.create(
            slug='test-binary-search',
            name='Test Binary Search',
            category='Searching',
            description='Test description',
            time_complexity_best='O(1)',
            time_complexity_avg='O(log n)',
            time_complexity_worst='O(log n)',
            space_complexity='O(1)',
            default_dataset=[1, 2, 3, 4, 5],
            implementation_code={'python': 'def test(): pass'},
            pseudocode='test pseudocode'
        )

    def test_list_algorithms(self):
        url = reverse('algorithm_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_filter_by_category(self):
        url = reverse('algorithm_list') + '?category=Searching'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for item in response.data:
            self.assertEqual(item['category'], 'Searching')

    def test_algorithm_detail(self):
        url = reverse('algorithm_detail', kwargs={'slug': 'test-binary-search'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Binary Search')
        self.assertIn('implementation_code', response.data)
        self.assertEqual(response.data['time_complexity_avg'], 'O(log n)')
