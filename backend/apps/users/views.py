from django.core.serializers import serialize
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.core.exceptions import ValidationError
from .models import User
from .serializers import (
    UserRegisterSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    LoginSerializer,
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            # Chuyển tất cả lỗi dạng list -> string đơn
            error_detail = {}
            for key, value in e.detail.items():
                if isinstance(value, list) and len(value) > 0:
                    error_detail[key] = value[0]
                else:
                    error_detail[key] = value

            return Response(
                {"message": error_detail},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.save()
        data = {
            "user_id": str(user.user_id),
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
        }

        return Response(
            {"data": data, "message": "Đăng ký tài khoản thành công!"},
            status=status.HTTP_201_CREATED
        )


class LoginView(APIView):
    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        user = ser.validated_data["user"]
        access_token = ser.validated_data["access"]
        refresh_token = ser.validated_data["refresh"]
        data = {
            "access": access_token,
            "user": {
                "user_id": str(user.user_id),
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "roles": user.roles,
            }

        }
        resp = Response(
            {
                "data": data,
                "message": "Đăng nhập thành công.",
            },
            status=status.HTTP_200_OK,
        )

        resp.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=5 * 60,
            path="/",
        )

        resp.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            path="/",
            max_age=7 * 24 * 60 * 60,
        )

        return resp



class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response(
                {"message": "Refresh token not found."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)

            resp = Response(
                {
                    "access": new_access,
                    "message": "Token refreshed successfully",
                },
                status=status.HTTP_200_OK,
            )

            resp.set_cookie(
                key="access_token",
                value=new_access,
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=5 * 60,
                path="/",
            )

            return resp

        except TokenError:
            return Response(
                {"message": "Invalid or expired refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )



class UserProfileView(generics.RetrieveUpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response(
            {
                "data": serializer.data,
                "message": "Trả data về thành công."
            },
            status=status.HTTP_200_OK
        )
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response (
            {
                "data":serializer.data,
                "message":"Cập nhật hồ sơ thành công."
            },
            status = status.HTTP_200_OK
        )
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        ser = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        ser.is_valid(raise_exception=True)
        request.user.set_password(ser.validated_data["new_password"])
        request.user.save()
        return Response(
            {"message": "Đổi mật khẩu thành công."},
            status=status.HTTP_200_OK,
        )



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"message": "Không tìm thấy refresh token trong cookie."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {"message": "Refresh token không hợp lệ hoặc đã hết hạn."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = Response(
            {"message": "Đăng xuất thành công."},
            status=status.HTTP_200_OK,
        )

        response.delete_cookie("access_token", path="/")
        response.delete_cookie("refresh_token", path="/")

        return response
