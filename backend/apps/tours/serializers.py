from rest_framework import serializers
from .models import Tour, TourImage, TourThumbnail
import os, uuid, json
from django.core.files.base import ContentFile


class TourImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourImage
        fields = ["img_id", "image"]

class TourThumbnailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourThumbnail
        fields = ["thumbnail"]


class TourSerializer(serializers.ModelSerializer):
    # agency infor
    agency_id = serializers.UUIDField(source="agency.agency_id", read_only=True)
    agency_name = serializers.CharField(source="agency.agency_name", read_only=True)
    email_agency = serializers.EmailField(source="agency.email_agency", read_only=True)
    hotline = serializers.CharField(source="agency.hotline", read_only=True)


    # upload
    thumbnail = serializers.ImageField(write_only=True, required=False)
    images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)

    # urls
    thumbnail_url = serializers.SerializerMethodField(read_only=True)
    image_urls = TourImageSerializer(source="images", many=True, read_only=True)

    # JSONFIELD
    itinerary = serializers.JSONField(required=False)
    transportation = serializers.JSONField(required=False)
    services_included = serializers.JSONField(required=False)
    services_excluded = serializers.JSONField(required=False)
    policy = serializers.JSONField(required=False)
    is_active = serializers.BooleanField(required=False)


    class Meta:
        model = Tour
        fields = [
            "tour_id",
            "agency_id", "agency_name", "email_agency", "hotline",
            "name", "description",
            "departure_location", "destination",
            "adult_price", "children_price", "discount",
            "duration_days",
            "rating", "reviews_count", "region", "categories",
            "itinerary", "transportation",
            "services_included", "services_excluded", "policy",
            "is_active", "created_at", "updated_at",
            "thumbnail", "thumbnail_url",
            "images", "image_urls",
        ]

        read_only_fields = [
            "tour_id", "agency_id", "agency_name", "email_agency", "hotline",
            "created_at", "updated_at", "rating", "reviews_count", "thumbnail_url", "image_urls"
        ]

    def get_thumbnail_url(self, obj):
        thumb = getattr(obj, "thumbnail", None)
        if not thumb:
            return None
        f = getattr(thumb, "thumbnail", None)
        return getattr(f, "url", None)

    # IMAGE SAVE
    def _save_gallery_image(self, instance, f):
        try:
            f.seek(0)
        except Exception:
            pass
        _, ext = os.path.splitext(getattr(f, "name", "upload"))
        safe_name = f"{uuid.uuid4().hex}{ext}"
        data = f.read()
        ti = TourImage(tour=instance)
        ti.image.save(safe_name, ContentFile(data), save=True)
    
    def _save_thumbnail(self, instance, f):
        try:
            f.seek(0)
        except Exception:
            pass
        _, ext = os.path.splitext(getattr(f, "name", "upload"))
        safe_name = f"{uuid.uuid4().hex}{ext}"
        data = f.read()

        thumb, _ = TourThumbnail.objects.get_or_create(tour=instance)
        thumb.thumbnail.save(safe_name, ContentFile(data), save=True)

    def create(self, validated_data):
        images = validated_data.pop("images", [])
        thumbnail = validated_data.pop("thumbnail", None)
        tour = Tour.objects.create(**validated_data)
        if thumbnail:
            self._save_thumbnail(tour, thumbnail)

        for f in images:
            self._save_gallery_image(tour, f)
        return tour

    def update(self, instance, validated_data):
        images = validated_data.pop("images", None)
        thumbnail = validated_data.pop("thumbnail", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if thumbnail:
            self._save_thumbnail(instance, thumbnail)

        if images:
            for f in images:
                self._save_gallery_image(instance, f)
        return instance


    # VALIDATIONS
    def validate_itinerary(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("itinerary phải là danh sách.")

        for idx, day in enumerate(value, start=1):
            if not isinstance(day, dict):
                raise serializers.ValidationError(f"Phần tử itinerary thứ {idx} phải là object.")
            if not all(k in day for k in ["day", "title", "activities"]):
                raise serializers.ValidationError(
                    f"Ngày thứ {idx} phải có đủ các trường: day, title, activities."
                )
            if not isinstance(day["activities"], list) or not day["activities"]:
                raise serializers.ValidationError(f"activities của ngày {idx} phải là danh sách và không rỗng.")

            acc = day.get("accommodation")
            if acc:
                required_acc = ["hotel_name", "stars", "nights", "address"]
                missing = [f for f in required_acc if f not in acc]
                if missing:
                    raise serializers.ValidationError(
                        f"Thiếu trong accommodation (ngày {idx}): {', '.join(missing)}"
                    )
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


    def validate(self, attrs):
        # Parse JSON strings → objects
        json_fields = [
            "itinerary", "transportation",
            "services_included", "services_excluded", "policy"
        ]
        for f in json_fields:
            raw = self.initial_data.get(f)
            if isinstance(raw, str):
                try:
                    attrs[f] = json.loads(raw)
                except Exception:
                    raise serializers.ValidationError({f: "Giá trị phải là JSON hợp lệ."})

    
        # Parse categories
        raw_cat = self.initial_data.get("categories")
        if isinstance(raw_cat, str):
            try:
                parsed = json.loads(raw_cat)
                if isinstance(parsed, list):
                    attrs["categories"] = parsed
                else:
                    raise serializers.ValidationError({"categories": "Phải là danh sách JSON."})
            except Exception:
                attrs["categories"] = [c.strip() for c in raw_cat.split(",") if c.strip()]
        elif isinstance(raw_cat, list):
            attrs["categories"] = raw_cat

        # Default is_active
        if self.instance is None:
            raw_is_active = self.initial_data.get("is_active", None)
            if raw_is_active in (None, "", "null", "undefined"):
                attrs["is_active"] = True


        # Validate itinerary vs duration
        itinerary = attrs.get("itinerary")
        duration_days = attrs.get("duration_days")

        if itinerary is not None and duration_days is not None:
            n = len(itinerary)
            if n != duration_days:
                raise serializers.ValidationError({
                    "itinerary": f"Số ngày trong itinerary ({n}) phải bằng duration_days ({duration_days})."
                })

            try:
                days = [int(d["day"]) for d in itinerary]
            except Exception:
                raise serializers.ValidationError({"itinerary": "Mỗi day phải là số nguyên."})

            expected = set(range(1, duration_days + 1))
            actual = set(days)

            if actual != expected:
                missing = sorted(list(expected - actual))
                extra = sorted(list(actual - expected))
                problems = []
                if missing:
                    problems.append(f"thiếu các ngày: {missing}")
                if extra:
                    problems.append(f"thừa các ngày: {extra}")
                raise serializers.ValidationError({
                    "itinerary": f"Lịch trình phải gồm đủ ngày 1..{duration_days}; {', '.join(problems)}."
                })

            # trùng ngày
            if len(days) != len(set(days)):
                dupes = sorted(list({d for d in days if days.count(d) > 1}))
                raise serializers.ValidationError({
                    "itinerary": f"Bị trùng các ngày: {dupes}."
                })

        # Check trùng tour trong agency
        request = self.context.get("request")
        agency = getattr(getattr(request, "user", None), "agency_profile", None)

        if agency:
            name = attrs.get("name")
            dep = attrs.get("departure_location")
            dest = attrs.get("destination")
            duration = attrs.get("duration_days")

            if all([name, dep, dest, duration]):
                dup_qs = Tour.objects.filter(
                    agency=agency,
                    name__iexact=name,
                    departure_location__iexact=dep,
                    destination__iexact=dest,
                    duration_days=duration,
                )
                if self.instance and getattr(self.instance, "pk", None):
                    dup_qs = dup_qs.exclude(pk=self.instance.pk)

                if dup_qs.exists():
                    raise serializers.ValidationError({
                        "message": "Tour trùng (tên, nơi khởi hành, điểm đến, số ngày) đã tồn tại."
                    })
        return attrs



class TourListItemSerializer(serializers.ModelSerializer):
    categories = serializers.ListField(child=serializers.CharField(), read_only=True)
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = [
            "tour_id",
            "name",
            "categories",
            "description",
            "adult_price",
            "children_price",
            "discount",
            "duration_days",
            "departure_location",
            "destination",
            "rating",
            "reviews_count",
            "thumbnail_url",
            "is_active",
        ]

    def get_thumbnail_url(self, obj):
        thumb = getattr(obj, "thumbnail", None)
        if not thumb:
            return None
        return getattr(getattr(thumb, "thumbnail", None), "url", None)


class TourPublicListSerializer(serializers.ModelSerializer):
    categories = serializers.ListField(child=serializers.CharField(), read_only=True)
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = [
            "tour_id",
            "name",
            "categories",
            "description",
            "adult_price",
            "children_price",
            "discount",
            "duration_days",
            "departure_location",
            "destination",
            "rating",
            "reviews_count",
            "thumbnail_url",
            "is_active",  
        ]
        read_only_fields = fields

    def get_thumbnail_url(self, obj):
        thumb = getattr(obj, "thumbnail", None)
        if not thumb:
            return None
        return getattr(getattr(thumb, "thumbnail", None), "url", None)


class TourPublicDetailSerializer(serializers.ModelSerializer):
    agency_id = serializers.UUIDField(source="agency.agency_id", read_only=True)
    agency_name = serializers.CharField(source="agency.agency_name", read_only=True)
    email_agency = serializers.EmailField(source="agency.email_agency", read_only=True)
    hotline = serializers.CharField(source="agency.hotline", read_only=True)

    thumbnail_url = serializers.SerializerMethodField()
    image_urls = TourImageSerializer(source="images", many=True, read_only=True)

    final_adult_price = serializers.SerializerMethodField()
    final_children_price = serializers.SerializerMethodField()
    agency_user_id = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = [
            "tour_id",
            "agency_id", "agency_user_id", "agency_name", "email_agency", "hotline",
            "name", "description",
            "adult_price", "children_price", "discount",
            "final_adult_price", "final_children_price",
            "duration_days",
            "departure_location", "destination",
            "rating", "reviews_count",
            "region", "categories",
            "itinerary", "transportation",
            "services_included", "services_excluded", "policy",
            "is_active", "created_at", "updated_at",
            "thumbnail_url",
            "image_urls",
        ]
        read_only_fields = fields
    
    def get_thumbnail_url(self, obj):
        thumb = getattr(obj, "thumbnail", None)
        if not thumb:
            return None
        return getattr(getattr(thumb, "thumbnail", None), "url", None)

 
    # TÍNH GIÁ SAU GIẢM
    def get_final_adult_price(self, obj):
        if obj.discount:
            return float(obj.adult_price) * (100 - float(obj.discount)) / 100
        return float(obj.adult_price)

    def get_final_children_price(self, obj):
        if obj.discount:
            return float(obj.children_price) * (100 - float(obj.discount)) / 100
        return float(obj.children_price)

    def get_agency_user_id(self, obj):
        agency = getattr(obj, "agency", None)
        if not agency:
            return None
        user = getattr(agency, "user", None)
        if not user:
            return None
        return getattr(user, "user_id", getattr(user, "pk", None))



