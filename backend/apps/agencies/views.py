import logging

from django.db import IntegrityError
from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import Agency
from .serializers import AgencyApplySerializer, AgencySerializer,AgencyUpdateSerializer
  
logger = logging.getLogger(__name__)


class AgencyApplyView(generics.CreateAPIView):
    serializer_class = AgencyApplySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            agency = serializer.save()

            return Response(
                {
                    "data": AgencySerializer(agency).data,
                    "message": "Gửi hồ sơ đại lý thành công.",
                },
                status=status.HTTP_201_CREATED,
            )

        except ValidationError as ve:
            # ve.detail thường là dict field -> list[str]
            detail = ve.detail
            logger.warning("Agency register validation error: %s", detail)

            if isinstance(detail, dict):
                return Response(
                    {
                        "message": "Dữ liệu không hợp lệ.",
                        "errors": detail,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {
                    "message": "Dữ liệu không hợp lệ.",
                    "errors": {"non_field_errors": [str(detail)]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except IntegrityError:
            # Fallback nếu DB constraint bắn (email/hotline/mst/cccd/license)
            logger.exception("Agency register integrity error")
            return Response(
                {
                    "message": "Dữ liệu không hợp lệ.",
                    "errors": {
                        "non_field_errors": [
                            "Email/Hotline/MST/CCCD hoặc số giấy phép đã tồn tại."
                        ]
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            logger.exception("Agency register unexpected error")
            return Response(
                {"message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )



class MyAgencyView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        try:
            return Agency.objects.get(user=self.request.user)
        except Agency.DoesNotExist:
            raise NotFound(detail="Bạn chưa đăng ký Agency.")

    def get_serializer_class(self):
        # GET -> serializer đọc
        if self.request.method == "GET":
            return AgencySerializer
        # PATCH/PUT -> serializer update
        return AgencyUpdateSerializer
    
     # bọc APIResponse cho GET
    def retrieve(self, request, *args, **kwargs):
        agency = self.get_object()
        data = AgencySerializer(agency).data
        return Response(
            {
                "data": data,
                "message": "Lấy thông tin Agency thành công.",
            },
            status=status.HTTP_200_OK,
        )


    def update(self, request, *args, **kwargs):
        agency = self.get_object()

        # Không cho sửa khi đang pending
        if agency.status == "pending":
            return Response(
                {"message": "Hồ sơ đang chờ duyệt, không thể chỉnh sửa."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        partial = kwargs.pop("partial", True)
        serializer = self.get_serializer(
            agency, data=request.data, partial=partial
        )

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(
                {
                    "message": "Dữ liệu không hợp lệ.",
                    "errors": e.detail,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "data": AgencySerializer(agency).data,
                "message": "Cập nhật thông tin Agency thành công.",
            },
            status=status.HTTP_200_OK,
        )
