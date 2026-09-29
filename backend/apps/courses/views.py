from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from apps.courses.models import Course, Lesson, CourseEnrollment, LessonProgress
from apps.courses.serializers import (
    CourseListSerializer,
    CourseDetailSerializer,
    LessonDetailSerializer
)
from apps.progress.models import UserRecentActivity, UserContinueLearning

class CourseListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        courses = Course.objects.filter(is_published=True).prefetch_related('modules')
        serializer = CourseListSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        course = Course.objects.filter(slug=slug, is_published=True).first()
        if not course:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseDetailSerializer(course, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseEnrollView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        course = Course.objects.filter(slug=slug, is_published=True).first()
        if not course:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        enrollment, created = CourseEnrollment.objects.get_or_create(
            user=request.user,
            course=course
        )
        return Response({
            'message': 'Successfully enrolled in course' if created else 'Already enrolled',
            'course_slug': course.slug,
            'course_title': course.title,
        }, status=status.HTTP_200_OK)


class LessonDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        lesson = Lesson.objects.filter(slug=slug, is_published=True).select_related('module__course').first()
        if not lesson:
            return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

        # Update continue learning if user is authenticated
        if request.user.is_authenticated:
            UserContinueLearning.objects.update_or_create(
                user=request.user,
                defaults={
                    'title': lesson.title,
                    'module_title': lesson.module.title,
                    'slug': lesson.slug,
                    'item_type': 'lesson',
                    'progress_percentage': 50, # Active lesson reading
                }
            )

        serializer = LessonDetailSerializer(lesson, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class LessonCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        lesson = Lesson.objects.filter(slug=slug, is_published=True).select_related('module__course').first()
        if not lesson:
            return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

        progress, created = LessonProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson
        )

        xp_awarded = 0
        if not progress.is_completed:
            progress.is_completed = True
            progress.completed_at = timezone.now()
            progress.save()

            # Award XP to user profile
            profile = getattr(request.user, 'profile', None)
            if profile:
                xp_awarded = lesson.xp_reward or 10
                profile.total_xp += xp_awarded
                profile.lessons_completed_count += 1
                profile.update_level()
                profile.save()

            # Record in recent activities
            UserRecentActivity.objects.create(
                user=request.user,
                activity_type='lesson_completed',
                title=f'Completed "{lesson.title}"',
                subtitle=f'{lesson.module.course.title} • {lesson.module.title}',
                xp_earned=xp_awarded
            )

            # Update continue learning to 100%
            UserContinueLearning.objects.update_or_create(
                user=request.user,
                defaults={
                    'title': lesson.title,
                    'module_title': lesson.module.title,
                    'slug': lesson.slug,
                    'progress_percentage': 100,
                }
            )

        profile = getattr(request.user, 'profile', None)
        return Response({
            'message': 'Lesson completed successfully',
            'xp_awarded': xp_awarded,
            'total_xp': profile.total_xp if profile else 0,
            'current_level': profile.current_level if profile else 1,
            'is_completed': True,
        }, status=status.HTTP_200_OK)


class LessonQuizSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        lesson = Lesson.objects.filter(slug=slug, is_published=True).first()
        if not lesson:
            return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

        selected_index = request.data.get('selected_index')
        quiz_index = request.data.get('quiz_index', 0)

        # Find quiz block
        quiz_blocks = [b for b in lesson.content_blocks if b.get('type') == 'quiz']
        if not quiz_blocks or quiz_index >= len(quiz_blocks):
            return Response({'error': 'Quiz question not found in lesson'}, status=status.HTTP_400_BAD_REQUEST)

        target_quiz = quiz_blocks[quiz_index]
        correct_index = target_quiz.get('correctIndex')
        is_correct = (selected_index == correct_index)

        xp_awarded = 0
        if is_correct:
            profile = getattr(request.user, 'profile', None)
            if profile:
                xp_awarded = 10
                profile.total_xp += xp_awarded
                profile.update_level()
                profile.save()

        return Response({
            'is_correct': is_correct,
            'explanation': target_quiz.get('explanation', ''),
            'xp_awarded': xp_awarded,
        }, status=status.HTTP_200_OK)
