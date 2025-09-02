from django.apps import AppConfig


class ProgramsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'moc_api.programs'

def ready(self):
    import moc_api.programs.signals.handlers