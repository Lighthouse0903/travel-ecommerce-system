from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound
from .serializers import AgencyApplySerializer, AgencySerializer
from .models import Agency
from rest_framework.response import Response

class AgencyApplyView(generics.CreateAPIView):
    serializer_class = AgencyApplySerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        agency = serializer.save()

        return Response(
            {
                "data": self.get_serializer(agency).data,
                "message": "Gửi hồ sơ đại lý thành công. Vui lòng chờ xác minh."
            },
            status=status.HTTP_201_CREATED
        )
class MyAgencyView(generics.RetrieveUpdateAPIView):
    serializer_class = AgencySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return Agency.objects.get(user=self.request.user)
        except Agency.DoesNotExist:
            # Trả lỗi dạng JSON đẹp
            raise NotFound(detail="Bạn chưa đăng ký Agency.")

    def get(self, request, *args, **kwargs):
        agency = self.get_object()
        serializer = self.get_serializer(agency)
        return Response(
            {
                "data": serializer.data,
                "message": "Lấy thông tin Agency thành công."
            },
            status=status.HTTP_200_OK
        )

    def update(self, request, *args, **kwargs):
        agency = self.get_object()
        serializer = self.get_serializer(agency, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "data": serializer.data,
                "message": "Cập nhật thông tin Agency thành công."
            },
            status=status.HTTP_200_OK
        )
