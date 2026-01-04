from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model

User = get_user_model()

class UpdateLastSeenMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            User.objects.filter(pk=user.pk).update(last_seen=timezone.now())
        return None
