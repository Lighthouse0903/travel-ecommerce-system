from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from django.db import IntegrityError
from datetime import date
class UserRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        error_messages={
            "blank": "Tên đăng nhập không được để trống.",
            "required": "Tên đăng nhập là bắt buộc."
        },
        validators=[]  # Gỡ UniqueValidator mặc định
    )

    email = serializers.EmailField(
        required=True,
        error_messages={
            "blank": "Email không được để trống.",
            "required": "Email là bắt buộc.",
            "invalid": "Địa chỉ email không hợp lệ."
        },
        validators=[]  # Gỡ UniqueValidator mặc định
    )

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        error_messages={
            "required": "Mật khẩu là bắt buộc.",
            "blank": "Mật khẩu không được để trống."
        }
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name', 'phone', 'address', 'date_of_birth']

    def validate(self, attrs):
        errors = {}

        if User.objects.filter(username=attrs['username']).exists():
            errors["username"] = ["Tên đăng nhập đã tồn tại."]

        if User.objects.filter(email=attrs['email']).exists():
            errors["email"] = ["Email đã tồn tại."]

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                full_name=validated_data.get('full_name', ''),
                phone=validated_data.get('phone', ''),
                address=validated_data.get('address', ''),
                date_of_birth=validated_data.get('date_of_birth', None)
            )
            return user
        except IntegrityError:
            raise serializers.ValidationError(
            {
                "non_field_errors": [
                    "Đã xảy ra lỗi khi tạo tài khoản, vui lòng thử lại sau."
                ]
            }
        )



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
        login = attrs.get('login')
        password = attrs.get('password')
        phone = normalize_phone(login)

        # Tìm user theo username / email / số điện thoại
        user = User.objects.filter(
            Q(username__iexact=login) |
            Q(email__iexact=login) |
            Q(phone=phone)
        ).first()

        # Nếu không tìm thấy user
        if not user:
            raise serializers.ValidationError({
                "login": ["Tên đăng nhập không tồn tại."]
            })

        # Nếu sai mật khẩu
        if not user.check_password(password):
            raise serializers.ValidationError({
                "password": ["Mật khẩu không đúng."]
            })


        # Nếu tài khoản bị vô hiệu hóa
        if not user.is_active:
            raise serializers.ValidationError({
                "account": ["Tài khoản của bạn đã bị vô hiệu hóa."]
            })

        # Nếu mọi thứ hợp lệ
        refresh = RefreshToken.for_user(user)
        attrs['user'] = user
        attrs['refresh'] = str(refresh)
        attrs['access'] = str(refresh.access_token)
        return attrs
class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        allow_blank=True,
        error_messages={
            "required": "Tên đăng nhập là bắt buộc.",
        },
    )

    class Meta:
        model = User
        fields = [
            "user_id","username","email","full_name",
            "phone","address","date_of_birth","roles","created_at"
        ]
        read_only_fields = ["user_id", "email", "roles", "created_at"]

    def validate_username(self, value):
        value = (value or "").strip()
        if value == "":
            raise serializers.ValidationError("Tên đăng nhập không được để trống.")

        qs = User.objects.filter(username__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError("Tên đăng nhập đã tồn tại.")
        return value

    def validate_date_of_birth(self, value):
        if value and value > date.today():
            raise serializers.ValidationError("Ngày sinh không hợp lệ.")
        return value
    def validate_phone(self, value):
        # Cho phép null / empty (đã normalize "" -> None ở validate())
        if not value:
            return value

        qs = User.objects.filter(phone=value)

        # Nếu đang update → loại trừ chính mình
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError("Số điện thoại đã được sử dụng.")

        return value

    def validate(self, attrs):
        for k in ["full_name", "phone", "address"]:
            if k in attrs and attrs[k] == "":
                attrs[k] = None
        if "date_of_birth" in attrs and attrs["date_of_birth"] == "":
            attrs["date_of_birth"] = None
        return attrs

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mật khẩu hiện tại không đúng.")
        return value

    def validate_new_password(self, value):
        user = self.context["request"].user
        # Nếu mật khẩu mới giống mật khẩu cũ
        if user.check_password(value):
            raise serializers.ValidationError("Mật khẩu mới phải khác mật khẩu hiện tại.")
        return value
