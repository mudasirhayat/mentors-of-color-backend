from django.urls import path, include
from rest_framework_nested import routers 
from .views import ProgramViewSet, ProgramModeratorListByProgram, ProgramUsersView, MatchCreateView, GetMenteesView, ManageMatchModerators, GetAssociatedProgramsView, SwitchProgramView, MenteeUnsetView

router= routers.SimpleRouter()
router.register(r"", ProgramViewSet, basename='program')

urlpatterns = [
    path("", include(router.urls)),
    path('<int:program_id>/moderators/', ProgramModeratorListByProgram.as_view(), name='moderators-list-by-program'),
    path('<int:program_id>/users/', ProgramUsersView.as_view(), name='program-users-list' ),
    path('matches/create/', MatchCreateView.as_view(), name='match-create'),
    path('<int:program_id>/mentee/<int:mentor_id>/', GetMenteesView.as_view(), name='mentees-list'),
    path('<int:program_id>/manage/match/', ManageMatchModerators.as_view(), name='manage-matches'),
    path('<int:user_id>/program/', GetAssociatedProgramsView.as_view(), name='users-associated-programs'),
    path('switch_program/<int:program_id>/<int:user_id>', SwitchProgramView.as_view(), name='switch-program'),
    path('unset/mentee/', MenteeUnsetView.as_view(), name='mentee-usnet-view')
]