from moc_api.utils.models import TimestampMixin
from simple_history.models import HistoricalRecords
from django.db import models
from moc_api.users.models import User
from moc_api.programs.models import ProgramUser
from .chat import ChatRoom
from django.utils import timezone

# class ChatMessage(TimestampMixin):
#     unique_id= models.UUIDField(default= uuid.uuid4)
#     text=models.TextField()
#     send_by_user_id = models.OneToOneField(User, on_delete=models.CASCADE)
#     is_deleted = models.BooleanField(default=False)

class ChatMessage(TimestampMixin):
    chat = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(ProgramUser, on_delete=models.CASCADE, null=True)
    message = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message