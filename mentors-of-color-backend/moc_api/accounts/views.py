from rest_framework import viewsets, status
from rest_framework.response import Response
from moc_api.users.serializers import UserProfileSerializer
from .serializers import AccountUserSerializer
from .models import AccountUser

class AccountUserViewSet(viewsets.ModelViewSet):
    queryset = AccountUser.objects.all()
    serializer_class = AccountUserSerializer

    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
queryset = super().get_queryset()
account_id = self.request.query_params.get('account_id')
        user_id = self.request.query_params.get('user_id')

        if account_id is not None:
            queryset = queryset.filter(account_id=account_id, is_active=True)

        if user_id is not None:
            queryset = queryset.exclude(user_id=user_id)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def destroy(self, request, pk=None):
        try:
            account_user = self.get_object()  # Retrieve the AccountUser instance

            # Update the AccountUser instance to mark it as deleted and inactive
            account_user.is_deleted = True
            account_user.is_active = False
            account_user.save()

            return Response({"message": "AccountUser deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        
        except AccountUser.DoesNotExist:
            return Response({"error": "AccountUser not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       

    def update(self, request, pk=None):
        try:
            account_user = self.get_object()
            user_profile = account_user.user_id.userprofile

            serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except AccountUser.DoesNotExist:
            return Response({"error": "AccountUser not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        