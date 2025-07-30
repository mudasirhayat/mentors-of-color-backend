from rest_framework import serializers
from moc_api.users.models import User,UserProfile
from .models import UserChat, ChatRoom
from django.contrib.auth import get_user_model
from moc_api.programs.models import ProgramUser


class UserChatSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserChat
        fields = "__all__"


class ChatRoomSerializer(serializers.ModelSerializer):
    room_name = serializers.SerializerMethodField()
    member_details = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['roomId', 'type', 'room_name', 'member_details']

    def get_room_name(self, obj):
        user_id = self.context.get('user_id')
        # mem = obj.member.exclude(is_moderator=True)r
        breakpoint()
        mem = ChatRoom.objects.get(roomId=obj.roomId).member.exclude(is_moderator=True)
        program_user = ProgramUser.objects.get(id=user_id)
        user_is_mentor = None
        user_is_mentee = None
        if program_user.is_mentee:
            user_is_mentor = mem.exclude(is_mentee=True).first()
        if program_user.is_mentor:
            user_is_mentee = mem.exclude(is_mentor=True).first()

        if mem.count() <= 2:
            obj.type = "DM"
            obj.save()
            if user_is_mentor:
                return user_is_mentor.user.userprofile.full_name
            if user_is_mentee:
                return user_is_mentee.user.userprofile.full_name

            program = ProgramUser.objects.filter(id=user_id).first().program.first()
            for_moderator = (str(mem.exclude(is_mentor=True).first().user.userprofile.full_name) + str(' , ') +
                             str(mem.exclude(is_mentee=True).first().user.userprofile.full_name))
            return for_moderator
        else:
            obj.type = "Group"
            obj.save()
            mem = obj.member.exclude(id=user_id).first()  # Get the first member
            if mem:
                full_name = mem.user.userprofile.full_name or mem.user.username
                return full_name
        return None
        #
        # if obj.type == 'Group':
        #     program = ProgramUser.objects.filter(id=user_id).first().program.first()
        #     return program.name if obj.name == None else obj.name
        #
        # elif obj.type == 'DM':
        #     mem = obj.member.exclude(id=user_id).first()  # Get the first member
        #     if mem:
        #         full_name = mem.user.userprofile.full_name or mem.user.username
        #         return full_name
        # return None

    def get_member_details(self, obj):
        member_details = []
        user_id = self.context.get('user_id')
        for member in obj.member.all():
            if member.id != int(user_id):
                online_status = member.user.userprofile.online_status  # Exclude the requesting user
                member_data = {
                    'is_mentor': member.is_mentor,
                    'is_mentee': member.is_mentee,
                    'is_moderator': member.is_moderator,
                    'online_status': online_status
                }
                member_details.append(member_data)
        return member_details