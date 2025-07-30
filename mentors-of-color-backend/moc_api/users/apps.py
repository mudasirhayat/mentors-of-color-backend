from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'moc_api.users'

    def ready(self):
        import moc_api.users.signals.handlers