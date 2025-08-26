import json
from django.http import JsonResponse, HttpResponseNotAllowed
from django.contrib.auth.decorators import login_required
from .models import Note

@login_required
def notes_list(request):
    if request.method == "GET":
        items = [{
            "note_id": str(n.note_id),
            "note_title": n.note_title,
            "note_content": n.note_content,
            "last_update": n.last_update.isoformat(),
            "created_on": n.created_on.isoformat(),
        } for n in Note.objects.filter(user=request.user)]
        return JsonResponse({"items": items})
    if request.method == "POST":
        data = json.loads(request.body or "{}")
        n = Note.objects.create(
            user=request.user,
            note_title=data.get("note_title",""),
            note_content=data.get("note_content",""),
        )
        return JsonResponse({"note_id": str(n.note_id)}, status=201)
    return HttpResponseNotAllowed(["GET","POST"])

@login_required
def note_detail(request, note_id):
    try:
        n = Note.objects.get(note_id=note_id, user=request.user)
    except Note.DoesNotExist:
        return JsonResponse({"error":"Not found"}, status=404)
    if request.method == "GET":
        return JsonResponse({
            "note_id": str(n.note_id),
            "note_title": n.note_title,
            "note_content": n.note_content,
            "last_update": n.last_update.isoformat(),
            "created_on": n.created_on.isoformat(),
        })
    if request.method == "PUT":
        data = json.loads(request.body or "{}")
        n.note_title = data.get("note_title", n.note_title)
        n.note_content = data.get("note_content", n.note_content)
        n.save()
        return JsonResponse({"ok": True})
    if request.method == "DELETE":
        n.delete(); return JsonResponse({"ok": True})
    return HttpResponseNotAllowed(["GET","PUT","DELETE"])