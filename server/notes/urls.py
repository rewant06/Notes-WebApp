from django.urls import path
from .views import notes_list, note_detail
urlpatterns = [
    path("", notes_list),
    path("<uuid:note_id>", note_detail),
]