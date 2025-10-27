from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid

class Booking(models.Model):
    PENDING   = 'pending'
    CONFIRMED = 'confirmed'
    CANCELLED = 'cancelled'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (CONFIRMED, 'Confirmed'),
        (CANCELLED, 'Cancelled'),
    ]

    booking_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    customer = models.ForeignKey(
        'customers.Customer', on_delete=models.CASCADE, related_name='bookings'
    )
    tour = models.ForeignKey(
        'tours.Tour', on_delete=models.CASCADE, related_name='bookings'
    )

    booking_date = models.DateTimeField(auto_now_add=True)
    travel_date  = models.DateField()

    num_people  = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    total_price = models.DecimalField(
        max_digits=12, decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        editable=False
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        db_table  = 'bookings_booking'
        ordering  = ['-booking_date']
        indexes = [
            models.Index(fields=['customer']),
            models.Index(fields=['tour']),
            models.Index(fields=['status']),
            models.Index(fields=['travel_date']),
        ]

    def __str__(self):
        return f'{self.booking_id} | {self.customer.user.username} -> {self.tour.name}'

    def save(self, *args, **kwargs):
        if self.tour_id and self.num_people:
            self.total_price = (self.tour.price or Decimal('0')) * Decimal(self.num_people)
        super().save(*args, **kwargs)
