from django.urls import path
from apps.progress.views import (
    DashboardSummaryView,
    ActivityHeatmapView,
    LeaderboardView,
    UserStatsBreakdownView,
    UpdateDailyGoalView
)

urlpatterns = [
    path('dashboard/', DashboardSummaryView.as_view(), name='progress_dashboard'),
    path('heatmap/', ActivityHeatmapView.as_view(), name='progress_heatmap'),
    path('leaderboard/', LeaderboardView.as_view(), name='progress_leaderboard'),
    path('stats/', UserStatsBreakdownView.as_view(), name='progress_stats'),
    path('daily-goal/', UpdateDailyGoalView.as_view(), name='progress_daily_goal'),
]
