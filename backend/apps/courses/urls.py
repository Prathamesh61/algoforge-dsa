from django.urls import path
from apps.courses.views import (
    CourseListView,
    CourseDetailView,
    CourseEnrollView,
    LessonDetailView,
    LessonCompleteView,
    LessonQuizSubmitView
)

urlpatterns = [
    path('', CourseListView.as_view(), name='course_list'),
    path('lessons/<slug:slug>/', LessonDetailView.as_view(), name='lesson_detail'),
    path('lessons/<slug:slug>/complete/', LessonCompleteView.as_view(), name='lesson_complete'),
    path('lessons/<slug:slug>/quiz/', LessonQuizSubmitView.as_view(), name='lesson_quiz_submit'),
    path('<slug:slug>/', CourseDetailView.as_view(), name='course_detail'),
    path('<slug:slug>/enroll/', CourseEnrollView.as_view(), name='course_enroll'),
]
