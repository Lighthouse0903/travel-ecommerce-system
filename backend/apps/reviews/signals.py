# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review
import logging, traceback

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Review)
def recompute_tour_rating(sender, instance, **kwargs):
    try:
        tour = getattr(getattr(instance, "booking", None), "tour", None)
        if not tour:
            logger.info("recompute_tour_rating: NO TOUR for review %s", instance.pk)
            return

        agg = Review.objects.filter(booking__tour=tour).aggregate(
            avg_rating=Avg("rating"),
            total_reviews=Count("review_id")   # <— SỬA Ở ĐÂY
            # hoặc Count("pk") cũng được
        )

        logger.info("recompute_tour_rating AGG for tour %s: %s", tour.pk, agg)

        tour.rating = round(agg["avg_rating"] or 0.0, 2)
        tour.reviews_count = agg["total_reviews"] or 0
        tour.save(update_fields=["rating", "reviews_count"])

        logger.info("recompute_tour_rating DONE for tour %s", tour.pk)

    except Exception:
        logger.error("recompute_tour_rating failed:\n%s", traceback.format_exc())
