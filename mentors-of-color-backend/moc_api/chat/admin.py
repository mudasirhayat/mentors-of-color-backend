from django.contrib import admin
# from .models import Chat,ChatMessageFile, ChatMessage, UserChatMessage, UserChat
from .models import UserChat
from .models import ChatRoom, ChatMessage
from django.core.exceptions import ValidationError
# Register your models here.
# admin.site.register(Chat)
# admin.site.register(ChatMessageFile)
admin.site.register(ChatMessage)


class ChatRoomAdmin(admin.ModelAdmin):
    exclude = ('type',)

    def save_model(self, request, obj, form, change):
        try:
            super().save_model(request, obj, form, change)
            members = form.cleaned_data.get('member')
            if members:
                count = members.count()
                if count == 2:
                    obj.type = "DM"
                elif count > 2:
                    obj.type = "Group"
                else:
                    raise ValidationError("ChatRoom must have users more than one")
                obj.member.add(*members)
                obj.save()
        except Exception as e:
            raise e
admin.site.register(ChatRoom, ChatRoomAdmin)
# admin.site.register(UserChatMessage)
admin.site.register(UserChat)
