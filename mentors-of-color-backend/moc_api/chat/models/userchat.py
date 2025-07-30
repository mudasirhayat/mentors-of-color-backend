from moc_api.utils.models import TimestampMixin
from simple_history.models import HistoricalRecords
from django.db import models
from moc_api.users.models import User
from .chat import ChatRoom
# from .chat import ChatRoom

class UserChat(TimestampMixin):
    _from = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    _to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')
    chat_room_id = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, null=True)
    text=models.TextField(null=True, blank=True)
    is_visible = models.BooleanField(default=False)