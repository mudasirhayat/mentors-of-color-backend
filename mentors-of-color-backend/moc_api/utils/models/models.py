from django.db import models


class TimestampMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
updated_at = models.DateTimeField(auto_now=True)

class Meta:
    try:
        # code that may raise an exception
    except Exception as e:
        # handle the exception
            print(f"An error occurred: {e}")
        abstract = True
