from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        'status': 'healthy',
        'platform': 'AlgoForge DSA Engine',
        'version': '1.0.0',
        'phase': 'Phase 1 - Architecture & Setup Complete'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health/', health_check, name='health_check'),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/courses/', include('apps.courses.urls')),
    path('api/v1/algorithms/', include('apps.algorithms.urls')),
    path('api/v1/problems/', include('apps.problems.urls')),
    path('api/v1/submissions/', include('apps.submissions.urls')),
    path('api/v1/compiler/', include('apps.compiler.urls')),
    path('api/v1/progress/', include('apps.progress.urls')),
    path('api/v1/achievements/', include('apps.achievements.urls')),
    path('api/v1/roadmaps/', include('apps.roadmaps.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
    path('api/v1/search/', include('apps.search.urls')),
]
