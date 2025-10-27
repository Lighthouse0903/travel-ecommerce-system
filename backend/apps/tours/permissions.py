from rest_framework import permissions

class IsAgencyOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method == 'POST':
            return hasattr(request.user, 'agency_profile')
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return hasattr(request.user, 'agency_profile') and obj.agency.user_id == request.user.user_id

class IsAgencyUser(permissions.BasePermission):
    """
    Chỉ cho phép user đã đăng ký agency.
    (kiểm tra có OneToOne agency_profile)
    """
    message = "Bạn chưa đăng ký agency."

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return hasattr(user, 'agency_profile')  # hoặc: return 2 in getattr(user, 'roles', [])
