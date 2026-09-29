from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from apps.achievements.models import Achievement, UserAchievement
from apps.achievements.serializers import AchievementSerializer
from apps.achievements.services.evaluator import AchievementChecker

class AchievementListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            # Check criteria before listing
            AchievementChecker.check_and_unlock(request.user)

        achievements = Achievement.objects.all().order_by('display_order', 'xp_bonus')
        serializer = AchievementSerializer(achievements, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AchievementCheckView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        newly_unlocked = AchievementChecker.check_and_unlock(request.user)
        serializer = AchievementSerializer(newly_unlocked, many=True, context={'request': request})
        return Response({
            'newly_unlocked_count': len(newly_unlocked),
            'achievements': serializer.data
        }, status=status.HTTP_200_OK)
