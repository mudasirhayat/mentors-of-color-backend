from .serializers import UserSerializer , UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer
from rest_framework import viewsets
from.models import UserProfile
from dj_rest_auth.registration.views import RegisterView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from moc_api.accounts.models import AccountUser, Account
from moc_api.programs.models import ProgramUser, Program
from rest_framework.response import Response
from moc_api.programs.serializers import ProgramSerializer
from rest_framework import status
import django
from django.http import Http404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework import authentication, permissions
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.models import Site
from django.utils.http import urlsafe_base64_encode

class GetUserProgramView(APIView):

    def patch(self, request, pk):
        user = get_user_model().objects.get(pk=pk)
        programs = Program.objects.filter(
            program_user__user=user,
            program_user__is_active=True
        ).distinct()

        serializer = ProgramSerializer(programs, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class UserProfileView(APIView):
    def get_object(self, pk):
        try:
            return UserProfile.objects.get(pk=pk)
        except UserProfile.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        profile = self.get_object(pk)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        profile = self.get_object(pk)
        serializer = UserProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomRegisterView(RegisterView):
    serializer_class =  UserRegistrationSerializer

    def get_response_data(self, user):
        refresh = RefreshToken.for_user(user)

        return {
            'user': UserSerializer(instance=user).data,
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        }
    def send_program_user_email(self, user, program):

         # if Site.objects.filter(domain="qa.app.duett.io"):
        #     env_label = "QA:"
        # elif Site.objects.filter(domain="staging.app.duett.io"):
        #     env_label = "STG:"
        # else:
        env_label = "QA:"
        uidb64 = urlsafe_base64_encode(str(user.pk).encode())
        default_token_generator = PasswordResetTokenGenerator()
        token = default_token_generator.make_token(user)
        current_site = Site.objects.get_current()

        url = f"http://{current_site.domain}/"
        message_body = f"""
            You have been Added in {program}.\n\n
            Please click the button below to access your account:\n\n
            {url}
            """


        message = EmailMessage(
            f"{env_label} Added to a new program ! {program}",
            message_body,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
        )
        message.content_subtype = "html"
        message.send()

    def create_program_user(self, user, program_id, is_moderator, is_mentor, is_mentee):
        programs = Program.objects.filter(id=program_id, is_active=True)

        existing_program_user = ProgramUser.objects.filter(
            user=user,
            program__in=programs,
            is_moderator=is_moderator,
            is_mentor=is_mentor,
            is_mentee=is_mentee,
            is_deleted=False 
        ).exists()
        if existing_program_user:
            return {}, False

        program_user = ProgramUser.objects.create(
            user=user,
            is_moderator=is_moderator,
            is_mentor=is_mentor,
            is_mentee=is_mentee
        )

        self.send_program_user_email(user, programs[0].name)
        program_user.program.set(programs)
        return program_user, True


    def create_account_user(self, user, account_id):
        account = Account.objects.get(pk=account_id)

        existing_account_user = AccountUser.objects.filter(
            user_id=user,
            account_id=account_id,
            is_deleted=False 
        ).exists()

        if existing_account_user:
            return {}, False

        user = AccountUser.objects.create(
            user_id=user,
            account_id=account
        )
        return user, True

    def create_user(self, request, user):
        user_type = request.data.get('user_type')
            
        if user_type == 'program_user':
                program_id = request.data.get('program_id')
                is_moderator = request.data.get('is_moderator', False)
                is_mentor = request.data.get('is_mentor', False)
                is_mentee = request.data.get('is_mentee', False)
                return self.create_program_user(user, program_id, is_moderator, is_mentor, is_mentee)

        elif user_type == 'account_user':
                account_id = request.data.get('account_id')
                group = request.data.get('group')
                return self.create_account_user(user, account_id)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
    
        with transaction.atomic():
            email = request.data.get('email')
            if email:
                existing_user = get_user_model().objects.filter(email=email).first()

            if existing_user:
                serializer = self.get_serializer(existing_user)
                user, success = self.create_user(request, existing_user)
                if success:
                        serializer = UserSerializer(existing_user)
                        return Response({"user": serializer.data}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "User already exist with this email."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user = self.perform_create(serializer)
                self.create_user(request, user)
                headers = self.get_success_headers(serializer.data)
                return Response(self.get_response_data(user), status=status.HTTP_201_CREATED, headers=headers)
                  

class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(email=email, password=password)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.programuser_set.exists() and not user.accountuser_set.exists():
            return Response({'error': 'User is not associated to any Program or Account'}, status=status.HTTP_401_UNAUTHORIZED)
        user_type, associated_user_id, account_id = self.get_user_type(user)

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

    def get_user_type(self, user):
        if user.programuser_set.count() > 0:
            program_user = ProgramUser.objects.filter(user=user).first()
            if program_user.is_mentee == True:
                return "mentee", program_user.id, program_user.program.first().id
            elif program_user.is_mentor == True:
                return "mentor", program_user.id, program_user.program.first().id
            elif program_user.is_moderator == True:
                return "moderator", program_user.id, program_user.program.first().id
            else:
                return "program_user", program_user.id, program_user.program.first().id
            
        if user.accountuser_set.count() > 0:
            account_user = AccountUser.objects.get(user_id=user)
            return "account_user", account_user.id, account_user.account_id.id

        return ""
        