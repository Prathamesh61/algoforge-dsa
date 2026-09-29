from datetime import date, timedelta
from django.db.models import Count, Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status

from apps.accounts.models import User
from apps.problems.models import Problem
from apps.courses.models import Lesson
from apps.submissions.models import Submission
from apps.progress.models import UserDailyActivity


class PlatformAnalyticsView(APIView):
    """
    GET /api/v1/analytics/platform/
    Global platform statistics, submission volume trends, and language distributions.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        total_users = User.objects.count()
        total_problems = Problem.objects.filter(is_published=True).count()
        total_lessons = Lesson.objects.count()

        total_submissions = Submission.objects.count()
        accepted_submissions = Submission.objects.filter(status='Accepted').count()
        acceptance_rate = (
            round((accepted_submissions / total_submissions) * 100, 1)
            if total_submissions > 0
            else 0.0
        )

        # Language breakdown
        lang_counts = (
            Submission.objects.values('language')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        language_breakdown = []
        for item in lang_counts:
            language_breakdown.append({
                'language': item['language'].capitalize(),
                'count': item['count'],
                'percentage': round((item['count'] / total_submissions) * 100, 1) if total_submissions > 0 else 0.0
            })

        # 14-day submission volume trend
        today = date.today()
        daily_trends = []
        for i in range(13, -1, -1):
            d = today - timedelta(days=i)
            count = Submission.objects.filter(created_at__date=d).count()
            daily_trends.append({
                'date': d.strftime('%b %d'),
                'submissions': count
            })

        return Response({
            'overview': {
                'total_users': total_users,
                'total_problems': total_problems,
                'total_lessons': total_lessons,
                'total_submissions': total_submissions,
                'accepted_submissions': accepted_submissions,
                'acceptance_rate': acceptance_rate
            },
            'languages': language_breakdown,
            'trends': daily_trends
        }, status=status.HTTP_200_OK)


class UserAnalyticsView(APIView):
    """
    GET /api/v1/analytics/user/
    Personalized analytics: accuracy rate, avg runtime, language preferences, weekly study minutes.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, 'profile', None)

        user_subs = Submission.objects.filter(user=user)
        total_subs = user_subs.count()
        accepted_subs = user_subs.filter(status='Accepted').count()
        accuracy_rate = (
            round((accepted_subs / total_subs) * 100, 1)
            if total_subs > 0
            else 0.0
        )

        avg_runtime = user_subs.aggregate(Avg('execution_time_ms'))['execution_time_ms__avg']
        avg_runtime_ms = round(avg_runtime, 1) if avg_runtime else 0.0

        # 7-day study minutes
        today = date.today()
        seven_days_ago = today - timedelta(days=6)
        activities = {
            act.activity_date: act
            for act in UserDailyActivity.objects.filter(user=user, activity_date__gte=seven_days_ago)
        }

        study_chart = []
        total_minutes = 0
        for i in range(7):
            d = seven_days_ago + timedelta(days=i)
            act = activities.get(d)
            minutes = act.coding_minutes if act else 0
            total_minutes += minutes
            study_chart.append({
                'day': d.strftime('%a'),
                'minutes': minutes
            })

        return Response({
            'total_submissions': total_subs,
            'accepted_submissions': accepted_subs,
            'accuracy_rate': accuracy_rate,
            'average_runtime_ms': avg_runtime_ms,
            'weekly_minutes': total_minutes,
            'study_chart': study_chart,
            'streak': profile.current_streak if profile else 0,
            'total_xp': profile.total_xp if profile else 0,
            'current_level': profile.current_level if profile else 1
        }, status=status.HTTP_200_OK)
