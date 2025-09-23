import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token

User = get_user_model()

@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})

def _data_from_request(request):
    ctype = (request.META.get("CONTENT_TYPE") or "").split(";")[0].strip().lower()
    if ctype == "application/json":
        try:
            return json.loads((request.body or b"").decode("utf-8") or "{}")
        except json.JSONDecodeError:
            return {}
    # Fallback for form-encoded
    return request.POST.dict()

@require_http_methods(["POST"])
def signup(request):
    data = _data_from_request(request)
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    if not all([email, username, password]):
        return JsonResponse({"error": "Missing fields"}, status=400)
    if User.objects.filter(user_email=email).exists():
        return JsonResponse({"error": "Email exists"}, status=409)
    User.objects.create_user(email=email, user_name=username, password=password)
    return JsonResponse({"ok": True})

@require_http_methods(["POST"])
def login_view(request):
    data = _data_from_request(request)
    email = data.get("email")
    password = data.get("password")
    user = authenticate(request, username=email, password=password)
    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=401)
    login(request, user)
    return JsonResponse({"ok": True})

@require_http_methods(["POST"])
def logout_view(request):
    logout(request)
    return JsonResponse({"ok": True})

@login_required
def me(request):
    u = request.user
    return JsonResponse({"id": str(u.user_id), "email": u.user_email, "name": u.user_name})