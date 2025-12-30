from django.contrib import admin
from .models import (
    Profile,
    Course,
    Module,
    Video,
    VideoProgress,
    Enrollment,
    Quiz,
    Question,
    QuizAttempt,
    Certificate,
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
    list_display = ("title", "category", "is_premium", "id", "created_at")
    search_fields = ("title",)
    list_filter = ("category", "is_premium")


# --------------------
# Module
# --------------------
@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order", "id", "created_at")
    ordering = ("course", "order")

# --------------------
# Video
# --------------------
@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ("title", "module", "order", "duration")
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
    list_display = ("title", "module", "total_marks", "pass_marks")


# --------------------
# Question
# --------------------
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("question_text", "quiz", "correct_option")
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
