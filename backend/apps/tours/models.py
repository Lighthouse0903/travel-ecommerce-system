from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.indexes import GinIndex
import uuid, os
from django.db.models import Q, CheckConstraint, F
class Tour(models.Model):
    tour_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    agency = models.ForeignKey(
        'agencies.Agency',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='tours'
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    duration_days = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])

    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    destination = models.CharField(max_length=255, blank=True, null=True)

    rating = models.DecimalField(
        max_digits=3, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        default=0
    )
    reviews_count = models.PositiveIntegerField(default=0)
    NORTH, CENTRAL, SOUTH = 1, 2, 3
    REGION_CHOICES = [
        (NORTH, 'Miền Bắc'),
        (CENTRAL, 'Miền Trung'),
        (SOUTH, 'Miền Nam'),
    ]
    CATEGORY_CHOICES = [
        ('sea', 'Biển'), ('mountain', 'Núi'),
        ('resort', 'Nghỉ dưỡng'), ('adventure', 'Khám phá'),
        ('cultural', 'Văn hoá'), ('history', 'Lịch sử'),
    ]
    region = models.IntegerField(choices=REGION_CHOICES, blank=False, null=False)
    categories = ArrayField(models.CharField(max_length=30, choices=CATEGORY_CHOICES), default=list, blank=True)

    pickup_points = models.JSONField(default=list, blank=True)
    itinerary = models.JSONField(default=list, blank=True)
    transportation = models.JSONField(default=list, blank=True)
    services_included = models.JSONField(default=list, blank=True)
    services_excluded = models.JSONField(default=list, blank=True)
    policy = models.JSONField(default=dict, blank=True)
    guide = models.JSONField(default=dict, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tours_tour'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['price']),
            models.Index(fields=['region']),
            models.Index(fields=['created_at']),
            GinIndex(name='tour_categories_gin', fields=['categories']),
            GinIndex(name='tour_itinerary_gin', fields=['itinerary']),
            GinIndex(name='tour_policy_gin', fields=['policy']),
        ]
        constraints = [
            CheckConstraint(
                check=Q(discount_price__isnull=True) | Q(discount_price__lte=F('price')),
                name='discount_lte_price'
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.duration_days}d)"



def tour_image_upload_to(instance, filename):
    tour_id = getattr(instance.tour, "tour_id", "unknown")
    base, ext = os.path.splitext(filename)
    unique_name = f"{base}_{uuid.uuid4().hex}{ext}"
    return f"tours/{tour_id}/{unique_name}"



class TourImage(models.Model):
    img_id = models.BigAutoField(primary_key=True)
    tour = models.ForeignKey(
        Tour, on_delete=models.CASCADE, related_name='images'
    )
    image = models.ImageField(upload_to=tour_image_upload_to)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tours_tour_image'
        ordering = ['-created_at']