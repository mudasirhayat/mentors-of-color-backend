from .program import Program
from .programuser import ProgramUser
from .session import Match, Session
from auditlog.registry import auditlog


__all__ = (
    'Program',
    'ProgramUser',
    'Match',
    'Session',
)

auditlog.register(Program)
auditlog.register(ProgramUser)
auditlog.register(Match)
auditlog.register(Session)