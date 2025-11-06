from rest_framework import serializers
from .models import Tour, TourImage
import os, uuid
from django.core.files.base import ContentFile
class TourImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourImage
        fields = ['img_id','image']

class TourSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source="agency.company_name", read_only=True)
    images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)
    image_urls = TourImageSerializer(source="images", many=True, read_only=True)
    is_active = serializers.BooleanField(required=False)

    class Meta:
        model = Tour
        fields = [
            "tour_id", "agency", "agency_name", "name", "description",
            "price", "duration_days", "start_location", "end_location",
            "rating", "region", "categories", "is_active",
            "created_at", "updated_at",
            "images", "image_urls",
        ]
        read_only_fields = ["tour_id", "agency", "agency_name", "created_at", "updated_at", "rating"]

    # is_active: mặc định True khi không gửi / gửi rỗng
    def validate(self, attrs):
        raw = (self.initial_data.get("is_active") if hasattr(self, "initial_data") else None)
        if raw in (None, "", "null"):
            attrs["is_active"] = True
        return attrs

    def _save_image_to_s3(self, instance, f):
        try: f.seek(0)
        except Exception: pass
        name, ext = os.path.splitext(getattr(f, "name", "upload"))
        safe_name = f"{name}_{uuid.uuid4().hex}{ext}"
        data = f.read()
        ti = TourImage(tour=instance)
        ti.image.save(safe_name, ContentFile(data), save=True)

    def create(self, validated_data):
        images = validated_data.pop("images", [])
        tour = Tour.objects.create(**validated_data)
        for f in images:
            self._save_image_to_s3(tour, f)
        return tour

    def update(self, instance, validated_data):
        images = validated_data.pop("images", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if images is not None:
            for f in images:
                self._save_image_to_s3(instance, f)

        return instance


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


class TourImageUploadSerializer(serializers.Serializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        allow_empty=False,
        write_only=True
    )
    def validate_images(self, value):
        if not value:
            raise serializers.ValidationError("Bạn cần upload ít nhất 1 ảnh.")
        if len(value) > 10:
            raise serializers.ValidationError("Tối đa 10 ảnh mỗi lần upload.")
        return value

    def create(self, validated_data):
        tour = self.context['tour']
        images = validated_data['images']
        objs = [TourImage(tour=tour, image=img) for img in images]
        return TourImage.objects.bulk_create(objs)

