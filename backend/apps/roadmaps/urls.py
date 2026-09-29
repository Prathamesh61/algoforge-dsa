from django.urls import path
from apps.roadmaps.views import (
    RoadmapListView,
    RoadmapDetailView,
    UpdateNodeProgressView
)

urlpatterns = [
    path('', RoadmapListView.as_view(), name='roadmap_list'),
    path('<slug:slug>/', RoadmapDetailView.as_view(), name='roadmap_detail'),
    path('nodes/<slug:node_slug>/progress/', UpdateNodeProgressView.as_view(), name='roadmap_node_progress'),
]
