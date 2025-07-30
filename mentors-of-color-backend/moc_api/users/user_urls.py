from django.urls import path, include
from rest_framework_nested import routers 
from .views import UserViewSet, UserProfileView, GetUserProgramView

router = routers.SimpleRouter()
router.register(r"", UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("<int:pk>/profile/", UserProfileView.as_view(), name="user-profile"),
    path("<int:pk>/program/", GetUserProgramView.as_view(), name="user-program"),
]
