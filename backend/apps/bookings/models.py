from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid


class Booking(models.Model):
    PENDING        = 'pending'  # khách gửi yêu cầu, chờ agency xác nhận đơn
    PAID_WAITING   = 'paid_waiting' # agency duyệt, chờ khách thanh toán
    PAID = "paid"                       # thanh toán thành công  -> paid
    REJECTED = "rejected"               # agency từ chối hoặc thanh toán thất bại

    STATUS_CHOICES = [
        (PENDING, 'Chờ đại lý xác nhận'),
        (PAID_WAITING, 'Chờ thanh toán'),
        (PAID, "Đã thanh toán"),
        (REJECTED, "Từ chối / Hủy"),
    ]

    booking_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    customer = models.ForeignKey(
        'customers.Customer',
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    tour = models.ForeignKey(
        'tours.Tour',
        on_delete=models.CASCADE,
        related_name='bookings'
    )

    # Thời gian booking đươc tạo
    booking_date = models.DateTimeField(auto_now_add=True)

    # Thông tin đặt tourr
    travel_date = models.DateField()
    num_adults = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    num_children = models.PositiveIntegerField(default=0)
    note= models.TextField(blank=True, null=True)

    total_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        editable=False,
        default=Decimal("0"),
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    
    # timestamps phục vụ tracking/thống kê
    approved_at = models.DateTimeField(null=True, blank=True)  # khi chuyển sang paid_waiting
    paid_at = models.DateTimeField(null=True, blank=True)      # momo success
    rejected_at = models.DateTimeField(null=True, blank=True)  # khi từ chối/huỷ

     # (tuỳ chọn) lý do từ chối để hiển thị cho khách
    rejected_reason = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'bookings_booking'
        ordering = ['-booking_date']
        indexes = [
            models.Index(fields=['customer']),
            models.Index(fields=['tour']),
            models.Index(fields=['status']),
            models.Index(fields=['travel_date']),
            models.Index(fields=["booking_date"]),
        ]

    def __str__(self):
        return f'{self.booking_id} | {self.customer.user.username} -> {self.tour.name}'

    # def save(self, *args, **kwargs):
    #     if self.tour_id:
    #         adults = self.num_adults or 0
    #         children = self.num_children or 0

    #         adult_price = self.tour.adult_price or Decimal("0")
    #         children_price = self.tour.children_price or Decimal("0")

    #         self.total_price = (
    #             adult_price * Decimal(adults)
    #             + children_price * Decimal(children)
    #         )

    #     super().save(*args, **kwargs)
