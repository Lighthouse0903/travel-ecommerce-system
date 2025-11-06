import os
import uuid
from rest_framework import serializers
from .models import Agency
from django.core.files.base import ContentFile
class AgencyApplySerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, write_only=True)
    license_file = serializers.FileField(required=False, write_only=True)
    avatar_url = serializers.SerializerMethodField(read_only=True)
    license_url = serializers.SerializerMethodField(read_only=True)

    license_number = serializers.CharField(required=True, validators=[])

    class Meta:
        model = Agency
        fields = [
            "agency_id", "company_name", "address_agency", "email_agency",
            "hotline", "license_number", "description",
            "avatar", "license_file",
            "avatar_url", "license_url",
            "verified", "status", "created_at",
        ]
        read_only_fields = ["agency_id", "created_at"]

    def get_avatar_url(self, obj):
        return obj.avatar.url if obj.avatar else None

    def get_license_url(self, obj):
        return obj.license_file.url if obj.license_file else None

    def validate_license_number(self, value):
        if Agency.objects.filter(license_number=value).exists():
            raise serializers.ValidationError("Số giấy phép kinh doanh này đã tồn tại.")
        return value

    def validate(self, attrs):
        user = self.context["request"].user
        if Agency.objects.filter(user=user).exists():
            raise serializers.ValidationError({"message": "Bạn đã có hồ sơ đại lý."})
        return attrs

    def _save_file_unique(self, fieldfile, fileobj):

        name, ext = os.path.splitext(getattr(fileobj, "name", "upload"))
        safe_name = f"{name}_{uuid.uuid4().hex}{ext}"
        try:
            fileobj.seek(0)
        except Exception:
            pass
        data = fileobj.read()
        fieldfile.save(safe_name, ContentFile(data), save=False)

    def create(self, validated_data):
        user = self.context["request"].user
        avatar_file = validated_data.pop("avatar", None)
        license_file = validated_data.pop("license_file", None)

        agency = Agency(
            user=user,
            status="pending",
            # verified=False,
            **validated_data,
        )

        if avatar_file:
            self._save_file_unique(agency.avatar, avatar_file)
        if license_file:
            self._save_file_unique(agency.license_file, license_file)

        agency.save()
        roles = (user.roles or [])
        if hasattr(user, "PROVIDER") and user.PROVIDER not in roles:
            user.roles = roles + [user.PROVIDER]
            user.save(update_fields=["roles"])
        return agency

class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = [
            'agency_id', 'company_name', 'license_number',
            'hotline', 'email_agency', 'address_agency', 'verified', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['agency_id', 'verified', 'created_at', 'updated_at']