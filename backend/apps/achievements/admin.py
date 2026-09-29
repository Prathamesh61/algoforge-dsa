from django.contrib import admin
from apps.achievements.models import Achievement, UserAchievement

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'code', 'category', 'xp_bonus', 'badge_icon', 'display_order')
    list_filter = ('category',)
    search_fields = ('title', 'code', 'description')

@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'achievement', 'unlocked_at')
    list_filter = ('achievement__category',)
    search_fields = ('user__username', 'achievement__title')
