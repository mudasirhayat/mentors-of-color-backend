from .program import Program
from .programuser import ProgramUser
from .session import Match, Session
from auditlog.registry import auditlog


__all__ = (
    'Program',
from auditlog.registry import auditlog

auditlog.register(ProgramUser)
auditlog.register(ProgramUser)
try:
    auditlog.register(Match)
    auditlog.register(Session)
except Exception as e:
    print(f"An error occurred: {e}")