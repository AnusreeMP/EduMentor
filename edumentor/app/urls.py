from django.urls import path
from app import views
from app.views import register,login,admin_only_view,course_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from app.views import module_view
from app.views import video_view
from app.views import video_progress_view
from app.views import enrollment_view
from app.views import create_quiz, get_quiz,submit_quiz, add_question, course_progress,course_analytics,top_students,course_pass_fail_stats,admin_dashboard_stats,admin_courses,admin_course_detail,admin_users,toggle_user_active,admin_modules,admin_module_detail,admin_lessons,admin_add_lesson,admin_edit_lesson,admin_delete_lesson,module_list,course_list,admin_module_detail,course_modules,admin_update_quiz,video_list,lesson_video_urls,course_stats,lesson_list,admin_courses_quiz_stats



urlpatterns = [

    # ==========================================================
    # ✅ AUTH (Register / Login / JWT)
    # ==========================================================
    path("register/", views.register),
    path("login/", views.login),

    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("protected/", views.protected_view),
    path("admin-test/", views.admin_only_view),

    # ==========================================================
    # ✅ PUBLIC COURSES
    # ==========================================================
    path("courses/", views.course_list),
    path("courses/<int:course_id>/", views.course_detail),

    # Course Modules
    path("courses/<int:course_id>/modules/", views.course_modules),
    path("courses/<int:course_id>/modules/<int:module_id>/", views.course_module_detail),

    # ==========================================================
    # ✅ MODULE LIST (Global)
    # ==========================================================
    path("modules/", views.module_list),
    path("modules/<int:module_id>/detail/", views.module_detail),
    path("modules/<int:module_id>/videos/", views.module_videos),

    # ==========================================================
    # ✅ LESSONS (Global)
    # ==========================================================
    path("lessons/", views.lesson_list),
    path("lessons/<int:lesson_id>/", views.lesson_detail),

    # Module lessons
    path("modules/<int:module_id>/lessons/", views.module_lessons),
    path("modules/<int:module_id>/completed-lessons/", views.module_completed_lessons),

    # ==========================================================
    # ✅ VIDEOS
    # ==========================================================
    path("videos/", views.video_list),
    path("lesson-video-urls/", views.lesson_video_urls),

    # Course → Module Videos
    path("courses/<int:course_id>/modules/<int:module_id>/videos/", views.video_view),
    path(
        "courses/<int:course_id>/modules/<int:module_id>/videos/<int:video_id>/",
        views.video_view
    ),

    # Video Progress
    path("video-progress/<int:video_id>/", views.video_progress_view),

    # ==========================================================
    # ✅ ENROLLMENT + MY COURSES
    # ==========================================================
    path("courses/<int:course_id>/enroll/", views.enrollment_view),
    path("enroll/<int:course_id>/", views.enroll_course, name="enroll_course"),
    path("my-enrollments/", views.my_enrollments, name="my_enrollments"),

    # ==========================================================
    # ✅ QUIZ SYSTEM
    # ==========================================================
    path("modules/<int:module_id>/quiz/create/", views.create_quiz),
    path("modules/<int:module_id>/quiz/", views.module_quiz),  # ✅ keep only ONE
    path("modules/<int:module_id>/quiz/submit/", views.submit_quiz),

    path("quizzes/<int:quiz_id>/", views.quiz_detail),
    path("quizzes/<int:quiz_id>/questions/", views.quiz_questions),
    path("quizzes/<int:quiz_id>/questions/add/", views.add_question),

    # ==========================================================
    # ✅ COURSE PROGRESS + STATS
    # ==========================================================
    path("courses/<int:course_id>/progress/", views.course_progress),

    # ✅ IMPORTANT: keep ONLY ONE stats endpoint
    path("courses/<int:course_id>/stats/", views.course_stats),

    # ==========================================================
    # ✅ ADMIN DASHBOARD
    # ==========================================================
    path("admin/dashboard/", views.admin_dashboard_stats),

    # ==========================================================
    # ✅ ADMIN USERS
    # ==========================================================
    path("admin/users/", views.admin_users),
    path("admin/users/<int:pk>/toggle-active/", views.toggle_user_active),

    # ==========================================================
    # ✅ ADMIN COURSES (CRUD)
    # ==========================================================
    path("admin/courses/", views.admin_courses),
    path("admin/courses/<int:pk>/", views.admin_course_detail),

    # Course Analytics (Admin)
    path("admin/courses/<int:course_id>/analytics/", views.course_analytics),
    path("admin/courses/<int:course_id>/top-students/", views.top_students),
    path("courses/<int:course_id>/passfail/", views.course_pass_fail_stats),

    # ==========================================================
    # ✅ ADMIN MODULES + LESSONS
    # ==========================================================
    path("admin/courses/<int:course_id>/modules/", views.admin_modules),
    path("admin/modules/<int:module_id>/", views.admin_module_detail),

    path("admin/modules/<int:module_id>/lessons/", views.admin_lessons),
    path("admin/modules/<int:module_id>/lessons/add/", views.admin_add_lesson),

    path("admin/lessons/<int:lesson_id>/edit/", views.admin_edit_lesson),
    path("admin/lessons/<int:lesson_id>/delete/", views.admin_delete_lesson),

    # ==========================================================
    # ✅ ADMIN QUIZ EDIT
    # ==========================================================
    path("admin/quizzes/<int:quiz_id>/edit/", views.admin_update_quiz),
    path("admin/quiz/<int:question_id>/delete/", views.delete_quiz_question),
    path("admin/quiz/<int:question_id>/edit/", views.edit_quiz_question),
    path("admin/courses/stats/", views.admin_courses_quiz_stats),
]













