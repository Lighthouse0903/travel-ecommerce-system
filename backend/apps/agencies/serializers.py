import os, json, logging, uuid
from rest_framework import serializers
from .models import Agency
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)

class AgencyApplySerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False, write_only=True)
    license_file = serializers.FileField(required=False, write_only=True)

    avatar_url = serializers.SerializerMethodField(read_only=True)
    license_url = serializers.SerializerMethodField(read_only=True)

    license_number = serializers.CharField(required=True)

    class Meta:
        model = Agency
        fields = [
            "agency_id", "agency_name", "address_agency", "email_agency",
            "hotline", "license_number", "description",
            "avatar", "license_file",
            "avatar_url", "license_url",
            "verified", "status", "created_at",
        ]
        read_only_fields = ["agency_id", "created_at", "verified", "status"]

    def get_avatar_url(self, obj):
        return obj.avatar.url if obj.avatar else None

    def get_license_url(self, obj):
        return obj.license_file.url if obj.license_file else None

    def _save_file_unique(self, fieldfile, fileobj):
        import os, uuid
        from django.core.files.base import ContentFile
        name, ext = os.path.splitext(getattr(fileobj, "name", "upload"))
        safe_name = f"{name}_{uuid.uuid4().hex}{ext}"
        try:
            fileobj.seek(0)
        except Exception:
            pass
        data = fileobj.read()
        fieldfile.save(safe_name, ContentFile(data), save=False)

    def validate(self, attrs):
        user = self.context["request"].user

        if Agency.objects.filter(user=user).exists():
            raise serializers.ValidationError({"message": "Bạn đã có hồ sơ đại lý."})

        email = self.initial_data.get("email_agency") or attrs.get("email_agency")
        hotline = self.initial_data.get("hotline") or attrs.get("hotline")
        license_number = self.initial_data.get("license_number") or attrs.get("license_number")

        duplicates = []

        if email and Agency.objects.filter(email_agency__iexact=email).exists():
            duplicates.append("email")
        if hotline and Agency.objects.filter(hotline=hotline).exists():
            duplicates.append("hotline")
        if license_number and Agency.objects.filter(license_number=license_number).exists():
            duplicates.append("số giấy phép kinh doanh")

        if duplicates:
            joined = ", ".join(duplicates)
            if len(duplicates) == 1:
                msg = f"Trùng {joined} với agency khác."
            else:
                msg = f"Trùng {joined} với agency khác."
            raise serializers.ValidationError({"message": msg})

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        avatar_file = validated_data.pop("avatar", None)
        license_file = validated_data.pop("license_file", None)

        agency = Agency(
            user=user,
            status="pending",  # user gửi hồ sơ → pending
            verified=False,
            **validated_data,
        )

        if avatar_file:
            self._save_file_unique(agency.avatar, avatar_file)
        if license_file:
            self._save_file_unique(agency.license_file, license_file)

        agency.save()
        return agency


class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = [
            'agency_id', 'agency_name', 'license_number',
            'hotline', 'email_agency', 'address_agency', 'verified', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['agency_id', 'verified', 'created_at', 'updated_at']