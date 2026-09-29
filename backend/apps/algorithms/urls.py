from django.urls import path
from apps.algorithms.views import AlgorithmListView, AlgorithmDetailView

urlpatterns = [
    path('', AlgorithmListView.as_view(), name='algorithm_list'),
    path('<slug:slug>/', AlgorithmDetailView.as_view(), name='algorithm_detail'),
]
