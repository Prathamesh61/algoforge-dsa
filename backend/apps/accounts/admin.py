from django.contrib import admin
from apps.accounts.models import User, UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'full_name', 'auth_provider', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('auth_provider', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'full_name')
    ordering = ('-date_joined',)
    inlines = [UserProfileInline]

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'current_level', 'total_xp', 'current_streak', 'problems_solved_count', 'lessons_completed_count')
    list_filter = ('current_level',)
    search_fields = ('user__username', 'user__email')
    ordering = ('-total_xp',)
