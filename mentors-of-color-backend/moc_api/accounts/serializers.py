from rest_framework import serializers
from .models import AccountUser



class AccountUserSerializer(serializers.ModelSerializer):
    user_full_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    user_contact_number = serializers.SerializerMethodField()
    first_name =  serializers.SerializerMethodField()
    last_name =  serializers.SerializerMethodField()

    class Meta:
        model = AccountUser
        fields = ('id', 'account_id', 'user_id', 'user_full_name', 'user_email', 'user_contact_number', 'first_name', 'last_name')

    def get_user_full_name(self, obj):

        try:
            return obj.user_id.userprofile.full_name
        except:
            return ""

    def get_user_email(self, obj):

        return obj.user_id.email

    def get_user_contact_number(self, obj):

        try:
            return obj.user_id.userprofile.phone
        except:
            return ""
        
    def get_first_name(self, obj):

        try:
            return obj.user_id.userprofile.first_name
        except:
            return ""

    def get_last_name(self, obj):

        try:
            return obj.user_id.userprofile.last_name
        except:
            return ""


        