# # signals.py
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.db.models import Avg, Count
# from .models import Review
# import logging, traceback

# logger = logging.getLogger(__name__)

# @receiver(post_save, sender=Review)
# def recompute_tour_rating(sender, instance, **kwargs):
#     try:
#         tour = getattr(getattr(instance, "booking", None), "tour", None)
#         if not tour:
#             logger.info("recompute_tour_rating: NO TOUR for review %s", instance.pk)
#             return

#         agg = Review.objects.filter(booking__tour=tour).aggregate(
#             avg_rating=Avg("rating"),
#             total_reviews=Count("review_id")   # <— SỬA Ở ĐÂY
#             # hoặc Count("pk") cũng được
#         )

#         logger.info("recompute_tour_rating AGG for tour %s: %s", tour.pk, agg)

#         tour.rating = round(agg["avg_rating"] or 0.0, 2)
#         tour.reviews_count = agg["total_reviews"] or 0
#         tour.save(update_fields=["rating", "reviews_count"])

#         logger.info("recompute_tour_rating DONE for tour %s", tour.pk)

#     except Exception:
#         logger.error("recompute_tour_rating failed:\n%s", traceback.format_exc())


# reviews/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review
import logging
import traceback

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Review)
def recompute_tour_rating(sender, instance, **kwargs):
    """
    Recompute rating & reviews_count cho Tour
    - Chỉ tính review CHƯA bị xoá (is_deleted=False)
    - Áp dụng cho: tạo review, sửa review, soft delete review
    """
    try:
        # Lấy tour từ booking
        booking = getattr(instance, "booking", None)
        tour = getattr(booking, "tour", None)

        if not tour:
            logger.warning(
                "recompute_tour_rating: Review %s không có tour liên kết",
                instance.review_id
            )
            return

        # Aggregate lại rating & count (CHỈ review chưa bị xoá)
        agg = Review.objects.filter(
            booking__tour=tour,
            is_deleted=False
        ).aggregate(
            avg_rating=Avg("rating"),
            total_reviews=Count("review_id")
        )

        avg_rating = agg.get("avg_rating") or 0.0
        total_reviews = agg.get("total_reviews") or 0

        # Update tour
        tour.rating = round(avg_rating, 2)
        tour.reviews_count = total_reviews
        tour.save(update_fields=["rating", "reviews_count"])

        logger.info(
            "recompute_tour_rating DONE | tour=%s | rating=%s | reviews=%s",
            tour.tour_id,
            tour.rating,
            tour.reviews_count
        )

    except Exception:
        logger.error(
            "recompute_tour_rating FAILED:\n%s",
            traceback.format_exc()
        )
