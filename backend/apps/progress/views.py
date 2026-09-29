from datetime import date, timedelta
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from apps.accounts.serializers import UserSerializer
from apps.progress.models import UserDailyActivity, UserRecentActivity, UserContinueLearning
from apps.progress.serializers import (
    UserDailyActivitySerializer,
    UserRecentActivitySerializer,
    UserContinueLearningSerializer
)

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, 'profile', None)

        # 1. Continue Learning Item (fetch user's latest in-progress activity)
        continue_learning = UserContinueLearning.objects.filter(user=user).first()

        # 2. Daily Goal
        target = profile.daily_goal_target if profile else 5
        today = date.today()
        today_activity = UserDailyActivity.objects.filter(user=user, activity_date=today).first()
        today_solved = today_activity.problems_solved if today_activity else 0

        daily_goal = {
            'target': target,
            'solved': today_solved,
            'percentage': min(100, int((today_solved / target) * 100)) if target > 0 else 0
        }

        # 3. Weekly Chart (last 7 days - true data)
        seven_days_ago = today - timedelta(days=6)
        activities = {
            act.activity_date: act
            for act in UserDailyActivity.objects.filter(user=user, activity_date__gte=seven_days_ago)
        }

        weekly_chart = []
        for i in range(7):
            d = seven_days_ago + timedelta(days=i)
            day_act = activities.get(d)
            weekly_chart.append({
                'day': d.strftime('%a'),
                'date': d.isoformat(),
                'problems': day_act.problems_solved if day_act else 0,
                'lessons': day_act.lessons_completed if day_act else 0,
                'xp': day_act.xp_earned if day_act else 0,
                'minutes': day_act.coding_minutes if day_act else 0,
            })

        # 4. Recent Activities (only genuine activities)
        recent_qs = UserRecentActivity.objects.filter(user=user).order_by('-created_at')[:10]

        # 5. Roadmap Nodes Summary (Dynamic based on solved problems/courses)
        from apps.problems.models import Problem, ProblemTag
        from apps.submissions.models import Submission

        solved_problem_ids = set(
            Submission.objects.filter(user=user, status='Accepted').values_list('problem_id', flat=True)
        )

        core_topics = ['Arrays', 'Strings', 'Searching', 'Sorting', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming']
        roadmap_nodes = []
        topic_progress = []

        for idx, topic_name in enumerate(core_topics):
            tag = ProblemTag.objects.filter(name__icontains=topic_name).first()
            if tag:
                total_in_topic = Problem.objects.filter(tags=tag, is_published=True).count()
                solved_in_topic = Problem.objects.filter(tags=tag, id__in=solved_problem_ids).count()
            else:
                total_in_topic = Problem.objects.filter(title__icontains=topic_name, is_published=True).count()
                solved_in_topic = Problem.objects.filter(title__icontains=topic_name, id__in=solved_problem_ids).count()

            pct = int((solved_in_topic / total_in_topic) * 100) if total_in_topic > 0 else 0
            
            node_status = 'locked'
            if idx == 0 or solved_in_topic > 0:
                node_status = 'completed' if (total_in_topic > 0 and solved_in_topic >= total_in_topic) else ('in-progress' if solved_in_topic > 0 else 'unlocked')
            
            roadmap_nodes.append({
                'name': topic_name,
                'status': node_status,
                'progress': pct
            })
            topic_progress.append({
                'topic': topic_name,
                'progress': pct,
                'solved': solved_in_topic,
                'total': total_in_topic
            })

        data = {
            'user': UserSerializer(user).data,
            'stats': {
                'current_streak': profile.current_streak if profile else 0,
                'total_xp': profile.total_xp if profile else 0,
                'problems_solved': profile.problems_solved_count if profile else 0,
                'lessons_completed': profile.lessons_completed_count if profile else 0,
                'achievements_count': profile.achievements_count if profile else 0,
                'current_level': profile.current_level if profile else 1,
            },
            'continue_learning': UserContinueLearningSerializer(continue_learning).data if continue_learning else None,
            'daily_goal': daily_goal,
            'roadmap_nodes': roadmap_nodes,
            'topic_progress': topic_progress,
            'weekly_chart': weekly_chart,
            'recent_activities': UserRecentActivitySerializer(recent_qs, many=True).data,
        }
        return Response(data, status=status.HTTP_200_OK)


class ActivityHeatmapView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()
        start_date = today - timedelta(days=364)

        activities = {
            act.activity_date: act.problems_solved + act.lessons_completed
            for act in UserDailyActivity.objects.filter(user=user, activity_date__gte=start_date)
        }

        heatmap = []
        for i in range(365):
            d = start_date + timedelta(days=i)
            count = activities.get(d, 0)
            # Level: 0 (none), 1 (1-2), 2 (3-4), 3 (5-7), 4 (8+)
            level = 0
            if count >= 8:
                level = 4
            elif count >= 5:
                level = 3
            elif count >= 3:
                level = 2
            elif count >= 1:
                level = 1

            heatmap.append({
                'date': d.isoformat(),
                'count': count,
                'level': level,
            })

        return Response({'days': heatmap}, status=status.HTTP_200_OK)


class LeaderboardView(APIView):
    """
    GET /api/v1/progress/leaderboard/
    Returns global XP rankings of all registered coders.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        from apps.accounts.models import UserProfile
        profiles = UserProfile.objects.select_related('user').order_by('-total_xp', '-problems_solved_count')[:50]

        leaderboard = []
        user_rank = None
        user_xp = 0

        for rank, p in enumerate(profiles, start=1):
            entry = {
                'rank': rank,
                'user_id': str(p.user.id),
                'username': p.user.username,
                'full_name': p.user.full_name or p.user.username,
                'avatar_url': p.user.avatar_url or '',
                'total_xp': p.total_xp,
                'current_level': p.current_level,
                'current_streak': p.current_streak,
                'problems_solved': p.problems_solved_count,
            }
            leaderboard.append(entry)

            if request.user.is_authenticated and p.user.id == request.user.id:
                user_rank = rank
                user_xp = p.total_xp

        # If user is beyond top 50, calculate their exact rank
        if request.user.is_authenticated and user_rank is None:
            user_profile = getattr(request.user, 'profile', None)
            if user_profile:
                ahead_count = UserProfile.objects.filter(total_xp__gt=user_profile.total_xp).count()
                user_rank = ahead_count + 1
                user_xp = user_profile.total_xp

        return Response({
            'leaderboard': leaderboard,
            'current_user_rank': user_rank,
            'current_user_xp': user_xp
        }, status=status.HTTP_200_OK)


class UserStatsBreakdownView(APIView):
    """
    GET /api/v1/progress/stats/
    Detailed breakdown of problems solved by difficulty & topic tag, plus streak history.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, 'profile', None)
        from apps.problems.models import Problem, ProblemTag
        from apps.submissions.models import Submission

        # Solved problem IDs
        solved_problem_ids = set(
            Submission.objects.filter(user=user, status='Accepted').values_list('problem_id', flat=True)
        )

        # Difficulty breakdown
        easy_total = Problem.objects.filter(difficulty='Easy', is_published=True).count()
        easy_solved = Problem.objects.filter(id__in=solved_problem_ids, difficulty='Easy').count()

        medium_total = Problem.objects.filter(difficulty='Medium', is_published=True).count()
        medium_solved = Problem.objects.filter(id__in=solved_problem_ids, difficulty='Medium').count()

        hard_total = Problem.objects.filter(difficulty='Hard', is_published=True).count()
        hard_solved = Problem.objects.filter(id__in=solved_problem_ids, difficulty='Hard').count()

        # Tag / Topic breakdown
        tags = ProblemTag.objects.all()
        topics = []
        for tag in tags:
            tag_total = Problem.objects.filter(tags=tag, is_published=True).count()
            tag_solved = Problem.objects.filter(tags=tag, id__in=solved_problem_ids).count()
            if tag_total > 0:
                topics.append({
                    'tag': tag.name,
                    'slug': tag.slug,
                    'solved': tag_solved,
                    'total': tag_total,
                    'percentage': int((tag_solved / tag_total) * 100)
                })

        return Response({
            'overview': {
                'total_solved': len(solved_problem_ids),
                'total_problems': Problem.objects.filter(is_published=True).count(),
                'total_xp': profile.total_xp if profile else 0,
                'current_level': profile.current_level if profile else 1,
                'current_streak': profile.current_streak if profile else 0,
                'longest_streak': profile.longest_streak if profile else 0,
            },
            'difficulty': {
                'easy': {'solved': easy_solved, 'total': easy_total},
                'medium': {'solved': medium_solved, 'total': medium_total},
                'hard': {'solved': hard_solved, 'total': hard_total},
            },
            'topics': topics
        }, status=status.HTTP_200_OK)


class UpdateDailyGoalView(APIView):
    """
    POST /api/v1/progress/daily-goal/
    Update user's daily goal target.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        target = request.data.get('target')
        if target is None:
            return Response({'error': 'target is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_int = int(target)
            if target_int < 1 or target_int > 50:
                return Response({'error': 'target must be between 1 and 50'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error': 'target must be an integer'}, status=status.HTTP_400_BAD_REQUEST)

        profile = request.user.profile
        profile.daily_goal_target = target_int
        profile.save(update_fields=['daily_goal_target'])

        return Response({
            'target': profile.daily_goal_target,
            'message': 'Daily goal updated successfully'
        }, status=status.HTTP_200_OK)

