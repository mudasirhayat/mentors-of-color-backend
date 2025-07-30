from django.contrib import admin
from .models import Program, ProgramUser, Match, Session
# Register your models here.
admin.site.register(Program)
admin.site.register(ProgramUser)
admin.site.register(Match)
admin.site.register(Session)
