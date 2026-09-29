from rest_framework import serializers
from apps.progress.models import UserDailyActivity, UserRecentActivity, UserContinueLearning

class UserDailyActivitySerializer(serializers.ModelSerializer):
    day_name = serializers.SerializerMethodField()

    class Meta:
        model = UserDailyActivity
        fields = [
            'activity_date',
            'day_name',
            'problems_solved',
            'lessons_completed',
            'xp_earned',
            'coding_minutes',
        ]

    def get_day_name(self, obj):
        return obj.activity_date.strftime('%a')


class UserRecentActivitySerializer(serializers.ModelSerializer):
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = UserRecentActivity
        fields = [
            'id',
            'activity_type',
            'title',
            'subtitle',
            'xp_earned',
            'time_ago',
            'created_at',
        ]

    def get_time_ago(self, obj):
        from django.utils.timezone import now
        diff = now() - obj.created_at
        if diff.days > 0:
            return f"{diff.days}d ago"
        hours = diff.seconds // 3600
        if hours > 0:
            return f"{hours}h ago"
        minutes = (diff.seconds % 3600) // 60
        return f"{max(1, minutes)}m ago"


class UserContinueLearningSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserContinueLearning
        fields = [
            'item_type',
            'title',
            'module_title',
            'slug',
            'progress_percentage',
        ]
