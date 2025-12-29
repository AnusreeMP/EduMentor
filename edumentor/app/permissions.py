# app/permissions.py
from rest_framework.permissions import BasePermission
from .models import Enrollment
from .models import Enrollment, Module


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.profile.role == 'ADMIN'
        )


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.profile.role == 'STUDENT'
        )


class IsEnrolledStudent(BasePermission):
    def has_permission(self, request, view):
        course_id = view.kwargs.get('course_id')

        if not course_id:
            return False

        return Enrollment.objects.filter(
            user=request.user,
            course_id=course_id,
            is_active=True
        ).exists()

class IsEnrolledViaModule(BasePermission):
    def has_permission(self, request, view):
        module_id = view.kwargs.get('module_id')

        if not module_id:
            return False

        # ✅ ADMIN BYPASS (CRITICAL)
        if request.user.profile.role == 'ADMIN':
            return True

        try:
            module = Module.objects.get(id=module_id)
        except Module.DoesNotExist:
            return False

        return Enrollment.objects.filter(
            user=request.user,
            course=module.course,
            is_active=True
        ).exists()