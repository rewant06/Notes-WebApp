import uuid
from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, user_name, password=None, **extra):
        if not email: raise ValueError("Email required")
        email = self.normalize_email(email)
        user = self.model(user_id=uuid.uuid4(), user_email=email, user_name=user_name, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, user_name="admin", password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self.create_user(email=email, user_name=user_name, password=password, **extra)

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_name = models.CharField(max_length=150)
    user_email = models.EmailField(unique=True)
    last_update = models.DateTimeField(auto_now=True)
    create_on = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "user_email"
    REQUIRED_FIELDS = ["user_name"]

    objects = UserManager()
    def __str__(self): return self.user_email