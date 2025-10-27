from django.db import models
from django.conf import settings
import uuid

class Agency(models.Model):
    agency_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='agency_profile'
    )
    company_name = models.CharField(max_length=255)
    license_number = models.CharField(max_length=100, unique=True)
    hotline = models.CharField(max_length=20, blank=True, null=True)
    email_agency = models.EmailField(blank=True, null=True)
    address_agency = models.CharField(max_length=255, blank=True, null=True)
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    verified = models.BooleanField(default=False)
    reason_rejected = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'agencies_agency'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.company_name} (Owner: {self.user.username})"
