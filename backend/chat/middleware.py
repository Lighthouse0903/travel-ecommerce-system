from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist


@database_sync_to_async
def get_user_from_token(token: str):
    from rest_framework_simplejwt.tokens import AccessToken

    try:
        access = AccessToken(token)
        claim_key = settings.SIMPLE_JWT.get("USER_ID_CLAIM", "user_id")
        user_id = access.get(claim_key)
        if not user_id:
            return None

        User = get_user_model()
        return User.objects.get(user_id=user_id)
    except ObjectDoesNotExist:
        return None
    except Exception:
        return None


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token_list = params.get("token", [])

        # default: anonymous
        scope["user"] = None

        if token_list:
            token = token_list[0]
            user = await get_user_from_token(token)
            if user is not None:
                scope["user"] = user

        return await super().__call__(scope, receive, send)


def JWTAuthMiddlewareStack(inner):
    # bọc AuthMiddlewareStack để scope chuẩn, rồi JWT override user
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
