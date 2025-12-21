import os
import uuid
import logging

from rest_framework import serializers
from django.core.files.base import ContentFile

from .models import Agency

logger = logging.getLogger(__name__)


class AgencyApplySerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(
        required=False,
        write_only=True,
        error_messages={
            "invalid": "Ảnh đại diện không hợp lệ.",
            "empty": "Ảnh đại diện không hợp lệ.",
        },
    )

    license_file = serializers.FileField(
        required=True,
        write_only=True,
        error_messages={
            "required": "Vui lòng tải lên giấy phép kinh doanh.",
            "invalid": "File giấy phép kinh doanh không hợp lệ.",
            "empty": "File giấy phép kinh doanh không hợp lệ.",
        },
    )

    legal_id_front = serializers.ImageField(
        required=True,
        write_only=True,
        error_messages={
            "required": "Vui lòng tải lên ảnh CCCD/CMND mặt trước.",
            "invalid": "Ảnh CCCD/CMND mặt trước không hợp lệ.",
            "empty": "Ảnh CCCD/CMND mặt trước không hợp lệ.",
        },
    )

    legal_id_back = serializers.ImageField(
        required=True,
        write_only=True,
        error_messages={
            "required": "Vui lòng tải lên ảnh CCCD/CMND mặt sau.",
            "invalid": "Ảnh CCCD/CMND mặt sau không hợp lệ.",
            "empty": "Ảnh CCCD/CMND mặt sau không hợp lệ.",
        },
    )

    avatar_url = serializers.SerializerMethodField(read_only=True)
    license_url = serializers.SerializerMethodField(read_only=True)

    agency_name = serializers.CharField(
        required=True,
        error_messages={
            "required": "Vui lòng nhập tên đại lý.",
            "blank": "Vui lòng nhập tên đại lý.",
        },
    )

    agency_type = serializers.ChoiceField(
        choices=Agency.AGENCY_TYPE_CHOICES,
        required=True,
        error_messages={
            "required": "Vui lòng chọn loại đại lý.",
            "invalid_choice": "Loại đại lý không hợp lệ.",
        },
    )

    address_agency = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    description = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    email_agency = serializers.EmailField(
        required=False,
        allow_null=True,
        allow_blank=True,
        error_messages={"invalid": "Email không đúng định dạng."},
    )

    hotline = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    license_number = serializers.CharField(
        required=True,
        error_messages={
            "required": "Vui lòng nhập số giấy phép kinh doanh.",
            "blank": "Vui lòng nhập số giấy phép kinh doanh.",
        },
    )

    legal_representative_name = serializers.CharField(
        required=True,
        error_messages={
            "required": "Vui lòng nhập tên người đại diện pháp luật.",
            "blank": "Vui lòng nhập tên người đại diện pháp luật.",
        },
    )

    legal_id_number = serializers.CharField(
        required=True,
        error_messages={
            "required": "Vui lòng nhập số CCCD/CMND.",
            "blank": "Vui lòng nhập số CCCD/CMND.",
        },
    )

    tax_code = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    bank_name = serializers.CharField(
        required=True,
        error_messages={
            "required": "Vui lòng nhập tên ngân hàng.",
            "blank": "Vui lòng nhập tên ngân hàng.",
        },
    )

    bank_account_number = serializers.CharField(
        required=True,
        error_messages={
            "required": "Vui lòng nhập số tài khoản ngân hàng.",
            "blank": "Vui lòng nhập số tài khoản ngân hàng.",
        },
    )

    bank_account_holder = serializers.CharField(
        required=True,
        error_messages={
            "required": "Vui lòng nhập tên chủ tài khoản.",
            "blank": "Vui lòng nhập tên chủ tài khoản.",
        },
    )

    class Meta:
        model = Agency
        fields = [
            "agency_id",
            "agency_name",
            "agency_type",
            "address_agency",
            "email_agency",
            "hotline",
            "license_number",
            "description",
            "legal_representative_name",
            "legal_id_number",
            "tax_code",
            "bank_name",
            "bank_account_number",
            "bank_account_holder",
            "avatar",
            "license_file",
            "legal_id_front",
            "legal_id_back",
            "avatar_url",
            "license_url",
            "verified",
            "status",
            "created_at",
        ]
        read_only_fields = ["agency_id", "verified", "status", "created_at"]

    def get_avatar_url(self, obj):
        return obj.avatar.url if obj.avatar else None

    def get_license_url(self, obj):
        return obj.license_file.url if obj.license_file else None

    def _save_file_unique(self, fieldfile, fileobj):
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
            raise serializers.ValidationError(
                {"non_field_errors": ["Bạn đã đăng ký đại lý rồi. Không thể đăng ký lại."]}
            )

        agency_type = attrs.get("agency_type")
        tax_code = attrs.get("tax_code")
        email_agency = attrs.get("email_agency")
        hotline = attrs.get("hotline")
        license_number = attrs.get("license_number")
        legal_id_number = attrs.get("legal_id_number")

        errors = {}

        if agency_type == "business" and not tax_code:
            errors["tax_code"] = ["Mã số thuế là bắt buộc đối với doanh nghiệp."]

        if email_agency and Agency.objects.filter(email_agency__iexact=email_agency).exists():
            errors["email_agency"] = ["Email đại lý đã tồn tại."]

        if hotline and Agency.objects.filter(hotline=hotline).exists():
            errors["hotline"] = ["Số hotline đã tồn tại."]

        if license_number and Agency.objects.filter(license_number=license_number).exists():
            errors["license_number"] = ["Số giấy phép kinh doanh đã tồn tại."]

        if legal_id_number and Agency.objects.filter(legal_id_number=legal_id_number).exists():
            errors["legal_id_number"] = ["Số CCCD/CMND đã được sử dụng."]

        if tax_code and Agency.objects.filter(tax_code=tax_code).exists():
            errors["tax_code"] = ["Mã số thuế đã tồn tại."]

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user

        avatar_file = validated_data.pop("avatar", None)
        license_file = validated_data.pop("license_file", None)
        legal_id_front = validated_data.pop("legal_id_front", None)
        legal_id_back = validated_data.pop("legal_id_back", None)

        agency = Agency(
            user=user,
            status="pending",
            verified=False,
            **validated_data,
        )

        if avatar_file:
            self._save_file_unique(agency.avatar, avatar_file)

        if license_file:
            self._save_file_unique(agency.license_file, license_file)

        if legal_id_front:
            self._save_file_unique(agency.legal_id_front, legal_id_front)

        if legal_id_back:
            self._save_file_unique(agency.legal_id_back, legal_id_back)

        agency.save()
        return agency
    
class AgencyUpdateSerializer(serializers.ModelSerializer):
    email_agency = serializers.EmailField(required=False, allow_null=True, allow_blank=True, validators=[])
    hotline = serializers.CharField(required=False, allow_null=True, allow_blank=True, validators=[])
    license_number = serializers.CharField(required=False, allow_null=True, allow_blank=True, validators=[])
    legal_id_number = serializers.CharField(required=False, allow_null=True, allow_blank=True, validators=[])
    tax_code = serializers.CharField(required=False, allow_null=True, allow_blank=True, validators=[])

    avatar = serializers.ImageField(required=False, write_only=True)
    license_file = serializers.FileField(required=False, write_only=True)
    legal_id_front = serializers.ImageField(required=False, write_only=True)
    legal_id_back = serializers.ImageField(required=False, write_only=True)

    class Meta:
        model = Agency
        fields = [
            "agency_id",
            "agency_name",
            "agency_type",
            "address_agency",
            "email_agency",
            "hotline",
            "license_number",
            "description",
            "legal_representative_name",
            "legal_id_number",
            "tax_code",
            "bank_name",
            "bank_account_number",
            "bank_account_holder",
            "avatar",
            "license_file",
            "legal_id_front",
            "legal_id_back",
            "verified",
            "status",
            "reason_rejected",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["agency_id", "verified", "status", "reason_rejected", "created_at", "updated_at"]

    def _save_file_unique(self, fieldfile, fileobj):
        name, ext = os.path.splitext(getattr(fileobj, "name", "upload"))
        safe_name = f"{name}_{uuid.uuid4().hex}{ext}"

        try:
            fileobj.seek(0)
        except Exception:
            pass

        data = fileobj.read()
        fieldfile.save(safe_name, ContentFile(data), save=False)

    def validate(self, attrs):
        agency: Agency = self.instance
        # lấy giá trị "sau update" để check điều kiện
        agency_type = attrs.get("agency_type", agency.agency_type)
        tax_code = attrs.get("tax_code", agency.tax_code)

        errors = {}

        if agency_type == "business" and not tax_code:
            errors["tax_code"] = ["Mã số thuế là bắt buộc đối với doanh nghiệp."]

        # unique checks (exclude bản ghi hiện tại)
        def exists(qs):
            return qs.exclude(pk=agency.pk).exists()

        email_agency = attrs.get("email_agency", None)
        hotline = attrs.get("hotline", None)
        license_number = attrs.get("license_number", None)
        legal_id_number = attrs.get("legal_id_number", None)
        tax_code_in = attrs.get("tax_code", None)

        if email_agency and exists(Agency.objects.filter(email_agency__iexact=email_agency)):
            errors["email_agency"] = ["Email đại lý đã tồn tại."]

        if hotline and exists(Agency.objects.filter(hotline=hotline)):
            errors["hotline"] = ["Số hotline đã tồn tại."]

        if license_number and exists(Agency.objects.filter(license_number=license_number)):
            errors["license_number"] = ["Số giấy phép kinh doanh đã tồn tại."]

        if legal_id_number and exists(Agency.objects.filter(legal_id_number=legal_id_number)):
            errors["legal_id_number"] = ["Số CCCD/CMND đã được sử dụng."]

        if tax_code_in and exists(Agency.objects.filter(tax_code=tax_code_in)):
            errors["tax_code"] = ["Mã số thuế đã tồn tại."]

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def update(self, instance, validated_data):
        avatar_file = validated_data.pop("avatar", None)
        license_file = validated_data.pop("license_file", None)
        legal_id_front = validated_data.pop("legal_id_front", None)
        legal_id_back = validated_data.pop("legal_id_back", None)

        # update text fields
        for k, v in validated_data.items():
            setattr(instance, k, v)

        # update files nếu có gửi lên
        if avatar_file:
            self._save_file_unique(instance.avatar, avatar_file)
        if license_file:
            self._save_file_unique(instance.license_file, license_file)
        if legal_id_front:
            self._save_file_unique(instance.legal_id_front, legal_id_front)
        if legal_id_back:
            self._save_file_unique(instance.legal_id_back, legal_id_back)

        # nếu đang rejected mà user sửa/nộp lại => đưa về pending, clear reason
        if instance.status == "rejected":
            instance.status = "pending"
            instance.reason_rejected = None

        instance.save()
        return instance


class AgencySerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField(read_only=True)
    license_url = serializers.SerializerMethodField(read_only=True)
    legal_id_front_url = serializers.SerializerMethodField(read_only=True)
    legal_id_back_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Agency
        fields = [
            "agency_id",
            "agency_name",
            "agency_type",
            "license_number",
            "hotline",
            "email_agency",
            "address_agency",
            "description",
            "legal_representative_name",
            "legal_id_number",
            "tax_code",
            "bank_name",
            "bank_account_number",
            "bank_account_holder",
            "avatar_url",
            "license_url",
            "legal_id_front_url",
            "legal_id_back_url",
            "verified",
            "status",
            "reason_rejected",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "agency_id",
            "verified",
            "status",
            "reason_rejected",
            "created_at",
            "updated_at",
        ]

    def get_avatar_url(self, obj):
        return obj.avatar.url if obj.avatar else None

    def get_license_url(self, obj):
        return obj.license_file.url if obj.license_file else None

    def get_legal_id_front_url(self, obj):
        return obj.legal_id_front.url if obj.legal_id_front else None

    def get_legal_id_back_url(self, obj):
        return obj.legal_id_back.url if obj.legal_id_back else None
