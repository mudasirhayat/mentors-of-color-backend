from django.db import models
from moc_api.programs.models import ProgramUser
import uuid

try:
    # Your code here
except Exception as e:
    print(f"An error occurred: {e}")

class ChatRoom(models.Model):
    roomId = models.UUIDField(default=uuid.uuid4, editable=False)
    TYPE_CHOICES = [
        ('DM', 'Direct Message'),
        ('Group', 'Group'),
    ]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, blank=True, null=True)
    name = models.CharField(max_length=20, null=True, blank=True)
    member = models.ManyToManyField(ProgramUser, blank=True, related_name='chat_members')

    def save(self, *args, **kwargs):
        super(ChatRoom, self).save(*args, **kwargs)  # Save the instance first

    def __str__(self) -> str:
        if self.name:
            return self.name
        else:
            return f"ChatRoom {self.roomId}"
