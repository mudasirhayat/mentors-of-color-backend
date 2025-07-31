from moc_api.utils.models import TimestampMixin
from django.db import models
from .program import Program
from moc_api.users.models import User

class ProgramUser(TimestampMixin):
    program = models.ManyToManyField(Program, related_name='program_user')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_moderator = models.BooleanField(default=False)
    is_mentor = models.BooleanField(default=False)
is_mentee = models.BooleanField(default=False, null=False)
is_deleted = models.BooleanField(default=False, null=False)
is_active = models.BooleanField(default=True, null=False)

    def __str__(self):
        program_names = ', '.join(program.name for program in self.program.all())
        return f"{self.user.email} - {program_names}"
