from django.urls import path
from .views import signup, login_view, logout_view, me, csrf_token
urlpatterns = [
    path("signup", signup),
    path("login", login_view),
    path("logout", logout_view),
    path("me", me),
    path("csrf", csrf_token),
]