from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import User
from .serializers import UserRegisterSerializer, UserProfileSerializer, ChangePasswordSerializer, LoginSerializer

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
class LoginView(APIView):
    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.validated_data['user']
        access_token = ser.validated_data['access']
        refresh_token = ser.validated_data['refresh']
        resp = Response(
            {
                "access": access_token,
                "user_id": str(user.user_id),
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "roles": user.roles,
                "message": "Login successful"
            },
            status=status.HTTP_200_OK
        )
        resp.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=5*60,
        )
        resp.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,
        )
        return resp

# API Refresh token


class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token not found."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)

            resp = Response(
                {
                    "access": new_access,
                    "message": "Token refreshed successfully"
                },
                status=status.HTTP_200_OK
            )

            resp.set_cookie(
                key="access_token",
                value=new_access,
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=5 * 60
            )

            return resp

        except TokenError:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_401_UNAUTHORIZED
            )
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
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "Không tìm thấy refresh token trong cookie."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Đưa token vào blacklist
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {"detail": "Refresh token không hợp lệ hoặc đã hết hạn."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Xoá cookie khi logout
        response = Response(
            {"detail": "Đăng xuất thành công."},
            status=status.HTTP_200_OK
        )
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response

