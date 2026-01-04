import requests
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(["POST"])
@permission_classes([AllowAny])
def chatbot_proxy(request):
    message = (request.data.get("message") or "").strip()
    if not message:
        return Response({"message": "Thiếu message"}, status=400)

    try:
        r = requests.post(
            f"{settings.CHATBOT_API_URL}/chat",
            json={"message": message},
            timeout=getattr(settings, "CHATBOT_TIMEOUT", 120),
        )
        return Response(r.json(), status=r.status_code)
    except requests.Timeout:
        return Response({"message": "Chatbot service timeout"}, status=504)
    except Exception as e:
        return Response({"message": "Không gọi được chatbot service", "detail": str(e)}, status=502)