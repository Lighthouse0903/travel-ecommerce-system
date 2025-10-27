from rest_framework import serializers
from .models import Agency

class AgencyApplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = ['agency_id', 'company_name', 'address_agency', 'email_agency', 'hotline', 'license_number', 'created_at', 'verified', 'status']
        read_only_fields = ['agency_id', 'created_at']

    def validate(self, attrs):
        user = self.context['request'].user
        if Agency.objects.filter(user=user).exists():
            raise serializers.ValidationError("Bạn đã có hồ sơ agency.")
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