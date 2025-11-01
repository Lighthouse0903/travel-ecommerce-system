# backend/utils/custom_exception_handler.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        # Lấy dữ liệu lỗi gốc từ DRF
        errors = {}
        for field, messages in response.data.items():
            # Chuyển danh sách ["msg"] thành chuỗi "msg"
            if isinstance(messages, list) and len(messages) > 0:
                errors[field] = messages[0]
            else:
                errors[field] = messages

        response.data = {
            "message": errors  # Đổi key từ "error" thành "message"
        }

    else:
        # Xử lý lỗi ngoài DRF (lỗi hệ thống, server 500)
        response = Response(
            {"message": "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
