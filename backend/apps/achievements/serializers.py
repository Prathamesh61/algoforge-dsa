from rest_framework import serializers
from apps.achievements.models import Achievement, UserAchievement

class AchievementSerializer(serializers.ModelSerializer):
    is_unlocked = serializers.SerializerMethodField()
    unlocked_at = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = [
            'id',
            'code',
            'title',
            'description',
            'badge_icon',
            'xp_bonus',
            'category',
            'display_order',
            'is_unlocked',
            'unlocked_at'
        ]

    def get_is_unlocked(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return UserAchievement.objects.filter(user=request.user, achievement=obj).exists()

    def get_unlocked_at(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        ua = UserAchievement.objects.filter(user=request.user, achievement=obj).first()
        return ua.unlocked_at.isoformat() if ua else None
