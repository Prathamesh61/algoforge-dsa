from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.accounts.models import User, UserProfile

class AccountsAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.google_url = reverse('auth_google')
        self.me_url = reverse('auth_me')
        self.logout_url = reverse('auth_logout')

        # Create a test user
        self.user = User.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            full_name='Test User',
            password='ComplexPassword123!'
        )

    def test_user_registration(self):
        payload = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'full_name': 'New Student',
            'password': 'StrongPassword456!'
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertEqual(response.data['user']['email'], 'newuser@example.com')
        
        # Verify profile was automatically created
        new_user = User.objects.get(email='newuser@example.com')
        self.assertIsNotNone(new_user.profile)
        self.assertEqual(new_user.profile.total_xp, 0)
        self.assertEqual(new_user.profile.current_level, 1)

    def test_user_login_success(self):
        payload = {
            'email': 'testuser@example.com',
            'password': 'ComplexPassword123!'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_user_login_failure(self):
        payload = {
            'email': 'testuser@example.com',
            'password': 'WrongPassword!'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_google_login_flow(self):
        payload = {
            'id_token': 'mock_token_developer@google.com'
        }
        response = self.client.post(self.google_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['email'], 'developer@google.com')
        self.assertEqual(response.data['user']['auth_provider'], 'google')

        # Calling again should log in existing user rather than duplicating
        repeat_response = self.client.post(self.google_url, payload, format='json')
        self.assertEqual(repeat_response.status_code, status.HTTP_200_OK)
        self.assertEqual(repeat_response.data['user']['id'], response.data['user']['id'])

    def test_me_endpoint_requires_auth(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_endpoint_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'testuser@example.com')
        self.assertIn('profile', response.data)
        self.assertEqual(response.data['profile']['current_level'], 1)

    def test_update_profile(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'headline': 'Full Stack DSA Enthusiast',
            'bio': 'Solving problems daily on AlgoForge',
            'preferred_language': 'typescript',
            'daily_goal_target': 5
        }
        response = self.client.patch(self.me_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['profile']['headline'], 'Full Stack DSA Enthusiast')
        self.assertEqual(response.data['profile']['preferred_language'], 'typescript')
        self.assertEqual(response.data['profile']['daily_goal_target'], 5)

    def test_logout(self):
        self.client.force_authenticate(user=self.user)
        login_res = self.client.post(self.login_url, {
            'email': 'testuser@example.com',
            'password': 'ComplexPassword123!'
        }, format='json')
        refresh_token = login_res.data['tokens']['refresh']

        logout_res = self.client.post(self.logout_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)
