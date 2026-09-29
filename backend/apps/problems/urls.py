from django.urls import path
from apps.problems.views import ProblemListView, ProblemDetailView, ProblemTagListView

urlpatterns = [
    path('', ProblemListView.as_view(), name='problem_list'),
    path('tags/', ProblemTagListView.as_view(), name='problem_tag_list'),
    path('<slug:slug>/', ProblemDetailView.as_view(), name='problem_detail'),
]
