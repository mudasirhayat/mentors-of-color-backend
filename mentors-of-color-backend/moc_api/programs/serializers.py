from rest_framework import serializers
from .models import Program, ProgramUser, Match
from moc_api.users.serializers import UserProgramSerializer
from moc_api.accounts.models import AccountUser
from moc_api.chat.models import ChatRoom
from .signals.handlers import match_complete_signal

class ProgramUserSerializer(serializers.ModelSerializer):
    user = UserProgramSerializer()
    class Meta:
        model = ProgramUser
        fields = ('id', 'user', 'is_moderator', 'is_mentor', 'is_mentee')

    
class ProgramUserMenteeSerializer(serializers.ModelSerializer):
    user = UserProgramSerializer()
    matched = serializers.SerializerMethodField()
    class Meta:
        model = ProgramUser
        fields = ('id', 'user', 'is_moderator', 'is_mentor', 'is_mentee', 'matched')

    def get_matched(self, obj):
        mentor = self.context['mentor']
        matched = False
        if Match.has_mentor_mentee_match(mentor, obj):
            matched = True
        return matched

class ProgramListSerializer(serializers.ModelSerializer):
    moderators = serializers.SerializerMethodField()

    class Meta:
        model = Program
        fields = ('id', 'name', 'moderators')

    def get_moderators(self, obj):
        moderators = ProgramUser.objects.filter(program=obj, is_moderator=True, is_active=True)
        serializer = ProgramUserSerializer(moderators, many=True)
        return serializer.data 

class ProgramCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = '__all__'

    def validate_unique_name(self, value):
        """
        Validate that the 'unique_name' field is unique.
        """
        existing_program = Program.objects.filter(unique_name=value, is_active=True).exists()
        if existing_program:
            raise serializers.ValidationError("Program with this unique name already exists.")
        return value

    def create(self, validated_data):
        """
        Create a new Program instance after validating the 'unique_name' field.
        """
        return Program.objects.create(**validated_data)
    

class MatchCreateSerializer(serializers.Serializer):
    account_user = serializers.IntegerField()
    mentor_id = serializers.IntegerField()
    mentee_ids = serializers.ListField(child=serializers.IntegerField())

    def create_chat_room(self, mentor_user, mentee_users):
        if len(mentee_users) > 1:
            room_type = 'Group' 
        else:
            room_type = 'DM'

        chat_room = ChatRoom.objects.create(type=room_type)
        chat_room.member.add(mentor_user, *mentee_users)

        return chat_room

    def create(self, validated_data):
        account_user = validated_data['account_user']
        mentor_id = validated_data['mentor_id']
        mentee_ids = validated_data['mentee_ids']

        account_user = AccountUser.objects.get(pk=account_user)
        mentor_user = ProgramUser.objects.get(pk=mentor_id)
        mentee_users = ProgramUser.objects.filter(pk__in=mentee_ids, is_active=True)

try:
    chat = self.create_chat_room(mentor_user, mentee_users)
    match = Match()
except Exception as e:
    print(f"An error occurred: {e}")
            user_id=account_user,
            mentor_id=mentor_user,
            matched=True,
            chat=chat
        )
        match.save()


        
        match.mentee_id.set(mentee_users)
        match.save()
        match_complete_signal.send(sender=Match, instance=match)

        return match



class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ('id', 'name', 'unique_name')
