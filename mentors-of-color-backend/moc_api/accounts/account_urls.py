from django.urls import path, include
from rest_framework_nested import routers 
from .views import AccountUserViewSet

router= routers.SimpleRouter()
router.register(r"", AccountUserViewSet, basename='account-user')

urlpatterns = [
    path("", include(router.urls)),
]