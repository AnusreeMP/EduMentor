from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .permissions import IsAdmin, IsEnrolledStudent
from .permissions import IsEnrolledViaModule
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from .models import Profile
from .models import Course, Module, Video, Enrollment,Lesson, VideoProgress
from .models import Quiz, Question, QuizAttempt
from .serializers import RegisterSerializer,CourseSerializer, ModuleSerializer, VideoSerializer,VideoProgressSerializer,EnrollmentSerializer,QuizSerializer,QuestionSerializer,QuizAttemptSerializer,StudentQuestionSerializer,AdminQuestionSerializer,UserSerializer,LessonSerializer,MyEnrollmentSerializer
from django.contrib.auth import get_user_model



import uuid
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from .models import Certificate
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import black, HexColor
from reportlab.lib.units import inch





@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    print("✅ LOGIN HIT")
    print("USERNAME:", username)
    print("PASSWORD LENGTH:", len(password) if password else None)
    
    User = get_user_model()
    user = authenticate(request, username=username, password=password)


    print("AUTH RESULT:", user)

    if user is not None:
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'is_admin': user.is_staff or user.is_superuser,
            }
        }, status=status.HTTP_200_OK)

    return Response(
        {'error': 'Invalid username or password'},
        status=status.HTTP_401_UNAUTHORIZED
    )

@api_view(['GET'])
def protected_view(request):
    return Response({"message": "You are authenticated"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_only_view(request):
    if request.user.profile.role != 'ADMIN':
        return Response(
            {"error": "Admin access only"},
            status=403
        )
    return Response({"message": "Welcome Admin"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_course(request):
    if request.user.profile.role != 'ADMIN':
        return Response(
            {"error": "Only admin can create courses"},
            status=403
        )

    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)



@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def course_view(request, course_id=None):
    # 🔹 GET → list courses / single course
    if request.method == 'GET':
        if course_id:
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return Response({"error": "Course not found"}, status=404)

            serializer = CourseSerializer(
                course,
                context={'request': request}
            )
            return Response(serializer.data)

        courses = Course.objects.all().order_by('-created_at')
        serializer = CourseSerializer(
            courses,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_list(request):
    courses = Course.objects.all().order_by("-id")
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# 🔹 SINGLE COURSE DETAIL
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def course_detail(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    serializer = CourseSerializer(
        course,
        context={'request': request}
    )
    return Response(serializer.data)
    # 🔹 POST → Create course (ADMIN only)
    if request.method == 'POST':
        if request.user.profile.role != 'ADMIN':
            return Response(
                {"error": "Only admin can create courses"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔹 PUT / PATCH → Update course (ADMIN only)
    if request.method in ['PUT', 'PATCH']:
        if request.user.profile.role != 'ADMIN':
            return Response(
                {"error": "Only admin can update courses"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CourseSerializer(
            course,
            data=request.data,
            partial=(request.method == 'PATCH')
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔹 DELETE → Delete course (ADMIN only)
    if request.method == 'DELETE':
        if request.user.profile.role != 'ADMIN':
            return Response(
                {"error": "Only admin can delete courses"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        course.delete()
        return Response(
            {"message": "Course deleted successfully"},
            status=status.HTTP_200_OK
        )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_modules(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    modules = Module.objects.filter(course=course).order_by("order")
    serializer = ModuleSerializer(modules, many=True)
    print("✅ course_modules view called")


    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_module_detail(request, course_id, module_id):
    module = get_object_or_404(Module, id=module_id, course_id=course_id)
    serializer = ModuleSerializer(module)
    return Response(serializer.data, status=status.HTTP_200_OK)

    

@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def module_view(request, course_id):
    user = request.user

    # 🔐 SAFETY: profile may not exist
    if not hasattr(user, "profile"):
        return Response(
            {"detail": "User profile not found"},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response(
            {"detail": "Course not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # ✅ STUDENT → only if enrolled (optional rule)
    if user.profile.role == "STUDENT":
        modules = Module.objects.filter(course=course).order_by("order")

    # ✅ ADMIN → see all modules
    elif user.profile.role == "ADMIN":
        modules = Module.objects.filter(course=course).order_by("order")

    else:
        return Response(
            {"detail": "Invalid role"},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = ModuleSerializer(modules, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

    # 🔹 POST → create module (ADMIN only)
    if request.method == 'POST':
        if request.user.profile.role != 'ADMIN':
            return Response(
                {"error": "Only admin can create modules"},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        data['course'] = course_id

        serializer = ModuleSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔹 PUT / PATCH → update module (ADMIN only)
    if request.method in ['PUT', 'PATCH']:
        if request.user.profile.role != 'ADMIN':
            return Response(
                {"error": "Only admin can update modules"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            module = Module.objects.get(id=module_id, course_id=course_id)
        except Module.DoesNotExist:
            return Response({"error": "Module not found"}, status=404)

        serializer = ModuleSerializer(
            module,
            data=request.data,
            partial=(request.method == 'PATCH')
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 🔹 DELETE → delete module (ADMIN only)
    if request.method == 'DELETE':
        if request.user.profile.role != 'ADMIN':
            return Response(
                {"error": "Only admin can delete modules"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            module = Module.objects.get(id=module_id, course_id=course_id)
        except Module.DoesNotExist:
            return Response({"error": "Module not found"}, status=404)

        module.delete()
        return Response({"message": "Module deleted successfully"}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def module_detail(request, course_id, module_id):
    module = get_object_or_404(
        Module,
        id=module_id,
        course_id=course_id
    )

    serializer = ModuleSerializer(module)
    return Response(serializer.data, status=status.HTTP_200_OK)

    # 🔐 Enrollment check for students
    if request.user.profile.role == 'STUDENT':
        is_enrolled = Enrollment.objects.filter(
            user=request.user,
            course=module.course,
            is_active=True
        ).exists()

        if not is_enrolled:
            return Response(
                {"error": "You are not enrolled in this course"},
                status=403
            )

    serializer = ModuleSerializer(module)
    return Response(serializer.data)



@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def video_view(request, course_id=None, module_id=None, video_id=None):
    
    if request.user.profile.role == 'STUDENT':
        is_enrolled = Enrollment.objects.filter(
        user=request.user,
        course_id=course_id,
        is_active=True
    ).exists()

    if not is_enrolled:
        return Response(
            {"error": "You are not enrolled in this course"},
            status=403
        )


    # 🔹 GET → list videos OR single video
    if request.method == 'GET':
        if video_id:
            try:
                video = Video.objects.get(
                    id=video_id,
                    module_id=module_id
                )
            except Video.DoesNotExist:
                return Response({"error": "Video not found"}, status=404)

            serializer = VideoSerializer(video)
            return Response(serializer.data)

        videos = Video.objects.filter(
            module_id=module_id
        ).order_by('order')

        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)

    # 🔹 POST → create video (ADMIN only)
    if request.method == 'POST':
        if request.user.profile.role != 'ADMIN':
            return Response({"error": "Only admin can add videos"}, status=403)

        data = request.data.copy()
        data['module'] = module_id

        serializer = VideoSerializer(data=data)

        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=400)

        serializer.save()
        return Response(serializer.data, status=201)

    # 🔹 PUT / PATCH → update video (ADMIN only)
    if request.method in ['PUT', 'PATCH']:
        if request.user.profile.role != 'ADMIN':
            return Response({"error": "Only admin can update videos"}, status=403)

        try:
            video = Video.objects.get(id=video_id, module_id=module_id)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=404)

        serializer = VideoSerializer(
            video,
            data=request.data,
            partial=(request.method == 'PATCH')
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        serializer.save()
        return Response(serializer.data)

    # 🔹 DELETE → delete video (ADMIN only)
    if request.method == 'DELETE':
        if request.user.profile.role != 'ADMIN':
            return Response({"error": "Only admin can delete videos"}, status=403)

        try:
            video = Video.objects.get(id=video_id, module_id=module_id)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=404)

        video.delete()
        return Response({"message": "Video deleted successfully"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def video_list(request):
    videos = Video.objects.all().order_by("module_id", "order")
    data = [
        {
            "id": v.id,
            "title": v.title,
            "module": v.module.title,
            "video_url": v.video_url,
            "order": v.order,
        }
        for v in videos
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lesson_video_urls(request):
    lessons = Lesson.objects.all().order_by("module_id", "order")
    data = [
        {
            "lesson_id": l.id,
            "title": l.title,
            "lesson_video_url": l.video_url,
            "video_id": l.video.id if l.video else None,
        }
        for l in lessons
    ]
    return Response(data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def video_progress_view(request, video_id):

    course_id = Video.objects.get(id=video_id).module.course_id

    if request.user.profile.role == 'STUDENT':
        if not Enrollment.objects.filter(
            user=request.user,
            course_id=course_id,
            is_active=True
        ).exists():
            return Response(
                {"error": "You are not enrolled in this course"},
                status=403
            )

    # 🔹 GET → get progress of a video (resume playback)
    if request.method == 'GET':
        progress, _ = VideoProgress.objects.get_or_create(
            user=request.user,
            video_id=video_id
        )
        serializer = VideoProgressSerializer(progress)
        return Response(serializer.data)

    # 🔹 POST → update progress
    if request.method == 'POST':
        progress, _ = VideoProgress.objects.get_or_create(
            user=request.user,
            video_id=video_id
        )

        watched_seconds = request.data.get('watched_seconds', 0)
        is_completed = request.data.get('is_completed', False)

        progress.watched_seconds = watched_seconds
        progress.is_completed = is_completed
        progress.save()

        serializer = VideoProgressSerializer(progress)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def module_videos(request, module_id):
    videos = Video.objects.filter(module_id=module_id).order_by('order')
    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def enrollment_view(request, course_id):

    # 🔹 POST → Enroll in a course (STUDENT only)
    if request.method == 'POST':
        if request.user.profile.role != 'STUDENT':
            return Response(
                {"error": "Only students can enroll"},
                status=403
            )

        enrollment, created = Enrollment.objects.get_or_create(
            user=request.user,
            course_id=course_id
        )

        if not created:
            return Response(
                {"message": "Already enrolled"},
                status=200
            )

        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=201)

    # 🔹 GET → Check enrollment status
    if request.method == 'GET':
        is_enrolled = Enrollment.objects.filter(
            user=request.user,
            course_id=course_id,
            is_active=True
        ).exists()

        return Response({"enrolled": is_enrolled})

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def create_quiz(request, module_id):
    serializer = QuizSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # ✅ force module_id during save
    serializer.save(module_id=module_id)

    return Response(serializer.data, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def add_question(request, quiz_id):
    serializer = AdminQuestionSerializer(data=request.data)

    if not serializer.is_valid():
        print("❌ SERIALIZER ERRORS:", serializer.errors)
        return Response(serializer.errors, status=400)

    serializer.save(quiz_id=quiz_id)
    return Response(serializer.data, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def quiz_detail(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)

    return Response({
        "id": quiz.id,
        "title": quiz.title,
        "total_marks": quiz.total_marks,
        "pass_marks": quiz.pass_marks,
        "module": quiz.module.id
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def quiz_questions(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    questions = quiz.questions.all()

    data = []
    for q in questions:
        data.append({
            "id": q.id,
            "question_text": q.question_text,
            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d,
        })

    return Response(data)

@api_view(['GET'])
def module_quiz(request, module_id):
    quiz = get_object_or_404(Quiz, module_id=module_id)

    return Response({
        "id": quiz.id,
        "title": quiz.title,
        "total_marks": quiz.total_marks,
        "pass_marks": quiz.pass_marks,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsEnrolledViaModule])
def get_quiz(request, module_id):
    quiz = Quiz.objects.get(module_id=module_id)
    questions = quiz.questions.all()

    serializer = StudentQuestionSerializer(questions, many=True)
    return Response({
        "quiz_id": quiz.id,
        "questions": serializer.data
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_quiz(request, module_id):
    module = get_object_or_404(Module, id=module_id)
    quiz = get_object_or_404(Quiz, module=module)

    answers = request.data.get("answers", {})
    if not isinstance(answers, dict):
        return Response({"error": "Answers must be an object/dictionary"}, status=400)

    questions = Question.objects.filter(quiz=quiz)

    score = 0
    total = questions.count()

    for q in questions:
        selected = answers.get(str(q.id)) or answers.get(q.id)
        if selected and selected.upper() == q.correct_option.upper():
            score += 1

    passed = score >= quiz.pass_marks

    # ✅ Update or Create attempt
    attempt, created = QuizAttempt.objects.update_or_create(
        user=request.user,
        quiz=quiz,
        defaults={
            "score": score,
            "passed": passed
        }
    )

    return Response({
        "quiz_id": quiz.id,
        "module_id": module_id,
        "score": score,
        "total_questions": total,
        "passed": passed,
        "attempt_updated": True
    }, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_progress(request, course_id):
    user = request.user

    # ✅ Only lessons which have a video assigned
    total_lessons = Lesson.objects.filter(
        module__course_id=course_id,
        video__isnull=False
    ).count()

    completed_lessons = VideoProgress.objects.filter(
        user=user,
        video__module__course_id=course_id,
        is_completed=True
    ).count()

    progress_percent = 0
    if total_lessons > 0:
        progress_percent = int((completed_lessons / total_lessons) * 100)

    quiz_passed = QuizAttempt.objects.filter(
        user=user,
        quiz__module__course_id=course_id,
        passed=True
    ).exists()

    completed = total_lessons > 0 and completed_lessons == total_lessons
    certificate_available = completed and quiz_passed

    return Response({
        "progress": progress_percent,
        "videos_completed": completed_lessons,
        "total_videos": total_lessons,
        "quiz_passed": quiz_passed,
        "completed": completed,
        "certificate_available": certificate_available
    })



@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def course_analytics(request, course_id):

    total_enrollments = Enrollment.objects.filter(
        course_id=course_id,
        is_active=True
    ).count()

    total_modules = Module.objects.filter(course_id=course_id).count()

    total_quizzes = Quiz.objects.filter(
        module__course_id=course_id
    ).count()

    certificates_issued = Certificate.objects.filter(
        course_id=course_id
    ).count()

    return Response({
        "course_id": course_id,
        "enrollments": total_enrollments,
        "modules": total_modules,
        "quizzes": total_quizzes,
        "certificates_issued": certificates_issued
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def course_pass_fail_stats(request, course_id):

    total_attempts = QuizAttempt.objects.filter(
        quiz__module__course_id=course_id
    ).count()

    passed = QuizAttempt.objects.filter(
        quiz__module__course_id=course_id,
        passed=True
    ).count()

    failed = total_attempts - passed

    pass_percentage = (
        int((passed / total_attempts) * 100)
        if total_attempts > 0 else 0
    )

    return Response({
        "course_id": course_id,
        "total_attempts": total_attempts,
        "passed": passed,
        "failed": failed,
        "pass_percentage": pass_percentage
    })


from django.db.models import Avg

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def top_students(request, course_id):

    top = QuizAttempt.objects.filter(
        quiz__module__course_id=course_id
    ).values(
        'user__username'
    ).annotate(
        avg_score=Avg('score')
    ).order_by('-avg_score')[:5]

    return Response(top)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    return Response({
        "total_courses": Course.objects.count(),
        "total_users": User.objects.count(),
        "total_enrollments": Enrollment.objects.count(),
        "recent_courses": list(
            Course.objects.order_by("-id")[:5].values("id", "title", "description")
        )
    })

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def admin_courses(request):
    if request.method == 'GET':
        courses = Course.objects.all().order_by('-id')
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
      serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(created_by=request.user)   # ✅ IMPORTANT FIX
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def admin_course_detail(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response(status=404)

    if request.method == 'PUT':
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == 'DELETE':
        course.delete()
        return Response(status=204)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_users(request):
    users = User.objects.all().order_by('-id')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


User = get_user_model()
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def toggle_user_active(request, pk):
    try:
        user = User.objects.get(pk=pk)

        if user.is_superuser:
            return Response(
                {"error": "Cannot block superuser"},
                status=400
            )

        user.is_active = not user.is_active
        user.save()

        return Response({
            "id": user.id,
            "is_active": user.is_active
        })
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=404
        )


@api_view(["GET", "POST"])
@permission_classes([IsAdminUser])
def admin_modules(request, course_id):

    # ✅ GET modules list
    if request.method == "GET":
        modules = Module.objects.filter(course_id=course_id).order_by("order")
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data, status=200)

    # ✅ POST create module
    if request.method == "POST":
        data = request.data.copy()
        data["course"] = course_id   # ✅ important

        serializer = ModuleSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAdminUser])
def admin_module_detail(request, module_id):
    module = get_object_or_404(Module, id=module_id)

    # ✅ GET module
    if request.method == "GET":
        serializer = ModuleSerializer(module)
        return Response(serializer.data)

    # ✅ PATCH / PUT update module
    if request.method in ["PUT", "PATCH"]:
        serializer = ModuleSerializer(
            module,
            data=request.data,
            partial=(request.method == "PATCH")
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ✅ DELETE module
    if request.method == "DELETE":
        module.delete()
        return Response({"message": "Module deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_lessons(request, module_id):
    lessons = Lesson.objects.filter(
        module_id=module_id
    ).order_by("order")
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAdminUser])
def admin_add_lesson(request, module_id):
    serializer = LessonSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(module_id=module_id)
        return Response(serializer.data, status=201)

    print("❌ Lesson create errors:", serializer.errors)   # ✅ ADD THIS
    return Response(serializer.errors, status=400)


@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def admin_edit_lesson(request, lesson_id):
    lesson = Lesson.objects.get(id=lesson_id)
    serializer = LessonSerializer(
        lesson, data=request.data, partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def admin_delete_lesson(request, lesson_id):
    Lesson.objects.filter(id=lesson_id).delete()
    return Response(status=204)

@api_view(["GET", "POST"])
def module_list(request, course_id):
    modules = Module.objects.filter(course_id=course_id).order_by("order")

    
@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])  # if you have IsAdmin, put it here also
def admin_update_quiz(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)

    serializer = QuizSerializer(
        quiz,
        data=request.data,
        partial=(request.method == "PATCH")
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(serializer.data)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_enrollments(request):
    enrollments = Enrollment.objects.filter(
        user=request.user,
        is_active=True
    ).select_related("course")

    serializer = MyEnrollmentSerializer(enrollments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def enroll_course(request, course_id):
    user = request.user

    # ✅ Only students can enroll (optional)
    if hasattr(user, "profile") and user.profile.role != "STUDENT":
        return Response({"error": "Only students can enroll"}, status=403)

    enrollment, created = Enrollment.objects.get_or_create(
        user=user,
        course_id=course_id
    )

    if not created:
        return Response({"message": "Already enrolled"}, status=200)

    return Response({"message": "Enrolled successfully"}, status=201)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lesson_detail(request, lesson_id):
    lesson = get_object_or_404(Lesson, id=lesson_id)
    serializer = LessonSerializer(lesson)
    return Response(serializer.data, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def module_lessons(request, module_id):
    lessons = Lesson.objects.filter(module_id=module_id).order_by("order")
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def module_completed_lessons(request, module_id):
    """
    ✅ Returns list of lesson IDs completed by logged user for this module
    """
    completed_ids = VideoProgress.objects.filter(
        user=request.user,
        video__module_id=module_id,
        is_completed=True
    ).values_list("video_id", flat=True)

    return Response({"completed_lesson_ids": list(completed_ids)})



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_stats(request, course_id):

    total_lessons = Lesson.objects.filter(module__course_id=course_id).count()

    completed_videos = VideoProgress.objects.filter(
        video__module__course_id=course_id,
        is_completed=True
    ).count()

    # quiz data
    quiz = Quiz.objects.filter(module__course_id=course_id).first()
    quiz_attempts = QuizAttempt.objects.filter(quiz=quiz).count() if quiz else 0
    passed = QuizAttempt.objects.filter(quiz=quiz, passed=True).count() if quiz else 0

    return Response({
        "course_id": course_id,
        "total_lessons": total_lessons,
        "completed_videos": completed_videos,
        "quiz_attempts": quiz_attempts,
        "passed_attempts": passed,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lesson_list(request):
    lessons = Lesson.objects.select_related("module").all().order_by("module_id", "order")
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def module_list(request):
    modules = Module.objects.all().order_by("id")
    serializer = ModuleSerializer(modules, many=True)
    return Response(serializer.data)



    
@api_view(["DELETE"])
def delete_quiz_question(request, question_id):
    try:
        q = Question.objects.get(id=question_id)
        q.delete()
        return Response({"message": "Question Deleted"}, status=status.HTTP_200_OK)
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["PUT"])
def edit_quiz_question(request, question_id):
    try:
        q = Question.objects.get(id=question_id)

        q.question_text = request.data.get("question_text", q.question_text)
        q.option_a = request.data.get("option_a", q.option_a)
        q.option_b = request.data.get("option_b", q.option_b)
        q.option_c = request.data.get("option_c", q.option_c)
        q.option_d = request.data.get("option_d", q.option_d)
        q.correct_option = request.data.get("correct_option", q.correct_option)

        q.save()

        return Response(
            {
                "message": "✅ Question updated successfully",
                "id": q.id,
            },
            status=status.HTTP_200_OK,
        )

    except Question.DoesNotExist:
        return Response({"detail": "Question not found"}, status=status.HTTP_404_NOT_FOUND)



@api_view(["GET"])
def admin_courses_quiz_stats(request):
    courses = Course.objects.all()
    data = []

    for course in courses:
        # ✅ attempts where quiz->module->course = this course
        attempts = QuizAttempt.objects.filter(quiz__module__course=course)

        total_attempts = attempts.count()
        passed = attempts.filter(passed=True).count()
        failed = total_attempts - passed

        pass_percentage = 0
        if total_attempts > 0:
            pass_percentage = round((passed / total_attempts) * 100, 2)

        data.append({
            "course_id": course.id,
            "course_title": course.title,
            "total_attempts": total_attempts,
            "passed": passed,
            "failed": failed,
            "pass_percentage": pass_percentage,
        })

    return Response(data)