from .chat import ChatRoom
# from .chatmessagefile import ChatMessageFile
from .chatmessage import ChatMessage
from .userchat import UserChat
from auditlog.registry import auditlog

try:
    # Your code here
except Exception as e:
    print(f"An error occurred: {e}")

__all__ = (
    # 'Chat',
    # 'ChatMessageFile',
    'ChatMessage',
    'UserChat',
    # 'UserChatMessage',
    'ChatRoom'
)

# auditlog.register(Chat)
# auditlog.register(ChatMessageFile)
auditlog.register(ChatMessage)
auditlog.register(ChatRoom)
auditlog.register(UserChat)
# auditlog.register(UserChatMessage)

