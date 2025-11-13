# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review

@receiver(post_save, sender=Review)
def recompute_tour_rating(sender, instance, **kwargs):
    tour = getattr(getattr(instance, "booking", None), "tour", None)
    if not tour:   # an toàn nếu booking/tour null
        return

    agg = Review.objects.filter(booking__tour=tour).aggregate(
        avg_rating=Avg("rating"),
        total_reviews=Count("id")
    )
    tour.rating = round(agg["avg_rating"] or 0.0, 2)
    tour.reviews_count = agg["total_reviews"] or 0
    tour.save(update_fields=["rating", "reviews_count"])
