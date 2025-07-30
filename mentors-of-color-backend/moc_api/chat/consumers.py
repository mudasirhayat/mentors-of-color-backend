import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from moc_api.chat.models.chatmessage import ChatMessage
from .models import ChatRoom
from moc_api.programs.models import ProgramUser
from moc_api.users.models import User
from asgiref.sync import sync_to_async
from moc_api.users.serializers import UserSerializer
from .serializers import ChatRoomSerializer
from django.core.serializers import serialize
import asyncio

class ChatConsumer(AsyncWebsocketConsumer):
    
    async def handle_send_message(self, message_data):
        # Handle sending a message.
        # Extract necessary data from message_data.
        room_id = message_data['room_id']
        sender_id = message_data['user_id']
        message_content = message_data['message']
        timestamp = message_data['timestamp']

        # Save the message to the database.
        # Assuming you have appropriate models and relationships set up.
        chat_room = await sync_to_async(ChatRoom.objects.get)(roomId=room_id)
        sender = await sync_to_async(ProgramUser.objects.get)(id=sender_id)
        new_message = await sync_to_async(ChatMessage.objects.create)(chat=chat_room, user=sender, message=message_content, timestamp=timestamp)
        # Save the message to the database.

        # Broadcast the message to other users in the room.
        await self.channel_layer.group_send(
            f"chat_{room_id}",
            {
                'type': 'chat_message',
                'message': message_content,
                'user_id': sender_id,
                'timestamp': timestamp,
            }
        )
    
    async def handle_join_room(self, message_data):
        # Handle a user joining a chat room.
        # Extract necessary data from message_data.
        room_id = message_data['room_id']
        user_id = message_data['user_id']

        # Add the user to the room's group so they receive messages intended for that room.
        response = await self.get_last_six_chat_messages(room_id)
        await self.send(text_data=json.dumps(response))
        await self.channel_layer.group_add(
            f"chat_{room_id}",
            self.channel_name,
        )


    async def handle_leave_room(self, message_data):
        # Handle a user leaving a chat room.
        # Extract necessary data from message_data.
        room_id = message_data['room_id']
        user_id = message_data['user_id']

        # Remove the user from the room's group.
        await self.channel_layer.group_discard(
            f"chat_{room_id}",
            self.channel_name
        )

    async def chat_message(self, event):
        # Called when a message is sent to the room's group.
        # Send the message to the WebSocket.
        sender = await sync_to_async(ProgramUser.objects.get)(id=event['user_id'])
        user_name = await sync_to_async(
            lambda: sender.user.userprofile.full_name if sender else None
        )()

        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'user_id': event['user_id'],
            'timestamp': event['timestamp'],
            'user_name': user_name if user_name else "N/A",

        }))

    async def serialize_chat_message(self, message):
        user_name = await sync_to_async(
            lambda: message.user.user.userprofile.username if message.user else None
        )()
        user_id = await sync_to_async(lambda: message.user.id if message.user else None)()
        sender_receiver_type = "sender" if user_id == int(self.scope['url_route']['kwargs']['userId']) else "receiver"
        return {
            'user_id': user_id,
            'user_name': user_name if user_name else "N/A",
            'message': await sync_to_async(lambda: message.message)(),
            'type': sender_receiver_type,
            'timestamp': await sync_to_async(
                lambda: message.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            )()
        }

    async def get_last_six_chat_messages(self, room_id):
        try:
            # Get the chat room object based on the provided UUID
            chat_room = await sync_to_async(ChatRoom.objects.get)(roomId=room_id)

            # Retrieve the 6 most recent chat messages associated with that chat room
            chat_messages = await sync_to_async(
                lambda: ChatMessage.objects.filter(chat=chat_room).order_by('-timestamp')[:100]
            )()


            # Serialize the chat messages
            serialized_messages = []
            for message in await sync_to_async(list)(chat_messages):
                serialized_message = await self.serialize_chat_message(message)
                serialized_messages.append(serialized_message)
            serialized_messages.reverse()
            return {'type': 'chat_history', 'messages': serialized_messages}

        except ChatRoom.DoesNotExist:
            return {'error': 'Chat room not found'}

    async def receive(self, text_data):
        # Called when a message is received from the WebSocket.
        # Parse the received JSON message.
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'send_message':
            await self.handle_send_message(text_data_json)
        elif message_type == 'join_room':
            await self.handle_join_room(text_data_json)
        elif message_type == 'leave_room':
            await self.handle_leave_room(text_data_json)

    async def connect(self):
        self.userId = self.scope['url_route']['kwargs']['userId']
    
    # Trigger the UserChatRooms API
        rooms_queryset = await sync_to_async(ChatRoom.objects.filter)(member__id=self.userId)
        rooms_list = await sync_to_async(list)(rooms_queryset)
        serializer = ChatRoomSerializer(rooms_list, many=True, context={'user_id': self.userId})
        program_user_query = await sync_to_async(ProgramUser.objects.filter)(id=self.userId)
    
    # Get the first ProgramUser instance asynchronously
        program_user_instance = await sync_to_async(program_user_query.first)()
        
        # Ensure a ProgramUser instance exists
        if program_user_instance:
            # Access the related User instance asynchronously
            user_instance = await sync_to_async(lambda: program_user_instance.user)()
            
            # Access the related UserProfile instance asynchronously
            user_profile_instance = await sync_to_async(lambda: user_instance.userprofile)()
            
            # Set the online status
            user_profile_instance.online_status = True
            
            # Save the changes to userprofile
            await sync_to_async(user_profile_instance.save)()
        await self.accept()

        # Serialize data
        data = await sync_to_async(lambda: serializer.data)()
        data = await asyncio.gather(*(sync_to_async(lambda item: item)(x) for x in data))
        
        # Convert each item to JSON individually to identify the problematic item
        json_data_list = []
        for item in data:
            try:
                if asyncio.iscoroutine(item):
                    # If it's a coroutine, await it to get the actual value
                    item = await item
                
                # Now item should be a regular Python object, so we can serialize it to JSON
                json_data_list.append(json.dumps(item))
            except TypeError:
                print(f"Error serializing item: {item}")

        chat_list_data = [json.loads(chat_list_item) for chat_list_item in json_data_list]
        json_data = {
            "type": "chat_list",
            "chat_list": chat_list_data
        }
        json_string = json.dumps(json_data)
        # Convert JSON data to bytes
        # json_data_bytes = json_data.encode("utf-8")
        # Now you can send the data
        await self.send(text_data=json_string)
        



    async def disconnect(self, close_code):
        self.userId = self.scope['url_route']['kwargs']['userId']
        program_user_query = await sync_to_async(ProgramUser.objects.filter)(id=self.userId )
    
    # Get the first ProgramUser instance asynchronously
        program_user_instance = await sync_to_async(program_user_query.first)()
        
        # Ensure a ProgramUser instance exists
        if program_user_instance:
            # Access the related User instance asynchronously
            user_instance = await sync_to_async(lambda: program_user_instance.user)()
            
            # Access the related UserProfile instance asynchronously
            user_profile_instance = await sync_to_async(lambda: user_instance.userprofile)()
            
            # Set the online status to False
            user_profile_instance.online_status = False
            
            # Save the changes to userprofile
            await sync_to_async(user_profile_instance.save)()

