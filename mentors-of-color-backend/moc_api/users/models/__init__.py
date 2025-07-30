from .user import User, UserProfile
from auditlog.registry import auditlog


__all__ = (
    'User',
    'User Profile',
)

auditlog.register(User)
auditlog.register(UserProfile)