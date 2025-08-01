"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 4.2.10.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
from datetime import timedelta
from pathlib import Path
import os

from config import settings

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent
BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-w+0!t7!%7(5k%-b!r@%v)s-xzwfvfn-qa*^ok!4pc($$k#8svw'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

CSRF_TRUSTED_ORIGINS = ['http://23.20.37.112','http://localhost:3000', 'http://localhost:8000']
CSRF_COOKIE_DOMAIN = ['http://23.20.37.112','http://localhost:3000', 'http://localhost:8000']

AWS_S3_BUCKET_NAME_STATIC = os.environ.get(
    "AWS_S3_BUCKET_NAME_STATIC"
)  # Used for static files only
AWS_S3_KEY_PREFIX_STATIC = os.environ.get("AWS_S3_KEY_PREFIX_STATIC")

STATIC_URL = f"https://{AWS_S3_BUCKET_NAME_STATIC}.s3.us-east-2.amazonaws.com/{AWS_S3_KEY_PREFIX_STATIC}/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")

# Application definition

LIB_APPS = [
    "channels",
    "config.settings",
    "django.contrib.sites",
    "django.contrib.admin",
    "django.contrib.contenttypes",
    "whitenoise.runserver_nostatic",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'django.contrib.auth',
    'corsheaders',
    'simple_history',
    'auditlog',
    'rest_framework',
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    'rest_framework.authtoken'

]

LOCAL_APPS = [
    'moc_api',
    'moc_api.users',
    'moc_api.utils',
    'moc_api.programs',
    'moc_api.accounts',
    'moc_api.chat',

]
INSTALLED_APPS = LIB_APPS + LOCAL_APPS

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        'DIRS': [os.path.join(BASE_DIR,'templates')],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

CORS_ORIGIN_ALLOW_ALL = True

APPEND_SLASH = True

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'config.urls'

SITE_ID = 1

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR + 'database.sqlite3',
#     }
# }



SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=365 * 30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=365 * 30),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUDIENCE": None,
    "ISSUER": None,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "JTI_CLAIM": "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=15),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
}


REST_AUTH_REGISTER_SERIALIZERS = {
    "REGISTER_SERIALIZER": "moc_api.users.serializers.UserRegistrationSerializer",
}

REST_AUTH = {
    "USER_DETAILS_SERIALIZER": "moc_api.users.serializers.UserSerializer",
    'PASSWORD_RESET_CONFIRM_SERIALIZER': 'moc_api.users.serializers.PasswordConfirmSerializer',
    'PASSWORD_RESET_SERIALIZER':
        'moc_api.users.serializers.PasswordResetSerializer',
}

REST_USE_JWT = True


JWT_AUTH_COOKIE = "d_auth_cookie"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "DATE_INPUT_FORMATS": ["%d-%m-%Y", "%m-%d-%Y", "%m/%d/%Y", "iso-8601"],
    "DATE_FORMAT": "%m-%d-%Y",
    "USE_JWT" : True,
    "JWT_AUTH_HTTPONLY": False,
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
        'HOST':  '',
        'PORT': 5432,
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

#allauth
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_REQUIRED = True


AUTH_USER_MODEL = "users.User"
LOGIN_REDIRECT_URL = "login"
LOGIN_URL = 'login'


# Channel Layers

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            # "hosts" : [(os.environ.get("REDIS_LINK"), 6379)]
            "hosts": [("localhost", 6379, "Test@123")], 
        },
    },
}
DJANGO_ALLOW_ASYNC_UNSAFE = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

ACCOUNT_EMAIL_VERIFICATION = 'none'
EMAIL_BACKEND = os.environ.get(
    "EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend"
)

# EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
# EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")
# EMAIL_HOST = os.environ.get("EMAIL_HOST")
EMAIL_PORT = 587
EMAIL_USE_TLS =True
EMAIL_HOST = ""
EMAIL_HOST_PASSWORD = ""
EMAIL_HOST_USER = ""
DEFAULT_FROM_EMAIL = ""

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY"),
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME"),
AWS_S3_SIGNATURE_NAME = os.environ.get("AWS_S3_SIGNATURE_NAME"),
AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME"),
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL =  None
AWS_S3_VERITY = True
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'