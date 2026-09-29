from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.accounts.views import (
    RegisterView,
    LoginView,
    GoogleAuthView,
    MeView,
    LogoutView,
    UserSettingsView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('google/', GoogleAuthView.as_view(), name='auth_google'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('me/', MeView.as_view(), name='auth_me'),
    path('settings/', UserSettingsView.as_view(), name='auth_settings'),
]

