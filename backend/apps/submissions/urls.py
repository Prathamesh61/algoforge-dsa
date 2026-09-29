from django.urls import path
from apps.submissions.views import SubmissionListCreateView, SubmissionDetailView

urlpatterns = [
    path('', SubmissionListCreateView.as_view(), name='submission_list_create'),
    path('<uuid:pk>/', SubmissionDetailView.as_view(), name='submission_detail'),
]
