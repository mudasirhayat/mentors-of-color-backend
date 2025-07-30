
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ChatRoomSerializer
from .models import ChatRoom

class UserChatRooms(APIView):
   def get(self, request, program_user):
        try:
            # Retrieve ch``at rooms where the user with the specified ID is a member
            rooms = ChatRoom.objects.filter(member__id=program_user)
            # Serialize the data
            serializer = ChatRoomSerializer(rooms, many=True, context={'user_id': program_user})

            # Return the serialized data in the response
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD)