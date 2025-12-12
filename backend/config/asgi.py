import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

# 1) SET DJANGO_SETTINGS_MODULE TRƯỚC
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# 2) KHỞI TẠO ỨNG DỤNG DJANGO (setup settings, apps, models, ...)
django_asgi_app = get_asgi_application()

# 3) SAU ĐÓ MỚI IMPORT CÁC THỨ LIÊN QUAN TỚI MODEL (chat.middleware, chat.routing)
from chat.middleware import JWTAuthMiddlewareStack
from chat import routing as chat_routing


# 4) CUỐI CÙNG TẠO application CHO ASGI
application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": JWTAuthMiddlewareStack(
            URLRouter(
                chat_routing.websocket_urlpatterns
            )
        ),
    }
)
