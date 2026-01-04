from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import (
    ValidationError,
    AuthenticationFailed,
    NotAuthenticated,
    PermissionDenied,
    NotFound,
    MethodNotAllowed,
)

def _normalize_errors(detail):
    if isinstance(detail, dict):
        errors = {}
        for k, v in detail.items():
            if isinstance(v, list):
                errors[k] = [str(x) for x in v]
            else:
                errors[k] = [str(v)]
        return errors

    if isinstance(detail, list):
        return {"non_field_errors": [str(x) for x in detail]}

    return {"non_field_errors": [str(detail)]}


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return Response(
            {
                "message": "Lỗi hệ thống, vui lòng thử lại sau.",
                "errors": {"server": ["Internal server error"]},
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    data = response.data

    if isinstance(exc, ValidationError):
        message = "Dữ liệu không hợp lệ."
        errors = _normalize_errors(data)

    elif isinstance(exc, (AuthenticationFailed, NotAuthenticated)):
        message = "Bạn chưa đăng nhập."
        errors = {"auth": [str(data.get("detail", "Authentication failed."))]}

    elif isinstance(exc, PermissionDenied):
        message = "Bạn không có quyền thực hiện thao tác này."
        errors = {"permission": [str(data.get("detail", "Permission denied."))]}

    elif isinstance(exc, NotFound):
        message = "Không tìm thấy tài nguyên."
        errors = {"not_found": [str(data.get("detail", "Not found."))]}

    elif isinstance(exc, MethodNotAllowed):
        message = "Phương thức không được hỗ trợ."
        errors = {"method": [str(data.get("detail", "Method not allowed."))]}

    else:
        detail_msg = data.get("message") or data.get("detail") or "Yêu cầu thất bại."
        message = str(detail_msg)
        errors = _normalize_errors(data)

    response.data = {"message": message, "errors": errors}
    return response
