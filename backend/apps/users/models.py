from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

def default_customer_role():
    return [User.CUSTOMER]
class User(AbstractUser):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    last_seen = models.DateTimeField(blank=True, null=True) 
    
    CUSTOMER = 1
    PROVIDER = 2
    ADMIN = 3
    ROLE_CHOICES = [
        (CUSTOMER, 'Customer'),
        (PROVIDER, 'Service Provider'),
        (ADMIN, 'Admin'),
    ]

    roles = ArrayField(
        base_field=models.IntegerField(choices=ROLE_CHOICES),
        default=default_customer_role,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.roles})"
