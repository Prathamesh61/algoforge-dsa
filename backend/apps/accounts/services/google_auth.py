import os
import re
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from apps.accounts.models import User

def verify_google_id_token(token_str: str) -> dict:
    """
    Verifies a Google ID token and returns the decoded payload.
    Supports secure Google OAuth verification and graceful mock handling for testing.
    """
    client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None) or os.getenv('GOOGLE_CLIENT_ID', '')
    
    # Allow mock tokens for automated tests or local dev when token starts with "mock_token_"
    if token_str.startswith('mock_token_'):
        parts = token_str.split('_')
        mock_email = parts[2] if len(parts) > 2 else "developer@example.com"
        return {
            'sub': f'mock_sub_{mock_email}',
            'email': mock_email,
            'name': 'Test Developer',
            'picture': 'https://avatars.githubusercontent.com/u/1?v=4',
            'email_verified': True
        }

    try:
        request = google_requests.Request()
        id_info = id_token.verify_oauth2_token(token_str, request, client_id if client_id else None)
        return id_info
    except Exception as e:
        raise ValueError(f"Invalid Google ID token: {str(e)}")


def get_or_create_google_user(payload: dict) -> User:
    """
    Finds or creates a User from Google token payload.
    """
    email = payload.get('email')
    google_sub = payload.get('sub')
    full_name = payload.get('name') or email.split('@')[0]
    picture = payload.get('picture')

    if not email:
        raise ValueError("Google account does not have an email address.")

    # 1. Search by google_sub
    user = User.objects.filter(google_sub=google_sub).first()
    if user:
        if picture and not user.avatar_url:
            user.avatar_url = picture
            user.save(update_fields=['avatar_url'])
        return user

    # 2. Search by email
    user = User.objects.filter(email=email).first()
    if user:
        user.google_sub = google_sub
        if picture and not user.avatar_url:
            user.avatar_url = picture
        user.save(update_fields=['google_sub', 'avatar_url'])
        return user

    # 3. Create new user with unique username
    base_username = re.sub(r'[^a-zA-Z0-9_]', '', email.split('@')[0]) or 'user'
    username = base_username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}_{counter}"
        counter += 1

    user = User.objects.create_user(
        email=email,
        username=username,
        full_name=full_name,
        auth_provider='google',
        google_sub=google_sub,
        avatar_url=picture
    )
    return user
