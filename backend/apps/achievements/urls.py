from django.urls import path
from apps.achievements.views import AchievementListView, AchievementCheckView

urlpatterns = [
    path('', AchievementListView.as_view(), name='achievement_list'),
    path('check/', AchievementCheckView.as_view(), name='achievement_check'),
]
