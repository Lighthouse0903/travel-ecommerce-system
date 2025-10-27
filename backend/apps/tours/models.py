from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.postgres.fields import ArrayField
from django.conf import settings
import uuid

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
    duration_days = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])  # số ngày

    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)

    rating = models.DecimalField(
        max_digits=3, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        default=0
    )
    NORTH = 1
    CENTRAL = 2
    SOUTH = 3
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
            models.Index(fields=['categories'])
        ]

    def __str__(self):
        return f"{self.name} ({self.duration_days}d)"
