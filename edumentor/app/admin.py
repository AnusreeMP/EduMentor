from django.contrib import admin
from .models import (Profile,Course,Module,Video,VideoProgress,Enrollment,Quiz,Question,QuizAttempt,Certificate,
)

# --------------------
# Profile
# --------------------
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role")
    search_fields = ("user__username",)


# --------------------
# Course
# --------------------
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "is_premium", "created_at")
    search_fields = ("title", "category")
    list_filter = ("category", "is_premium")


# --------------------
# Module
# --------------------
@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course", "order")
    list_filter = ("course",)
    search_fields = ("title",)
    ordering = ("course", "order")

# --------------------
# Video
# --------------------
@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "module", "order", "duration")
    list_filter = ("module",)
    search_fields = ("title",)
    ordering = ("module", "order")


# --------------------
# Video Progress
# --------------------
@admin.register(VideoProgress)
class VideoProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "video", "watched_seconds", "is_completed", "updated_at")
    list_filter = ("is_completed",)


# --------------------
# Enrollment  ✅ FIXED
# --------------------
@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "enrolled_at", "is_active")
    list_filter = ("is_active",)
    search_fields = ("user__username", "course__title")


# --------------------
# Quiz
# --------------------
@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "module", "total_marks", "pass_marks")


# --------------------
# Question
# --------------------
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "quiz", "question_text", "correct_option")
    list_filter = ("quiz",)
    search_fields = ("question_text",)


# --------------------
# Quiz Attempt
# --------------------
@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ("user", "quiz", "score", "passed", "attempted_at")
    list_filter = ("passed",)


# --------------------
# Certificate
# --------------------
@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "certificate_id", "issued_at")
