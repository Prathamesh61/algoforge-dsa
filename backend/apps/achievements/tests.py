from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import User
from apps.achievements.models import Achievement, UserAchievement

class AchievementAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='achiever@algoforge.dev',
            username='achiever',
            password='Password123!',
            full_name='Algo Achiever'
        )
        self.profile = self.user.profile

        self.ach_first = Achievement.objects.create(
            code='first_blood',
            title='First Blood',
            description='Solve first problem',
            badge_icon='Trophy',
            xp_bonus=50,
            category='problems'
        )
        self.ach_century = Achievement.objects.create(
            code='century_club',
            title='Century Club',
            description='100 XP reached',
            badge_icon='Zap',
            xp_bonus=50,
            category='special'
        )

    def test_achievement_list_unauthenticated(self):
        url = reverse('achievement_list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)
        self.assertFalse(res.data[0]['is_unlocked'])

    def test_auto_unlock_first_blood(self):
        self.client.force_authenticate(user=self.user)
        # Update user profile to have 1 solved problem
        self.profile.problems_solved_count = 1
        self.profile.save()

        url = reverse('achievement_list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        fb = next((a for a in res.data if a['code'] == 'first_blood'), None)
        self.assertIsNotNone(fb)
        self.assertTrue(fb['is_unlocked'])

        # Check bonus XP applied to profile
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.total_xp, 50)

    def test_manual_check_endpoint(self):
        self.client.force_authenticate(user=self.user)
        self.profile.total_xp = 150
        self.profile.save()

        url = reverse('achievement_check')
        res = self.client.post(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['newly_unlocked_count'], 1)
        self.assertEqual(res.data['achievements'][0]['code'], 'century_club')
