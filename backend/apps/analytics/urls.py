from django.urls import path
from apps.analytics.views import PlatformAnalyticsView, UserAnalyticsView

urlpatterns = [
    path('platform/', PlatformAnalyticsView.as_view(), name='platform_analytics'),
    path('user/', UserAnalyticsView.as_view(), name='user_analytics'),
]
