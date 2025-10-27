from django.db import models
from django.conf import settings
import uuid

class Customer(models.Model):
    customer_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customer'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Customer({self.user.username})"