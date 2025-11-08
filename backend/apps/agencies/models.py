from django.db import models
from django.conf import settings
import uuid, os
from django.core.exceptions import ValidationError

def validate_avatar(file):
    if file.size > 2*1024*1024:
        raise ValidationError("Avatar tối đa 2MB.")
    if os.path.splitext(file.name)[1].lower() not in [".jpg", ".jpeg", ".png", ".webp"]:
        raise ValidationError("Avatar phải là ảnh (jpg, png, webp).")

def validate_license(file):
    if file.size > 10*1024*1024:
        raise ValidationError("License tối đa 10MB.")
    if os.path.splitext(file.name)[1].lower() not in [".pdf", ".jpg", ".jpeg", ".png"]:
        raise ValidationError("License chỉ nhận pdf/jpg/png.")

def agency_license_upload_to(instance, filename):
    base, ext = os.path.splitext(filename)
    return f"agencies/{instance.agency_id}/license/{base}_{uuid.uuid4().hex}{ext}"

def agency_avatar_upload_to(instance, filename):
    base, ext = os.path.splitext(filename)
    return f"agencies/{instance.agency_id}/avatar/{base}_{uuid.uuid4().hex}{ext}"

class Agency(models.Model):
    agency_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='agency_profile'
    )
    agency_name = models.CharField(max_length=255)
    license_number = models.CharField(max_length=100, unique=True)
    hotline = models.CharField(max_length=20, blank=True, null=True)
    email_agency = models.EmailField(blank=True, null=True)
    address_agency = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    license_file = models.FileField(upload_to=agency_license_upload_to, blank=True, null=True, validators=[validate_license])
    avatar = models.ImageField(upload_to=agency_avatar_upload_to, blank=True, null=True, validators=[validate_avatar])

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
