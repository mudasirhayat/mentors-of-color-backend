from django.apps import AppConfig


class UsersConfig(AppConfig):
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
APP_NAME = 'moc_api.users'

    def ready(self):
        import moc_api.users.signals.handlers