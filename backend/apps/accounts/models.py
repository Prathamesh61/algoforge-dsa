import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserManager(BaseUserManager):
    def create_user(self, email, username, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required')
        if not username:
            raise ValueError('Username is required')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            username=username,
            full_name=full_name,
            **extra_fields
        )
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, username, full_name, password, **extra_fields)


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    username = models.CharField(max_length=50, unique=True, db_index=True)
    full_name = models.CharField(max_length=150)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    auth_provider = models.CharField(
        max_length=20,
        default='email',
        choices=[('email', 'Email'), ('google', 'Google')]
    )
    google_sub = models.CharField(max_length=255, unique=True, null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.full_name} ({self.email})"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', primary_key=True)
    headline = models.CharField(max_length=255, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    github_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)

    total_xp = models.PositiveIntegerField(default=0)
    current_level = models.PositiveIntegerField(default=1)
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    daily_goal_target = models.PositiveIntegerField(default=3)
    preferred_language = models.CharField(max_length=30, default='python')

    problems_solved_count = models.PositiveIntegerField(default=0)
    lessons_completed_count = models.PositiveIntegerField(default=0)
    achievements_count = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"Profile of {self.user.username} (Lvl {self.current_level} • {self.total_xp} XP)"

    def update_level(self):
        """
        Level progression:
        Level 1: 0 - 99 XP
        Level 2: 100 - 299 XP
        Level 3: 300 - 599 XP
        Level 4: 600 - 999 XP
        Level 5: 1000 - 1999 XP
        Level 6+: 2000+ XP
        """
        xp = self.total_xp
        if xp < 100:
            level = 1
        elif xp < 300:
            level = 2
        elif xp < 600:
            level = 3
        elif xp < 1000:
            level = 4
        elif xp < 2000:
            level = 5
        else:
            level = 6 + (xp - 2000) // 1000
        
        if self.current_level != level:
            self.current_level = level
            self.save(update_fields=['current_level'])
        return self.current_level


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
        User,
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


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        UserSettings.objects.create(user=instance)
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()
        if hasattr(instance, 'settings'):
            instance.settings.save()

