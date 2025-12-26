from django.conf import settings
from django.dispatch import receiver
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
# from django.contrib.auth.forms import PasswordResetForm
from django.db.models.signals import post_save
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.models import Site
from ..models import User
from moc_api.users.models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user = instance, first_name="N/A", last_name="", username="")

@receiver(post_save, sender=User)
def new_user_notify(sender, instance, created, **kwargs):
    """
    Notifies new user that their account has been created.
    Notifies new user that their account has been created.  
    """
    if created and not instance.is_verified:
        uidb64 = urlsafe_base64_encode(str(instance.pk).encode())
        default_token_generator = PasswordResetTokenGenerator()
        token = default_token_generator.make_token(instance)
        current_site = Site.objects.get_current()

        # if Site.objects.filter(domain="qa.app.duett.io"):
        #     env_label = "QA:"
        # elif Site.objects.filter(domain="staging.app.duett.io"):
        #     env_label = "STG:"
        # else:
        env_label = "QA:"

        url = f"http://{current_site.domain}/reset/{uidb64}/{token}/"

        # html_message = render_to_string("new-user-email.html", {"url": url})
        message_body = f"""
        Welcome to MOC!\n\n
try:
    message = EmailMessage(
        subject="Invitation to join MOC",
        body="You have been invited to join your organization in MOC.\n\nPlease click the button below to access your account:\n\n",
        from
    f"{env_label} Welcome to Mentors of colors! Set up Account Now!",
    message_body,
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
        )
        message.content_subtype = "html"
        message.send()