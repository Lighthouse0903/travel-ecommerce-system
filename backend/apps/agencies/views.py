from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from .serializers import AgencyApplySerializer, AgencySerializer
from .models import Agency
class AgencyApplyView(generics.CreateAPIView):
    serializer_class = AgencyApplySerializer
    permission_classes = [permissions.IsAuthenticated]

class MyAgencyView(generics.RetrieveUpdateAPIView):
    serializer_class = AgencySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return Agency.objects.get(user=self.request.user)
        except Agency.DoesNotExist:
            raise NotFound("Bạn chưa đăng ký Agency.")
