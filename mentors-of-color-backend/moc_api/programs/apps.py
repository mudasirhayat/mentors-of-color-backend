from django.apps import AppConfig


class ProgramsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'moc_api.programs'

def ready(self):
    try:
        import moc_api.programs.signals.handlers
    except ImportError as e:
        print(f"Error importing module: {e}")