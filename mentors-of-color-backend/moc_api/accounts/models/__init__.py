from .account import Account
from .accountuser import AccountUser
from auditlog.registry import auditlog

__all__ = (
    'AccountUser',
)

auditlog.register(Account)
auditlog.register(AccountUser)