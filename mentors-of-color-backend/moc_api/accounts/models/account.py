from moc_api.utils.models import TimestampMixin
from simple_history.models import HistoricalRecords
from django.db import models
from moc_api.users.models import User

class Account(TimestampMixin):
name = models.CharField(max_length=100)
account_owner_id = models.OneToOneField(User, on_delete=models.CASCADE, related_name='account_owner')
unique_name = models.CharField(max_length=255, unique=True)
    is_deleted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    history = HistoricalRecords()

    def __str__(self) -> str:
        return self.name    