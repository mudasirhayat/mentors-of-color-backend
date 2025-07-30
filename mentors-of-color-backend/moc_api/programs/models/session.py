from django.db import models
from moc_api.utils.models import TimestampMixin
from moc_api.programs.models import ProgramUser
from moc_api.accounts.models import AccountUser
from moc_api.chat.models import ChatRoom


class Match(TimestampMixin):
    chat =  models.OneToOneField(ChatRoom, on_delete=models.CASCADE, null=True)
    user_id = models.ForeignKey(AccountUser, on_delete=models.CASCADE, related_name='matched_owner')
    mentor_id = models.ForeignKey(ProgramUser, on_delete=models.CASCADE, related_name='mentor')
    mentee_id = models.ManyToManyField(ProgramUser, related_name='mentee')
    moderator_id = models.ManyToManyField(ProgramUser, related_name='moderator', blank=True)
    matched = models.BooleanField(default=False)

    def __str__(self) -> str:
        mentor_email = self.mentor_id.user.email if self.mentor_id else "None"
        mentee_emails = ', '.join([mentee.user.email for mentee in self.mentee_id.all()])
        return f"{mentor_email} 'matched with' {mentee_emails}"

    @classmethod
    def has_mentor_mentee_match(cls, mentor, mentee):
        return cls.objects.filter(mentor_id=mentor, mentee_id=mentee).exists()
    
    @classmethod
    def has_moderator_match(cls, obj):
        return cls.objects.filter(moderator_id=obj).exists()

class Session(TimestampMixin):
    start_date = models.DateField()
    end_date = models.DateField()
    meeting_link = models.CharField(max_length=250)
    location = models.CharField(max_length=250)
    session_rating = models.IntegerField(choices=((5, "Excellent"), (4, "Good"), (3, "Average"), (2, "Bad"), (1, "Very Bad")))
    session_completed = models.BooleanField(default=False)
    mentor_feedback = models.CharField(max_length=250)
    mentee_feedback = models.CharField(max_length=250)