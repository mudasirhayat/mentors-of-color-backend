from moc_api.utils.models import TimestampMixin
from simple_history.models import HistoricalRecords
from django.db import models
from moc_api.users.models import User
from .chatmessage import ChatMessage

class ChatMessageFile(TimestampMixin):
    chat_message_id = models.ForeignKey(ChatMessage, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='chat_files/', blank=True, null=True)