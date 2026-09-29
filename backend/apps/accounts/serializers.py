from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.accounts.models import User, UserProfile, UserSettings

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            'theme',
            'preferred_language',
            'default_difficulty',
            'daily_goal',
            'email_notifications',
            'achievement_notifications',
            'daily_reminders',
            'weekly_progress_summary',
            'profile_visibility',
            'show_achievements',
            'show_activity',
            'editor_font_size',
            'editor_theme',
            'tab_size',
            'word_wrap',
            'auto_save',
        ]

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'headline',
            'bio',
            'github_url',
            'linkedin_url',
            'total_xp',
            'current_level',
            'current_streak',
            'longest_streak',
            'last_active_date',
            'daily_goal_target',
            'preferred_language',
            'problems_solved_count',
            'lessons_completed_count',
            'achievements_count',
        ]
        read_only_fields = [
            'total_xp',
            'current_level',
            'current_streak',
            'longest_streak',
            'problems_solved_count',
            'lessons_completed_count',
            'achievements_count',
        ]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    settings = UserSettingsSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'full_name',
            'avatar_url',
            'auth_provider',
            'is_staff',
            'created_at',
            'profile',
            'settings',
        ]
        read_only_fields = ['id', 'auth_provider', 'created_at', 'is_staff']


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=50)
    full_name = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value.lower()

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
            auth_provider='email'
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').lower()
        password = attrs.get('password')

        user = authenticate(email=email, password=password)
        if not user:
            # Fallback check if user provided username instead of email
            user_by_uname = User.objects.filter(username__iexact=email).first()
            if user_by_uname and user_by_uname.check_password(password):
                user = user_by_uname
        
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("User account is inactive.")

        attrs['user'] = user
        return attrs


class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField(required=True)


class UpdateProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', required=False)
    avatar_url = serializers.URLField(source='user.avatar_url', required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = [
            'full_name',
            'avatar_url',
            'headline',
            'bio',
            'github_url',
            'linkedin_url',
            'daily_goal_target',
            'preferred_language',
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if 'full_name' in user_data:
            instance.user.full_name = user_data['full_name']
        if 'avatar_url' in user_data:
            instance.user.avatar_url = user_data['avatar_url']
        instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
