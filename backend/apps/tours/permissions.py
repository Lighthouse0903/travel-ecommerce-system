# from rest_framework import permissions

# class IsAgencyOwnerOrReadOnly(permissions.BasePermission):
#     def has_permission(self, request, view):
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         if request.method == 'POST':
#             return hasattr(request.user, 'agency_profile')
#         return True

#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         return hasattr(request.user, 'agency_profile') and obj.agency.user_id == request.user.user_id

# class IsAgencyUser(permissions.BasePermission):
#     """
#     Chỉ cho phép user đã đăng ký agency.
#     (kiểm tra có OneToOne agency_profile)
#     """
#     message = "Bạn chưa đăng ký agency."

#     def has_permission(self, request, view):
#         user = request.user
#         if not user or not user.is_authenticated:
#             return False
#         return hasattr(user, 'agency_profile')  # hoặc: return 2 in getattr(user, 'roles', [])


from rest_framework import permissions


def get_agency_profile(user):
    """
    Trả về agency_profile nếu có, nếu không có thì None.
    Tránh hasattr() vì OneToOne reverse có thể raise RelatedObjectDoesNotExist.
    """
    if not user or not user.is_authenticated:
        return None
    try:
        return user.agency_profile
    except Exception:
        return None


class IsAgencyOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == "POST":
            return get_agency_profile(request.user) is not None

        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        agency = get_agency_profile(request.user)
        if agency is None:
            return False

        # tour.agency có thể null do SET_NULL
        if not obj.agency:
            return False

        # so sánh bằng agency_id cho chắc (đỡ phụ thuộc user_id field)
        return str(obj.agency.agency_id) == str(agency.agency_id)


class IsAgencyUser(permissions.BasePermission):
    message = "Bạn chưa đăng ký agency."

    def has_permission(self, request, view):
        return get_agency_profile(request.user) is not None
