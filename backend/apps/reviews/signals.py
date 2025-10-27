from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg
from .models import Review

@receiver([post_save, post_delete], sender=Review)
def recompute_tour_rating(sender, instance, **kwargs):
    tour = instance.booking.tour
    avg = Review.objects.filter(booking__tour=tour).aggregate(a=Avg('rating'))['a'] or 0
    tour.rating = round(avg, 2)
    tour.save(update_fields=['rating'])
