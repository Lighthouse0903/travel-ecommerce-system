from rest_framework import serializers
from .models import Tour

class TourSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source="agency.company_name", read_only=True)

    class Meta:
        model = Tour
        fields = [
            'tour_id', 'agency', 'agency_name', 'name', 'description',
            'price', 'duration_days', 'start_location', 'end_location',
            'rating', 'region', 'categories', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['tour_id', 'agency', 'agency_name', 'created_at', 'updated_at', 'rating']

class TourPublicSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source="agency.company_name", read_only=True)

    class Meta:
        model = Tour
        fields = [
            "tour_id", "name", "description",
            "price", "duration_days",
            "start_location", "end_location",
            "rating", "region", "categories",
            "is_active",
            "agency", "agency_name",
            "created_at",
        ]
        read_only_fields = fields
