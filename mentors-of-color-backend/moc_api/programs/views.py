# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ProgramUserSerializer, ProgramCreateSerializer, ProgramListSerializer, ProgramUserMenteeSerializer, ProgramSerializer
from .models import ProgramUser,Program, Match
from .serializers import MatchCreateSerializer
from django.shortcuts import get_object_or_404
from datetime import datetime, date
from django.db.models import Count, Q
from django.contrib.auth import get_user_model
from moc_api.users.serializers import UserLoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return ProgramListSerializer
        elif self.action == 'create':
            return ProgramCreateSerializer
        return ProgramListSerializer

    def list(self, request, *args, **kwargs):
        try:
            account_id = request.GET.get('account_id')
        except:
            account_id = None

        if not account_id:
            return Response({"error": "Account ID parameter is missing"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = self.get_queryset().filter(account_id=account_id, is_active=True)
        programs = queryset.all()  
        serializer = self.get_serializer(programs, many=True) 
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            program_data = serializer.data
            program_data['moderators'] = []
            return Response(program_data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response({"error": "Program with the same unique name already exists"}, status=status.HTTP_400_BAD_REQUEST)

    

    def destroy(self, request, pk=None):
        try:
            program = self.get_object()
            program_users = ProgramUser.objects.filter(program=program)

            for program_user in program_users:
                
                program_user.is_deleted = True
                program_user.is_active = False
                program_user.program.remove(program)
                program_user.save()

            program.is_deleted = True
            program.is_active = False

            program.save()
            program_users.update(is_deleted=True, is_active=False)

            return Response({"message": "Program and associated ProgramUsers marked as deleted"}, status=status.HTTP_204_NO_CONTENT)

        except Program.DoesNotExist:
            return Response({"error": "Program not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

class ProgramModeratorListByProgram(APIView):
    def get(self, request, program_id, format=None):
        try:
            if not program_id:
                return Response({"error": "Account ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
            matches = Match.objects.filter(mentor_id__program=program_id)
            program_users = ProgramUser.objects.filter(
                program=program_id,
                is_moderator=True,
                is_deleted=False,
                is_active=True
            )

            if matches.count() > 0:

                program_user_ids_with_matches =[moderator.id for match in matches for moderator in match.moderator_id.all()]
                serializer_data = []
                for program_user in program_users:
                    is_program_moderator = program_user.id in program_user_ids_with_matches
                    serializer = ProgramUserSerializer(program_user)
                    serialized_data = serializer.data
                    serialized_data['is_program_moderator'] = is_program_moderator
                    serializer_data.append(serialized_data)

                return Response(serializer_data, status=status.HTTP_200_OK)

            elif program_users.count() > 0:
                serializer_data = []
                for program_user in program_users:
                    serializer = ProgramUserSerializer(program_user)
                    serialized_data = serializer.data
                    serialized_data['is_program_moderator'] = False
                    serializer_data.append(serialized_data)

                return Response(serializer_data, status=status.HTTP_200_OK)
            
            else:
                return Response([], status=status.HTTP_200_OK)

           
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
class ProgramUsersView(APIView):
     
    def get(self, request, program_id):
        try:
            program_users = ProgramUser.objects.filter(program__id=program_id, is_active=True)
            serializer = ProgramUserSerializer(program_users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': 'Program or associated users not found'}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, program_id):
        try:
            program_user = ProgramUser.objects.get(id=program_id)
            program = program_user.program.first()
     
            if program_user.is_moderator:
                matches = Match.objects.filter(moderator_id=program_user, mentor_id__program=program)
                if matches.exists():
                    return Response({'message': 'Moderator assigned to a program can not be deleted. Please remove the moderator from the Program to delete the moderator.'}, status=status.HTTP_400_BAD_REQUEST)
            program_user.is_active=False
            program_user.is_deleted=True
            program_user.save()

            return Response({'message': 'Program users marked as inactive and deleted'}, status=status.HTTP_204_NO_CONTENT)
        except ProgramUser.DoesNotExist:
            return Response({'error': 'Program or associated users not found'}, status=status.HTTP_404_NOT_FOUND)


class MatchCreateView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            mentee_ids_str = request.data.get('mentee_ids', [])
        except KeyError:
            mentee_ids_str = []

        try:
try:
    mentee_ids = list(map(int, mentee_ids_str))
except ValueError:
    print("Error: Invalid mentee ID provided.")
    mentee_ids = []
            return Response({'error': 'Invalid mentee_ids format'}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'account_user': request.data.get('account_user'),
            'mentor_id': request.data.get('mentor_id'),
            'mentee_ids': mentee_ids
        }
        existing_match = Match.objects.filter(
            mentor_id=data['mentor_id']
        ).annotate(
            mentee_count=Count('mentee_id'),
            matching_mentees=Count('mentee_id', filter=Q(mentee_id__in=data['mentee_ids']))
        ).filter(
            mentee_count=len(data['mentee_ids']),
            matching_mentees=len(data['mentee_ids'])
        )

        # Check if the exact set of mentees exists for the same mentor
        if existing_match.exists():
            return Response({'error': 'Session already exists'}, status=status.HTTP_400_BAD_REQUEST)


        serializer = MatchCreateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Match created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetMenteesView(APIView):
     
    def get(self, request, program_id, mentor_id):
        try:
            program_users = ProgramUser.objects.filter(program__id=program_id, is_mentee=True  , is_active=True)
            serializer = ProgramUserMenteeSerializer(program_users, many=True, context={"mentor" : mentor_id})
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': 'Program or associated users not found'}, status=status.HTTP_400_BAD_REQUEST)
        

class ManageMatchModerators(APIView):
    def post(self, request, program_id):
        unset_moderators_str = request.data.get('unset_moderators', [])
        set_moderators_str = request.data.get('set_moderators', [])
        if not unset_moderators_str and not set_moderators_str:
            return Response({'message': 'No Moderators Selected'}, status=status.HTTP_400_BAD_REQUEST)
        unset_moderators_set = set(map(int, unset_moderators_str))
        set_moderators_set = set(map(int, set_moderators_str))
        matches = Match.objects.filter(mentor_id__program=program_id)
        if not matches:
            return Response({'message': 'No session exists. Please create any session to assign moderators'}, status=status.HTTP_400_BAD_REQUEST)
        program_users = ProgramUser.objects.filter(program=program_id)
        for match in matches:
            current_moderators = list(match.moderator_id.all())
            mentees = match.mentee_id.all()
            if unset_moderators_str:
                for moderator in current_moderators:
                    if moderator.id in unset_moderators_set:
                        match.moderator_id.remove(moderator)
                        if match.chat:
                            match.chat.member.remove(moderator)

           
            if match and match.matched:
                match_mentee = match.mentee_id.all().first()
                mentee_birth_date = match_mentee.user.userprofile.birth_date
                if mentee_birth_date:
                    today = date.today()
                    age = today.year - mentee_birth_date.year - ((today.month, today.day) < (mentee_birth_date.month, mentee_birth_date.day))
                    if age > 18:
                        continue
           
            # Remove unset moderators
            
            # Add set moderators
            if set_moderators_str:
                for moderator_id in set_moderators_set:
                    moderator_user = get_object_or_404(program_users, id=moderator_id)
                    if moderator_user not in current_moderators:
                        match.moderator_id.add(moderator_user)
                        if match.chat:
                            match.chat.member.add(moderator_user)
        
        return Response({'message': 'Moderators updated successfully'}, status=status.HTTP_200_OK)    
               


class SwitchProgramView(APIView):

    def get_user_type(self, user, program):
        if user.programuser_set.count() > 0:
            program_user = ProgramUser.objects.get(program=program, user=user)
            if program_user.is_mentee == True:
                return "mentee", program_user.id, program_user.program.first().id
            elif program_user.is_mentor == True:
                return "mentor", program_user.id, program_user.program.first().id
            elif program_user.is_moderator == True:
                return "moderator", program_user.id, program_user.program.first().id
            else:
                return "program_user", program_user.id, program_user.program.first().id
            
    
    def get(self, request, program_id, user_id ):
        if not program_id or not user_id:
            return Response({'error': 'Program ID and User ID are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            program = Program.objects.get(id=program_id)
            user = get_user_model().objects.get(id=user_id)
            user_type, associated_user_id, account_id = self.get_user_type(user, program)

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            serializer = UserLoginSerializer(user)
            response_data = {
                'refresh_token': str(refresh),
                'access_token': access_token,
                'user': serializer.data,
                'user_type': user_type,
                'account_id' : account_id,
                'associated_user_id': associated_user_id
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except:
            return Response({'error': 'Program not found.'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        return Response({'message': 'POST request processed'}, status=status.HTTP_201_CREATED)


class GetAssociatedProgramsView(APIView):

    def get(self, request, user_id):
        user = get_object_or_404(get_user_model(), id=user_id)
        
        # Get all ProgramUser instances associated with this user
        program_users = ProgramUser.objects.filter(user=user)
        
        # Collect all unique programs associated with this user
        programs = set()
        for program_user in program_users:
            programs.update(program_user.program.all())
        
        # Serialize the list of programs
        serializer = ProgramSerializer(list(programs), many=True)
        return Response(serializer.data , status=status.HTTP_200_OK)
    

class MenteeUnsetView(APIView):
    def post(self, request):
        mentee_id = request.data.get('mentee_id')
        program_id = request.data.get('program_id')
        mentor_id = request.data.get('mentor_id')
        matches = Match.objects.filter(
            mentee_id=mentee_id,
            mentor_id=mentor_id,
            mentee_id__program__id=program_id
        ).select_related('chat')
        match = matches[0]
        if match.chat:
            if match.mentor_id:
                match.chat.member.remove(mentor_id)
            for mentee in match.mentee_id.all():
                match.chat.member.remove(mentee)
            for moderator in match.moderator_id.all():
                match.chat.member.remove(moderator)
            match.chat.save()
        match.delete()

        return Response({'message': 'Session has been Deleted'}, status=status.HTTP_200_OK)


        