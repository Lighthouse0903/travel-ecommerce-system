import uuid, hmac, hashlib, json, requests
from django.conf import settings
from decimal import Decimal

def create_momo_payment(amount, order_info="Payment with MoMo"):
    endpoint = settings.MOMO_API_ENDPOINT
    partner_code = settings.MOMO_PARTNER_CODE
    access_key = settings.MOMO_ACCESS_KEY
    secret_key = settings.MOMO_SECRET_KEY
    redirect_url = settings.MOMO_REDIRECT_URL
    ipn_url = settings.MOMO_IPN_URL
    request_type = "captureWallet"
    amount_str = str(int(Decimal(str(amount))))

    order_id = str(uuid.uuid4())
    request_id = str(uuid.uuid4())
    extra_data = ""

    raw_signature = (
        f"accessKey={access_key}&amount={amount_str}&extraData={extra_data}"
        f"&ipnUrl={ipn_url}&orderId={order_id}&orderInfo={order_info}"
        f"&partnerCode={partner_code}&redirectUrl={redirect_url}"
        f"&requestId={request_id}&requestType={request_type}"
    )
    signature = hmac.new(
        secret_key.encode("utf-8"),
        raw_signature.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    payload = {
        "partnerCode": partner_code,
        "partnerName": "MoMo Payment",
        "storeId": "MoMoTestStore",
        "requestId": request_id,
        "amount": amount_str,
        "orderId": order_id,
        "orderInfo": order_info,
        "redirectUrl": redirect_url,
        "ipnUrl": ipn_url,
        "lang": "vi",
        "extraData": extra_data,
        "requestType": request_type,
        "signature": signature,
    }

    print("✅ Payload gửi đến MoMo:", json.dumps(payload, indent=2, ensure_ascii=False))
    resp = requests.post(endpoint, json=payload, timeout=10)
    print("✅ Kết quả MoMo trả về:", resp.status_code, resp.text)
    return resp.json()