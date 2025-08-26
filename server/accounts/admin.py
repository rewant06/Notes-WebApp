from django.contrib import admin
from .models import User
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("user_email", "user_name", "create_on", "last_update", "is_staff")
    search_fields = ("user_email","user_name")