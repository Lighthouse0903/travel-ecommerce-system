from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework import generics, status, serializers
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserRegisterSerializer, UserProfileSerializer, ChangePasswordSerializer

# API Register
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        data = {
            "id": str(user.user_id),
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
        }
        return Response(data, status=status.HTTP_201_CREATED)

# API Login
User = get_user_model()

def normalize_phone(s: str) -> str:
    if not s:
        return s
    s = s.strip().replace(' ', '').replace('-', '')
    if s.startswith('+84'):
        s = '0' + s[3:]
    return s

class LoginSerializer(serializers.Serializer):
    login = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    def validate(self, attrs):
        login = attrs['login']
        password = attrs['password']
        phone = normalize_phone(login)

        user = User.objects.filter(
            Q(username__iexact=login) |
            Q(email__iexact=login) |
            Q(phone=phone)
        ).first()

        if not user or not user.check_password(password):
            raise AuthenticationFailed('Invalid credentials.')

        if not user.is_active:
            raise AuthenticationFailed('Account is inactive.')

        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user_id": str(user.user_id),
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "roles": user.roles,
        }

class LoginView(APIView):
    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        return Response(ser.validated_data, status=status.HTTP_200_OK)

# API View/Change Profile
class UserProfileView(generics.RetrieveUpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    def get_object(self):
        return self.request.user

# API Change Password
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        ser = ChangePasswordSerializer(data=request.data, context={'request':request})
        ser.is_valid(raise_exception=True)
        request.user.set_password(ser.validated_data['new_password'])
        request.user.save()
        return Response({"detail": "Đổi mật khẩu thành công."}, status=status.HTTP_200_OK)

# API Logout
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Thiếu refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Đã đăng xuất."}, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {"detail": "Refresh token không hợp lệ."},
                status=status.HTTP_400_BAD_REQUEST
            )