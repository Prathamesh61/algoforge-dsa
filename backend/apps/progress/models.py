import uuid
from django.db import models
from django.conf import settings

class UserDailyActivity(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='daily_activities'
    )
    activity_date = models.DateField(db_index=True)
    problems_solved = models.PositiveIntegerField(default=0)
    lessons_completed = models.PositiveIntegerField(default=0)
    xp_earned = models.PositiveIntegerField(default=0)
    coding_minutes = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'user_daily_activities'
        verbose_name = 'User Daily Activity'
        verbose_name_plural = 'User Daily Activities'
        unique_together = ('user', 'activity_date')
        ordering = ['-activity_date']

    def __str__(self):
        return f"{self.user.username} on {self.activity_date} (+{self.xp_earned} XP)"


class UserRecentActivity(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='recent_activities'
    )
    activity_type = models.CharField(
        max_length=50,
        choices=[
            ('lesson_completed', 'Lesson Completed'),
            ('problem_solved', 'Problem Solved'),
            ('achievement_unlocked', 'Achievement Unlocked'),
            ('streak_milestone', 'Streak Milestone'),
        ]
    )
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    xp_earned = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'user_recent_activities'
        verbose_name = 'User Recent Activity'
        verbose_name_plural = 'User Recent Activities'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title} (+{self.xp_earned} XP)"


class UserContinueLearning(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='continue_learning',
        primary_key=True
    )
    item_type = models.CharField(max_length=20, default='lesson')
    title = models.CharField(max_length=200, default='Binary Search')
    module_title = models.CharField(max_length=200, default='Module 3 • Searching')
    slug = models.CharField(max_length=100, default='binary-search')
    progress_percentage = models.PositiveIntegerField(default=72)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_continue_learning'
        verbose_name = 'User Continue Learning'
        verbose_name_plural = 'User Continue Learning'

    def __str__(self):
        return f"{self.user.username} left off at {self.title} ({self.progress_percentage}%)"
