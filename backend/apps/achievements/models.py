import uuid
from django.db import models
from django.conf import settings

class Achievement(models.Model):
    CATEGORY_CHOICES = [
        ('streak', 'Streak Milestones'),
        ('problems', 'Problem Solving'),
        ('courses', 'Learning & Lessons'),
        ('compiler', 'Coding & Submissions'),
        ('special', 'Special Badges'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.SlugField(max_length=50, unique=True, db_index=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    badge_icon = models.CharField(max_length=50, default='Award')
    xp_bonus = models.PositiveIntegerField(default=50)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='special')
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'achievements'
        verbose_name = 'Achievement'
        verbose_name_plural = 'Achievements'
        ordering = ['display_order', 'xp_bonus']

    def __str__(self):
        return f"{self.title} (+{self.xp_bonus} XP)"


class UserAchievement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='unlocked_achievements'
    )
    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.CASCADE,
        related_name='user_unlocks'
    )
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_achievements'
        verbose_name = 'User Achievement'
        verbose_name_plural = 'User Achievements'
        unique_together = ('user', 'achievement')
        ordering = ['-unlocked_at']

    def __str__(self):
        return f"{self.user.username} unlocked {self.achievement.title}"
