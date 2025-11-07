"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from moc_api.utils.views import health_check
from django.conf import settings 
from django.conf.urls.static import static
from dj_rest_auth.registration.views import VerifyEmailView
from moc_api.users.views import CustomRegisterView, LoginAPIView

urlpatterns = [ 

    path('admin/', admin.site.urls),
   
    path("auth/login/", LoginAPIView.as_view(), name='auth-login'),
    path("auth/registration/", CustomRegisterView.as_view(), name="rest_register"),
    path("auth/", include("dj_rest_auth.urls")),
    re_path(r'^account-confirm-email/(?P<key>[-:\w]+)/$', VerifyEmailView.as_view(),
        name='account_confirm_email'),
    path("api/users/", include("moc_api.users.user_urls")),
    path("chat/", include("moc_api.chat.chat_urls")),
    path("account/", include("moc_api.accounts.account_urls")),
    path("program/", include("moc_api.programs.program_urls")),
    path("health-check/", health_check, name="health-check"),
    path("", include("django.contrib.auth.urls")),
    path("", RedirectView.as_view(url="/admin")),
   

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_URL)

