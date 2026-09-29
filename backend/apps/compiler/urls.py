from django.urls import path
from apps.compiler.views import ExecuteCodeView, TraceCodeView, SupportedLanguagesView

urlpatterns = [
    path('execute/', ExecuteCodeView.as_view(), name='compiler_execute'),
    path('trace/', TraceCodeView.as_view(), name='compiler_trace'),
    path('languages/', SupportedLanguagesView.as_view(), name='compiler_languages'),
]
