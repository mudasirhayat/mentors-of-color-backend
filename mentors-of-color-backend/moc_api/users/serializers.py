from rest_framework import serializers
from .models import User,UserProfile
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.sites.models import Site
from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from dj_rest_auth.serializers import LoginSerializer
from django.contrib.auth import get_user_model
from dj_rest_auth.serializers import PasswordResetConfirmSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode as uid_decoder
from django.utils.encoding import force_str
from rest_framework.exceptions import ValidationError



class UserRegistrationSerializer(RegisterSerializer):
    user_type = serializers.CharField(write_only=True)
    """
    For allauth library
    """

    password2 = serializers.CharField(
        style={"input_type": "password"}, write_only=True
    )

    class Meta:
        model = get_user_model()
        fields = ["email", "password", "password2", "user_type"]
        extra_kwargs = {"password": {"write_only": True}}

    def save(self, request, *args, **kwargs):
        password = self.validated_data["password1"]
        password2 = self.validated_data["password2"]

        if password != password2:
            raise serializers.ValidationError(
                {"password": "Passwords must match."}
            )

        user = get_user_model().objects.create_user(
            email=self.validated_data["email"],
            password=password,
            is_staff=self.validated_data.get("is_staff", False),
            is_active=self.validated_data.get("is_active", True),
        )

        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'phone', 'username', 'profile_photo_url', 'birth_date', 'online_status']

        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone': {'required': False},
            'username': {'required': False},
            'profile_photo_url': {'required': False},
            'birth_date': {'required': False},
            'online_status': {'required': False},
        }


class UserSerializer(serializers.ModelSerializer):
    user_type = serializers.CharField(write_only=True)
    user_profile = UserProfileSerializer(many=False, source="userprofile") 

    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'password','user_profile', 'user_type']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    except Exception as e:
        raise serializers.ValidationError(str(e))

class UserLoginSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer(many=False, source="userprofile", read_only=True)

    class Meta:
        model = get_user_model()
        fields = ["id" , "email", "user_profile"]

    
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password_reset_form_class = PasswordResetForm
    def validate_email(self, value):
        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(_('Error'))

        ###### FILTER YOUR USER MODEL ######
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_('Invalid e-mail address'))
        return value

    def save(self):
        request = self.context.get('request')
        # if Site.objects.filter(domain="qa.app.duett.io"):
        #     env_label = "QA:"
        # elif Site.objects.filter(domain="staging.app.duett.io"):
        #     env_label = "STG:"
        # else:
        env_label = ""

        opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),

            ###### USE YOUR HTML FILE ######
            'html_email_template_name': 'password_reset_email.html',
            'subject_template_name': 'subject_template_name.txt',
            'request': request,
        }
        extra_email_context = {
            'env_label': f"{env_label}",
        }
        self.reset_form.save(**opts,extra_email_context=extra_email_context)


class UserProfileProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'phone', 'username'] 

class UserProgramSerializer(serializers.ModelSerializer):
    
    user_profile = UserProfileProgramSerializer(many=False, source="userprofile") 

    class Meta:
        model = User
        fields = ['id', 'email', 'user_profile']


class PasswordConfirmSerializer(PasswordResetConfirmSerializer):
    def validate(self, attrs):
        try:
            uid = force_str(uid_decoder(attrs['uid']))
            self.user = get_user_model().objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            raise ValidationError({'uid': [('Invalid value')]})
        
        self.custom_validation(attrs)
        # Construct SetPasswordForm instance
        self.set_password_form = self.set_password_form_class(
            user=self.user, data=attrs,
        )
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)

        return attrs
