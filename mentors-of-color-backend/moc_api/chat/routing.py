from django.urls import re_path
from moc_api.chat.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(
        r'users/(?P<userId>\w+)/chat/$',
        ChatConsumer.as_asgi()
    ),
]