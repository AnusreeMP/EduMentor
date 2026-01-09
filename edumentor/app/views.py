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
from .models import Course, Module,Video,VideoProgress,Enrollment,Quiz, Question, QuizAttempt
from .serializers import RegisterSerializer,CourseSerializer, ModuleSerializer, VideoSerializer,VideoProgressSerializer,EnrollmentSerializer,QuizSerializer,QuestionSerializer,QuizAttemptSerializer,StudentQuestionSerializer,AdminQuestionSerializer



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
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),

            # 👇 VERY IMPORTANT
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
def course_list(request):
    courses = Course.objects.all().order_by('-created_at')
    serializer = CourseSerializer(
        courses,
        many=True,
        context={'request': request}
    )
    return Response(serializer.data)


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

    

@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def module_view(request, course_id=None, module_id=None):

    # 🔐 ENROLLMENT CHECK (students only)
    if request.user.profile.role == 'STUDENT':
        is_enrolled = Enrollment.objects.filter(
            user=request.user,
            course_id=course_id,
            is_active=True
        ).exists()

        if not is_enrolled:
            return Response(
                {"error": "You are not enrolled in this course"},
                status=status.HTTP_403_FORBIDDEN
            )

    # 🔹 GET → list modules / single module
    if request.method == 'GET':
        if module_id:
            try:
                module = Module.objects.get(id=module_id, course_id=course_id)
            except Module.DoesNotExist:
                return Response({"error": "Module not found"}, status=404)

            serializer = ModuleSerializer(module)
            return Response(serializer.data)

        modules = Module.objects.filter(course_id=course_id)
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)

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
def module_detail(request, module_id):
    try:
        module = Module.objects.get(id=module_id)
    except Module.DoesNotExist:
        return Response({"error": "Module not found"}, status=404)

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
    data = request.data.copy()
    data['module'] = module_id

    serializer = QuizSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    serializer.save()

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


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsEnrolledViaModule])
def submit_quiz(request, module_id):
    quiz = Quiz.objects.get(module_id=module_id)
    answers = request.data.get('answers')

    score = 0
    for q in quiz.questions.all():
        if answers.get(str(q.id)) == q.correct_option:
            score += 1

    passed = score >= quiz.pass_marks

    QuizAttempt.objects.update_or_create(
        user=request.user,
        quiz=quiz,
        defaults={
            'score': score,
            'passed': passed
        }
    )

    return Response({
        "score": score,
        "passed": passed
    })




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_certificate(request, course_id):
    user = request.user

    # 1️⃣ Check enrollment
    if not Enrollment.objects.filter(
        user=user,
        course_id=course_id,
        is_active=True
    ).exists():
        return HttpResponse("Not enrolled", status=403)

    # 2️⃣ Check quiz passed
    quiz_attempt = QuizAttempt.objects.filter(
        user=user,
        quiz__module__course_id=course_id,
        passed=True
    ).first()

    if not quiz_attempt:
        return HttpResponse("Quiz not passed", status=403)

    # 3️⃣ Create or get certificate
    certificate, created = Certificate.objects.get_or_create(
        user=user,
        course_id=course_id,
        defaults={
            "certificate_id": str(uuid.uuid4())
        }
    )

    course = Course.objects.get(id=course_id)

    # 4️⃣ Create PDF response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="certificate.pdf"'

    # ✅ THIS LINE WAS MISSING BEFORE
    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    # ================= DESIGN =================

    # Border
    p.setStrokeColor(HexColor("#2E86C1"))
    p.setLineWidth(4)
    p.rect(30, 30, width - 60, height - 60)

    # Title
    p.setFont("Helvetica-Bold", 30)
    p.setFillColor(HexColor("#2E86C1"))
    p.drawCentredString(width / 2, height - 120, "CERTIFICATE OF COMPLETION")

    # Subtitle
    p.setFont("Helvetica", 16)
    p.setFillColor(black)
    p.drawCentredString(width / 2, height - 170, "This is proudly presented to")

    # Student Name
    p.setFont("Helvetica-Bold", 24)
    p.drawCentredString(width / 2, height - 230, user.username)

    # Course text
    p.setFont("Helvetica", 16)
    p.drawCentredString(
        width / 2,
        height - 280,
        "For successfully completing the course"
    )

    # Course name
    p.setFont("Helvetica-Bold", 20)
    p.drawCentredString(width / 2, height - 330, course.title)

    # Footer
    p.setFont("Helvetica", 12)
    p.drawString(80, 120, f"Certificate ID: {certificate.certificate_id}")
    p.drawString(
        80,
        100,
        f"Issued on: {certificate.issued_at.strftime('%d %B %Y')}"
    )

    # Signature
    p.line(width - 250, 140, width - 80, 140)
    p.drawString(width - 230, 120, "Authorized Signature")

    # Finish PDF
    p.showPage()
    p.save()

    return response



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def course_progress(request, course_id):
    user = request.user

    # 1️⃣ Check enrollment
    if not Enrollment.objects.filter(
        user=user,
        course_id=course_id,
        is_active=True
    ).exists():
        return Response(
            {"error": "Not enrolled in this course"},
            status=403
        )

    # 2️⃣ Total modules in course
    total_modules = Module.objects.filter(course_id=course_id).count()

    if total_modules == 0:
        return Response({
            "course_id": course_id,
            "progress": 0,
            "completed_modules": 0,
            "total_modules": 0,
            "completed": False
        })

    # 3️⃣ Passed quizzes (completed modules)
    completed_modules = QuizAttempt.objects.filter(
        user=user,
        quiz__module__course_id=course_id,
        passed=True
    ).count()

    # 4️⃣ Progress calculation
    progress_percentage = int((completed_modules / total_modules) * 100)

    # 5️⃣ Completion status
    completed = completed_modules == total_modules

    return Response({
        "course_id": course_id,
        "completed_modules": completed_modules,
        "total_modules": total_modules,
        "progress": progress_percentage,
        "completed": completed
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
            serializer.save()
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