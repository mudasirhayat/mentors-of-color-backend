from moc_api.utils.models import TimestampMixin
from simple_history.models import HistoricalRecords
from django.db import models
from moc_api.users.models import User
from .account import Account


class AccountUser(TimestampMixin):
    account_id = models.ForeignKey(Account, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    is_deleted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        try:
            return self.user_id.userprofile.full_name 
        except:
            return self.user_id.email
        