from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.indexes import GinIndex
from django.db.models import Q, CheckConstraint, UniqueConstraint
import uuid
import os


class Tour(models.Model):
    tour_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    agency = models.ForeignKey(
        'agencies.Agency',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='tours'
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")  # tránh null cho FE

    # Locations 
    departure_location = models.CharField(max_length=255)   # nơi khởi hành
    destination = models.CharField(max_length=255)          # điểm đến

    # Giá
    adult_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=0
    )
    children_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=0
    )
    discount = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        blank=True,
        null=True,
        help_text="Giảm giá theo phần trăm (%)"
    )

    duration_days = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])

    # Rating 
    rating = models.DecimalField(
        max_digits=3, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        default=0
    )
    reviews_count = models.PositiveIntegerField(default=0)

    # Region
    NORTH, CENTRAL, SOUTH = 1, 2, 3
    REGION_CHOICES = [
        (NORTH, 'Miền Bắc'),
        (CENTRAL, 'Miền Trung'),
        (SOUTH, 'Miền Nam'),
    ]
    region = models.IntegerField(choices=REGION_CHOICES)

    # Categories
    CATEGORY_CHOICES = [
        ('sea', 'Biển'), ('mountain', 'Núi'),
        ('resort', 'Nghỉ dưỡng'), ('adventure', 'Khám phá'),
        ('cultural', 'Văn hoá'), ('history', 'Lịch sử'),
    ]
    categories = ArrayField(
        models.CharField(max_length=30, choices=CATEGORY_CHOICES),
        default=list,
        blank=True
    )

    # Content 
    itinerary = models.JSONField(default=list, blank=True)
    transportation = models.JSONField(default=list, blank=True)
    services_included = models.JSONField(default=list, blank=True)
    services_excluded = models.JSONField(default=list, blank=True)
    policy = models.JSONField(default=dict, blank=True)

    # Visibility 
    is_active = models.BooleanField(default=True)  # true: public/đặt được; false: pause/ẩn

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tours_tour'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['departure_location']),
            models.Index(fields=['destination']),
            models.Index(fields=['adult_price']),
            models.Index(fields=['children_price']),
            models.Index(fields=['region']),
            models.Index(fields=['created_at']),
            GinIndex(name='tour_categories_gin', fields=['categories']),
        ]
        constraints = [
            # Discount must be null or between 0 and 100
            CheckConstraint(
                check=Q(discount__isnull=True) | (Q(discount__gte=0) & Q(discount__lte=100)),
                name='discount_between_0_100'
            ),
            # Chặn duplicate tour theo agency + name + departure + destination + duration_days
    
            UniqueConstraint(
                fields=['agency', 'name', 'departure_location', 'destination', 'duration_days'],
                name='uniq_tour_agency_name_depart_dest_days',
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.duration_days}d)"


# ===== Thumbnail (ảnh chính) =====

def tour_thumbnail_upload_to(instance, filename):
    tour_id = getattr(instance.tour, "tour_id", "unknown")
    base, ext = os.path.splitext(filename)
    unique_name = f"{uuid.uuid4().hex}{ext.lower()}"
    return f"tours/{tour_id}/thumbnail/{unique_name}"


class TourThumbnail(models.Model):
    # primary_key=True để không tạo id thừa (optional nhưng gọn)
    tour = models.OneToOneField(
        Tour,
        on_delete=models.CASCADE,
        related_name='thumbnail',
        primary_key=True
    )
    thumbnail = models.ImageField(upload_to=tour_thumbnail_upload_to)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tours_tour_thumbnail'

    def __str__(self):
        return f"Thumbnail for {self.tour_id}"


# ===== Gallery (ảnh con) =====

def tour_image_upload_to(instance, filename):
    tour_id = getattr(instance.tour, "tour_id", "unknown")
    base, ext = os.path.splitext(filename)
    unique_name = f"{uuid.uuid4().hex}{ext.lower()}"
    return f"tours/{tour_id}/images/{unique_name}"


class TourImage(models.Model):
    img_id = models.BigAutoField(primary_key=True)
    tour = models.ForeignKey(
        Tour,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to=tour_image_upload_to)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tours_tour_image'
        ordering = ['-created_at']

    def __str__(self):
        return f"Image {self.img_id} for {self.tour.tour_id}"
