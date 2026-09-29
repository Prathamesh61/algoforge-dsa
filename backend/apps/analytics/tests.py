from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import User

class AnalyticsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='analyst@algoforge.dev',
            username='analyst',
            password='Password123!',
            full_name='Data Analyst'
        )

    def test_platform_analytics(self):
        url = reverse('platform_analytics')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('overview', res.data)
        self.assertIn('languages', res.data)
        self.assertIn('trends', res.data)
        self.assertGreaterEqual(res.data['overview']['total_users'], 1)

    def test_user_analytics_unauthenticated(self):
        url = reverse('user_analytics')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_analytics_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user_analytics')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('accuracy_rate', res.data)
        self.assertIn('average_runtime_ms', res.data)
        self.assertIn('study_chart', res.data)
        self.assertEqual(len(res.data['study_chart']), 7)
