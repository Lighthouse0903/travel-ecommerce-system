from django.db import models
import uuid

class Payment(models.Model):
    PENDING    = 'pending'
    PROCESSING = 'processing'
    SUCCESS    = 'success'
    FAILED     = 'failed'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (PROCESSING, 'Processing'),
        (SUCCESS, 'Success'),
        (FAILED, 'Failed'),
    ]

    payment_id   = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking      = models.OneToOneField('bookings.Booking', on_delete=models.CASCADE, related_name='payment')
    amount       = models.DecimalField(max_digits=12, decimal_places=2)
    provider     = models.CharField(max_length=50, default='sandbox')  # sau này: 'zalopay'
    provider_txn = models.CharField(max_length=100, blank=True, null=True)  # mã giao dịch cổng
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    paid_at      = models.DateTimeField(blank=True, null=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    extra_data = models.JSONField(blank=True, null=True)
    pay_url = models.URLField(max_length=500, blank=True, null=True)
    class Meta:
        db_table = 'payments_payment'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.payment_id} - {self.status}'

