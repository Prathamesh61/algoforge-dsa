from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.courses.models import Course, CourseModule, Lesson, CourseEnrollment, LessonProgress

class CoursesTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='student@example.com',
            username='student',
            full_name='Student Learner',
            password='TestPassword123!'
        )

        self.course = Course.objects.create(
            slug='test-course',
            title='Test Algorithms Course',
            summary='A test course for verification',
            difficulty='Beginner',
            is_published=True
        )

        self.module = CourseModule.objects.create(
            course=self.course,
            title='Module 1: Foundations',
            display_order=1
        )

        self.lesson = Lesson.objects.create(
            module=self.module,
            slug='test-lesson',
            title='Binary Search Introduction',
            estimated_read_time=7,
            xp_reward=15,
            display_order=1,
            is_published=True,
            content_blocks=[
                {'type': 'text', 'content': 'Explanation text'},
                {
                    'type': 'quiz',
                    'question': 'What is the time complexity of binary search?',
                    'options': ['O(n)', 'O(log n)', 'O(n^2)'],
                    'correctIndex': 1,
                    'explanation': 'Halves search space on each step'
                }
            ]
        )

    def test_list_courses(self):
        url = reverse('course_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'test-course')

    def test_course_detail(self):
        url = reverse('course_detail', kwargs={'slug': 'test-course'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Algorithms Course')
        self.assertIn('modules', response.data)
        self.assertEqual(len(response.data['modules']), 1)

    def test_course_enrollment(self):
        url = reverse('course_enroll', kwargs={'slug': 'test-course'})
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(CourseEnrollment.objects.filter(user=self.user, course=self.course).exists())

    def test_lesson_detail(self):
        url = reverse('lesson_detail', kwargs={'slug': 'test-lesson'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Binary Search Introduction')
        self.assertEqual(len(response.data['content_blocks']), 2)

    def test_lesson_completion_awards_xp(self):
        initial_xp = self.user.profile.total_xp
        url = reverse('lesson_complete', kwargs={'slug': 'test-lesson'})
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['xp_awarded'], 15)

        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.total_xp, initial_xp + 15)
        self.assertTrue(LessonProgress.objects.filter(user=self.user, lesson=self.lesson, is_completed=True).exists())

    def test_quiz_submission(self):
        url = reverse('lesson_quiz_submit', kwargs={'slug': 'test-lesson'})
        self.client.force_authenticate(user=self.user)

        # Incorrect answer
        wrong_res = self.client.post(url, {'selected_index': 0, 'quiz_index': 0}, format='json')
        self.assertEqual(wrong_res.status_code, status.HTTP_200_OK)
        self.assertFalse(wrong_res.data['is_correct'])

        # Correct answer
        correct_res = self.client.post(url, {'selected_index': 1, 'quiz_index': 0}, format='json')
        self.assertEqual(correct_res.status_code, status.HTTP_200_OK)
        self.assertTrue(correct_res.data['is_correct'])
        self.assertEqual(correct_res.data['xp_awarded'], 10)
