from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Customer

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_customer_on_user_create(sender, instance, created, **kwargs):
    if created:
        Customer.objects.get_or_create(user=instance)
    else:
        roles = getattr(instance, 'roles', []) or []
        if hasattr(instance, 'CUSTOMER') and instance.CUSTOMER in roles:
            Customer.objects.get_or_create(user=instance)
