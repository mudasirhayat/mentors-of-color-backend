# from django.db.models.signals import post_save
# from django.dispatch import receiver
from moc_api.programs.models import *
from django.dispatch import Signal
from datetime import date
from django.db.models import Q

match_complete_signal = Signal()


def add_moderators_to_match(sender, instance, **kwargs):
    # Get the program associated with the match (assuming mentor_id is associated with the program)
    program = instance.mentor_id.program.first()
    current_mentee = instance.mentee_id.all().first()
    if current_mentee:
        mentee_birth_date = current_mentee.user.userprofile.birth_date
        if mentee_birth_date:
            today = date.today()
            age = today.year - mentee_birth_date.year - ((today.month, today.day) < (mentee_birth_date.month, mentee_birth_date.day))
            if age < 18:
                # Get all moderators for the specific program
                matches = Match.objects.filter(
                    mentee_id__program=program
                )
                moderator_ids = set()

                for match in matches:
                    moderator_ids.update(match.moderator_id.values_list('id', flat=True))
                unique_moderators_queryset = ProgramUser.objects.filter(id__in=moderator_ids).distinct()

                if unique_moderators_queryset:
                    instance.moderator_id.set(unique_moderators_queryset)
                    instance.save()
                # moderator = matches[0].moderator_id.all()
                if instance.chat:
                    for moderator in unique_moderators_queryset:
                        instance.chat.member.add(moderator)
                    instance.save()     
                # if moderators:
                #     for match in matches:
                #         match.moderator_id.set(moderators)
                #         if match.chat:
                #             # Since chat is a OneToOneField, we can directly access it without filtering
                #             for moderator in moderators:
                #                 match.chat.member.add(moderator)
                #         match.save()


match_complete_signal.connect(add_moderators_to_match, sender=Match)
