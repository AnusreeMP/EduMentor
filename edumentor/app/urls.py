from django.urls import path
from app import views
from app.views import register,login,admin_only_view,course_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from app.views import module_view
from app.views import video_view
from app.views import video_progress_view
from app.views import enrollment_view
from app.views import create_quiz, get_quiz,submit_quiz, add_question, course_progress,course_analytics,top_students,course_pass_fail_stats,admin_dashboard_stats,admin_courses,admin_course_detail,admin_users,toggle_user_active,admin_modules,admin_module_detail,admin_lessons,admin_add_lesson,admin_edit_lesson,admin_delete_lesson,module_list,course_list,admin_module_detail,course_modules,admin_update_quiz,video_list,lesson_video_urls



urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('protected/', views.protected_view),
    path('admin-test/', views.admin_only_view),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("courses/", views.course_list),
    path("courses/<int:course_id>/", views.course_detail),

   
    path('courses/<int:course_id>/modules/<int:module_id>/videos/',video_view), 
    path("videos/", video_list),
    path("lesson-video-urls/", lesson_video_urls), 
    path('courses/<int:course_id>/modules/<int:module_id>/videos/<int:video_id>/',video_view),
    path("video-progress/<int:video_id>/", views.video_progress_view),

    path('modules/<int:module_id>/videos/',views.module_videos, name='module-videos'),
    path('modules/<int:module_id>/detail/',views.module_detail, name='module-detail'),
    path('courses/<int:course_id>/enroll/',enrollment_view),
    path("modules/<int:module_id>/quiz/create/", views.create_quiz),
    path('modules/<int:module_id>/quiz/', views.module_quiz),
    path('modules/<int:module_id>/quiz/', get_quiz),
    path('quizzes/<int:quiz_id>/', views.quiz_detail),
    path('quizzes/<int:quiz_id>/questions/', views.quiz_questions),
    path("modules/<int:module_id>/quiz/submit/", submit_quiz),
    path('quizzes/<int:quiz_id>/questions/add/', add_question),
    path("courses/<int:course_id>/progress/", course_progress),
    path("admin/courses/<int:course_id>/analytics/", course_analytics),
    path("admin/courses/<int:course_id>/top-students/", top_students),
    path("courses/<int:course_id>/stats/", course_pass_fail_stats),

    path("admin/dashboard/", admin_dashboard_stats),
    path("admin/courses/", admin_courses),
    path("admin/courses/<int:pk>/", admin_course_detail),
    path("admin/users/", admin_users),
    path("admin/users/<int:pk>/toggle-active/", toggle_user_active),
    path("admin/courses/<int:course_id>/modules/",admin_modules,),
    path("admin/modules/<int:module_id>/",admin_module_detail,),
    path("admin/modules/<int:module_id>/lessons/",admin_lessons),
    path("admin/modules/<int:module_id>/lessons/add/",admin_add_lesson),
    path("admin/lessons/<int:lesson_id>/edit/",admin_edit_lesson),
    path("admin/lessons/<int:lesson_id>/delete/",admin_delete_lesson),
    path("admin/quizzes/<int:quiz_id>/edit/", admin_update_quiz),

    path("courses/<int:course_id>/modules/", course_modules),
    path("courses/<int:course_id>/modules/<int:module_id>/", views.course_module_detail),
    path("my-enrollments/", views.my_enrollments, name="my_enrollments"),
    path("enroll/<int:course_id>/", views.enroll_course, name="enroll_course"),
    path("lessons/<int:lesson_id>/", views.lesson_detail),
    path("modules/<int:module_id>/lessons/", views.module_lessons),
    path("modules/<int:module_id>/completed-lessons/", views.module_completed_lessons),













]