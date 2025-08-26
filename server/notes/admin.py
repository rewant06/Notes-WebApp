from django.contrib import admin
from .models import Note
@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
  list_display = ("note_title","user","last_update","created_on")
  search_fields = ("note_title","note_content")