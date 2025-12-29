from django.urls import path
from app import views
from app.views import register,login,admin_only_view,course_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from app.views import module_view
from app.views import video_view
from app.views import video_progress_view
from app.views import enrollment_view
from app.views import create_quiz, get_quiz, submit_quiz, add_question, generate_certificate, course_progress,course_analytics,top_students,course_pass_fail_stats



urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('protected/', views.protected_view),
    path('admin-test/', views.admin_only_view),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('courses/', views.course_view),              
    path('courses/<int:course_id>/', views.course_view),
    path('courses/<int:course_id>/modules/', module_view ),
    path('courses/<int:course_id>/modules/<int:module_id>/', module_view),
    path('courses/<int:course_id>/modules/<int:module_id>/videos/',video_view), 
    path('courses/<int:course_id>/modules/<int:module_id>/videos/<int:video_id>/',video_view),
    path('videos/<int:video_id>/progress/',video_progress_view), 
    path('courses/<int:course_id>/enroll/',enrollment_view),
    path('modules/<int:module_id>/quiz/create/', create_quiz),
    path('modules/<int:module_id>/quiz/', get_quiz),
    path('modules/<int:module_id>/quiz/submit/',submit_quiz),
    path('quizzes/<int:quiz_id>/questions/add/', add_question),
    path('courses/<int:course_id>/certificate/', generate_certificate),
    path("courses/<int:course_id>/progress/", course_progress),
    path("admin/courses/<int:course_id>/analytics/", course_analytics),
    path("admin/courses/<int:course_id>/top-students/", top_students),
    path("admin/courses/<int:course_id>/pass-fail-stats/", course_pass_fail_stats),





]