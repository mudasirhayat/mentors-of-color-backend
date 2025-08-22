from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models
from django.contrib.auth.models import PermissionsMixin
from moc_api.utils.models import TimestampMixin
from simple_history.models import HistoricalRecords


class UserManager(BaseUserManager):
    def get_by_natural_key(self, email):
        return self.get(email__iexact=email)

    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        extra_fields.setdefault("is_active", True)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
if not extra_fields.get("is_staff"):
    raise ValueError("Superuser must have is_staff=True.")
if not extra_fields.get("is_superuser"):
    raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, TimestampMixin):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)
    last_activity_date = models.DateField(null=True, blank=True)

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    objects = UserManager()
    history = HistoricalRecords()

    def __str__(self):
        return self.email

    @property
    def managed_user_count(self):
        return self.managed_user.filter(supervisor=self.pk).count()

    @property
    def group(self) -> str:
        group = self.groups.first()
        return group.name if group else ""


class UserProfile(TimestampMixin):
    user = models.OneToOneField(
        User, on_delete=models.DO_NOTHING, db_constraint=False, primary_key=True
    )
    
    def save(self, *args, **kwargs):
        try
    )
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone = models.CharField(max_length=16, null=True, blank=True)
    username = models.CharField(max_length=30)
    profile_photo_url = models.CharField(max_length = 200, null=True, blank=True)
    online_status = models.BooleanField(default=False)
    birth_date = models.DateField(null=True)

    history = HistoricalRecords()

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.full_name