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

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices=[('STUDENT', 'Student'), ('ADMIN', 'Admin')],
        default='STUDENT',
        write_only=True
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        role = validated_data.pop('role')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # ✅ Create profile ONLY HERE
        Profile.objects.create(user=user, role=role)

        return user


class CourseSerializer(serializers.ModelSerializer):
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'is_enrolled']

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



class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'

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
       


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ['user', 'enrolled_at']
        
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

