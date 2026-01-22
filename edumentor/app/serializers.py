from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile
from .models import Course
from .models import Module
from .models import Video
from .models import VideoProgress
from .models import Enrollment
from .models import Quiz
from .models import Question
from .models import QuizAttempt
from .models import Lesson
class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["username", "password", "email", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        role = validated_data.pop("role", "STUDENT")
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)   # ✅ IMPORTANT
        user.save()

        Profile.objects.create(user=user, role=role)
        return user


class CourseSerializer(serializers.ModelSerializer):
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'is_enrolled', 'thumbnail']

    def get_is_enrolled(self, obj):
        request = self.context.get('request')

        # ✅ If no request or user not logged in
        if not request or request.user.is_anonymous:
            return False

        # ✅ Check enrollment for THIS USER ONLY
        return Enrollment.objects.filter(
            user=request.user,
            course=obj
        ).exists()

class LessonSerializer(serializers.ModelSerializer):
    module_title = serializers.CharField(source="module.title", read_only=True)
    module_id = serializers.IntegerField(source="module.id", read_only=True)
    course_id = serializers.IntegerField(source="module.course.id", read_only=True)
    video_id = serializers.IntegerField(source="video.id", read_only=True)

    class Meta:
        model = Lesson
        fields = ["id", "title", "content", "video_url", "order", "module_id","module_title", "course_id","video_id"]



class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = "__all__"


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'
        read_only_fields = ['created_at']

class VideoProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoProgress
        fields = '__all__'
        read_only_fields = ['user', 'updated_at']

        
class CourseMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "title", "description", "thumbnail"]
       

class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseMiniSerializer(read_only=True)  # ✅ full course data

    class Meta:
        model = Enrollment
        fields = ["id", "course", "is_active", "progress", "last_lesson_id", "enrolled_at"]
        read_only_fields = ["enrolled_at"]
        
class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ["id", "title", "total_marks", "pass_marks"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        exclude = ['correct_option']

class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = '__all__'
        read_only_fields = ['user', 'score', 'passed']


class AdminQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        extra_kwargs = {
            'quiz': {'read_only': True}
        }

class StudentQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        exclude = ['correct_option']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "is_staff",
            "is_active",
        ]

class MiniCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "title", "description", "thumbnail"]


class MyEnrollmentSerializer(serializers.ModelSerializer):
    course = MiniCourseSerializer(read_only=True)

    progress = serializers.SerializerMethodField()
    total_lessons = serializers.SerializerMethodField()
    completed_lessons = serializers.SerializerMethodField()
    last_lesson_id = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "course",
            "is_active",
            "progress",
            "completed_lessons",
            "total_lessons",
            "last_lesson_id",
        ]

    def get_total_lessons(self, obj):
        return Lesson.objects.filter(module__course=obj.course).count()

    def get_completed_lessons(self, obj):
        user = obj.user
        lessons = Lesson.objects.filter(module__course=obj.course).values_list("id", flat=True)

        # ✅ Completed = watched progress exists and marked completed
        return VideoProgress.objects.filter(
            user=user,
            video_id__in=lessons,
            is_completed=True
        ).count()

    def get_progress(self, obj):
        total = self.get_total_lessons(obj)
        if total == 0:
            return 0
        completed = self.get_completed_lessons(obj)
        return int((completed / total) * 100)

    def get_last_lesson_id(self, obj):
        user = obj.user
        last = VideoProgress.objects.filter(
            user=user,
            video__module__course=obj.course
        ).order_by("-id").first()

        return last.video_id if last else None



class ModuleMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ["id", "title"]



