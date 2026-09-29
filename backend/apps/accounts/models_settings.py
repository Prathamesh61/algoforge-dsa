import uuid
from django.db import models
from django.conf import settings

class UserSettings(models.Model):
    THEME_CHOICES = [
        ('dark', 'Dark'),
        ('light', 'Light'),
        ('system', 'System'),
    ]

    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='settings'
    )
    theme = models.CharField(max_length=20, choices=THEME_CHOICES, default='dark')
    preferred_language = models.CharField(max_length=30, default='python')
    default_difficulty = models.CharField(max_length=20, default='Easy')
    daily_goal = models.PositiveIntegerField(default=5)

    # Notifications
    email_notifications = models.BooleanField(default=True)
    achievement_notifications = models.BooleanField(default=True)
    daily_reminders = models.BooleanField(default=True)
    weekly_progress_summary = models.BooleanField(default=True)

    # Privacy
    profile_visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='public')
    show_achievements = models.BooleanField(default=True)
    show_activity = models.BooleanField(default=True)

    # Editor Preferences
    editor_font_size = models.PositiveIntegerField(default=14)
    editor_theme = models.CharField(max_length=30, default='vs-dark')
    tab_size = models.PositiveIntegerField(default=4)
    word_wrap = models.BooleanField(default=True)
    auto_save = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_settings'
        verbose_name = 'User Settings'
        verbose_name_plural = 'User Settings'

    def __str__(self):
        return f"{self.user.username}'s settings"
