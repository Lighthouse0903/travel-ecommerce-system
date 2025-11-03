from rest_framework import serializers
from .models import Agency
from django.utils.translation import gettext_lazy as _
class AgencyApplySerializer(serializers.ModelSerializer):
    license_number = serializers.CharField(
        required=True,
        validators=[]  # <- Bỏ UniqueValidator mặc định của DRF
    )

    class Meta:
        model = Agency
        fields = [
            'agency_id', 'company_name', 'address_agency', 'email_agency',
            'hotline', 'license_number', 'created_at', 'verified', 'status'
        ]
        read_only_fields = ['agency_id', 'created_at']

    def validate_license_number(self, value):
        # Kiểm tra trùng thủ công bằng tiếng Việt
        if Agency.objects.filter(license_number=value).exists():
            raise serializers.ValidationError("Số giấy phép kinh doanh này đã tồn tại.")
        return value

    def validate(self, attrs):
        user = self.context['request'].user
        if Agency.objects.filter(user=user).exists():
            raise serializers.ValidationError({"message": "Bạn đã có hồ sơ đại lý."})
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        agency = Agency.objects.create(
            user=user,
            status='pending',
            verified=False,
            **validated_data
        )

        roles = (user.roles or [])
        if hasattr(user, 'PROVIDER') and user.PROVIDER not in roles:
            user.roles = roles + [user.PROVIDER]
            user.save(update_fields=['roles'])

        return agency

class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = [
            'agency_id', 'company_name', 'license_number',
            'hotline', 'email_agency', 'address_agency', 'verified', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['agency_id', 'verified', 'created_at', 'updated_at']