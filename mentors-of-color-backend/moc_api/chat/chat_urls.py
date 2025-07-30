from .views import UserChatRooms
from django.urls import path

urlpatterns = [
    path('<int:program_user>/rooms/', UserChatRooms.as_view(),  name='user-chat-rooms'),
]