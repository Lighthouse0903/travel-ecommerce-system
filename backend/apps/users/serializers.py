from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name', 'phone', 'address', 'date_of_birth']

    def create(self, validated_data):
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
        attrs['user'] = user
        attrs['refresh'] = str(refresh)
        attrs['access'] = str(refresh.access_token)
        return attrs
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id','username','email','full_name','phone','address','date_of_birth','roles','created_at']
        read_only_fields = ['user_id','username','email','roles','created_at']

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mật khẩu hiện tại không đúng.")
        return value