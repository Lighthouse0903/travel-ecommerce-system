from rest_framework import serializers
from .models import Tour, TourImage
import os, uuid, json
from django.core.files.base import ContentFile


class TourImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourImage
        fields = ["img_id", "image"]


class TourSerializer(serializers.ModelSerializer):
    agency_id = serializers.UUIDField(source="agency.agency_id", read_only=True)
    agency_name = serializers.CharField(source="agency.company_name", read_only=True)
    email_agency = serializers.EmailField(source="agency.email_agency", read_only=True)
    hotline = serializers.CharField(source="agency.hotline", read_only=True)

    images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)
    image_urls = TourImageSerializer(source="images", many=True, read_only=True)

    pickup_points = serializers.JSONField(required=False)
    itinerary = serializers.JSONField(required=False)
    transportation = serializers.JSONField(required=False)
    services_included = serializers.JSONField(required=False)
    services_excluded = serializers.JSONField(required=False)
    policy = serializers.JSONField(required=False)
    guide = serializers.JSONField(required=False)
    is_active = serializers.BooleanField(required=False)

    class Meta:
        model = Tour
        fields = [
            "tour_id",
            "agency_id", "agency_name", "email_agency", "hotline",
            "name", "description", "price", "discount_price",
            "duration_days", "destination", "start_location", "end_location",
            "rating", "reviews_count", "region", "categories",
            "pickup_points", "itinerary", "transportation",
            "services_included", "services_excluded", "policy", "guide",
            "is_active", "created_at", "updated_at", "images", "image_urls"
        ]
        read_only_fields = [
            "tour_id", "agency_id", "agency_name", "email_agency", "hotline",
            "created_at", "updated_at", "rating", "reviews_count"
        ]

    def _save_image_to_s3(self, instance, f):
        try:
            f.seek(0)
        except Exception:
            pass
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
        if images:
            for f in images:
                self._save_image_to_s3(instance, f)
        return instance

    def validate_pickup_points(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("pickup_points phải là danh sách.")
        for p in value:
            if not all(k in p for k in ["location", "address", "time"]):
                raise serializers.ValidationError("Mỗi điểm đón phải có location, address và time.")
        return value

    def validate_itinerary(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("itinerary phải là danh sách.")
        for day in value:
            if not all(k in day for k in ["day", "title", "activities"]):
                raise serializers.ValidationError("Mỗi ngày trong itinerary phải có day, title và activities.")
            if not isinstance(day["activities"], list) or not day["activities"]:
                raise serializers.ValidationError("activities phải là danh sách và không được rỗng.")
            acc = day.get("accommodation")
            if acc:
                required_acc = ["hotel_name", "stars", "nights", "address"]
                missing = [f for f in required_acc if f not in acc]
                if missing:
                    raise serializers.ValidationError(f"Thiếu trường trong accommodation: {', '.join(missing)}")
        return value

    def validate_policy(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("policy phải là object.")
        required = ["deposit_percent", "cancellation_fee", "refund_policy"]
        for field in required:
            if field not in value:
                raise serializers.ValidationError(f"Thiếu trường {field} trong policy.")
        if not (0 <= value["deposit_percent"] <= 100):
            raise serializers.ValidationError({"policy": "deposit_percent phải trong khoảng 0–100."})
        return value

    def validate_guide(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("guide phải là object.")
        required = ["name_guide", "phone_guide"]
        for field in required:
            if field not in value:
                raise serializers.ValidationError(f"Thiếu trường {field} trong guide.")
        return value

    def validate(self, attrs):
        json_fields = [
            "pickup_points", "itinerary", "transportation",
            "services_included", "services_excluded", "policy", "guide"
        ]
        for f in json_fields:
            raw = self.initial_data.get(f)
            if isinstance(raw, str):
                try:
                    attrs[f] = json.loads(raw)
                except Exception:
                    raise serializers.ValidationError({f: "Giá trị phải là JSON hợp lệ."})

        raw_cat = self.initial_data.get("categories")

        if isinstance(raw_cat, str):
            try:
                # Thử parse JSON trước
                parsed = json.loads(raw_cat)
                if isinstance(parsed, list):
                    attrs["categories"] = parsed
                else:
                    raise serializers.ValidationError({"categories": "Phải là danh sách JSON."})
            except Exception:
                attrs["categories"] = [c.strip() for c in raw_cat.split(",") if c.strip()]

        elif isinstance(raw_cat, list):
            attrs["categories"] = raw_cat

        price = attrs.get("price")
        discount_price = attrs.get("discount_price")
        if discount_price is not None and price is not None and discount_price > price:
            raise serializers.ValidationError({"discount_price": "Giá giảm không được lớn hơn giá gốc."})

        itinerary = attrs.get("itinerary")
        duration_days = attrs.get("duration_days")
        if itinerary and duration_days and len(itinerary) != duration_days:
            raise serializers.ValidationError({
                "itinerary": f"Số ngày trong itinerary ({len(itinerary)}) phải bằng duration_days ({duration_days})."
            })

        return attrs


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

