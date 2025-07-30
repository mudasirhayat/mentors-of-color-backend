from moc_api.utils.models import TimestampMixin
from simple_history.models import HistoricalRecords
from django.db import models
from moc_api.users.models import User
from moc_api.accounts.models import Account

class Program(TimestampMixin):
    name = models.CharField(max_length=255)
    unique_name = models.CharField(max_length=255, unique=True)
    program_administrator_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cohort_admin')
    account_id = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='program_admin')
    is_deleted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    requires_moderators = models.BooleanField(default=False)
    record_all_sessions = models.BooleanField(default=False)
    
    history = HistoricalRecords()

    def __str__(self) -> str:
        return self.name