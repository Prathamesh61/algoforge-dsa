from datetime import date, timedelta
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.progress.models import UserDailyActivity, UserRecentActivity

class ProgressDashboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.dashboard_url = reverse('progress_dashboard')
        self.heatmap_url = reverse('progress_heatmap')

        self.user = User.objects.create_user(
            email='dashboard_test@example.com',
            username='dashboard_test',
            full_name='Dashboard Test User',
            password='Password123!'
        )
        self.user.profile.total_xp = 1200
        self.user.profile.current_streak = 5
        self.user.profile.current_level = 5
        self.user.profile.save()

        # Seed an activity
        UserDailyActivity.objects.create(
            user=self.user,
            activity_date=date.today(),
            problems_solved=3,
            lessons_completed=2,
            xp_earned=90,
            coding_minutes=50
        )

    def test_dashboard_unauthenticated(self):
        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_dashboard_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn('stats', response.data)
        self.assertIn('continue_learning', response.data)
        self.assertIn('daily_goal', response.data)
        self.assertIn('roadmap_nodes', response.data)
        self.assertIn('weekly_chart', response.data)
        self.assertIn('recent_activities', response.data)
        self.assertEqual(len(response.data['weekly_chart']), 7)

    def test_activity_heatmap_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.heatmap_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('days', response.data)
        self.assertEqual(len(response.data['days']), 365)

    def test_leaderboard(self):
        url = reverse('progress_leaderboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('leaderboard', response.data)
        self.assertTrue(len(response.data['leaderboard']) >= 1)

    def test_user_stats_breakdown(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('progress_stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('overview', response.data)
        self.assertIn('difficulty', response.data)
        self.assertIn('topics', response.data)

    def test_update_daily_goal(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('progress_daily_goal')
        response = self.client.post(url, {'target': 8}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['target'], 8)
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.daily_goal_target, 8)

