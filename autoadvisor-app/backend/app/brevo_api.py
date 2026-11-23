"""Brevo transactional email API for AutoAdvisor (HTTPS, no SMTP/OAuth)."""
import os
import requests

BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email"


def send_brevo_message(to_email: str, subject: str, text: str, html: str) -> bool:
    api_key = os.getenv("BREVO_API_KEY", "").strip()
    sender = os.getenv("BREVO_SENDER_EMAIL", "").strip()
    sender_name = os.getenv("BREVO_SENDER_NAME", "AutoAdvisor").strip() or "AutoAdvisor"

    missing = []
    if not api_key:
        missing.append("BREVO_API_KEY")
    if not sender:
        missing.append("BREVO_SENDER_EMAIL")
    if missing:
        raise RuntimeError("Не налаштовані змінні Brevo: " + ", ".join(missing))
    if not to_email or not to_email.strip():
        raise ValueError("Не вказано email одержувача")

    payload = {
        "sender": {"name": sender_name, "email": sender},
        "to": [{"email": to_email.strip()}],
        "subject": subject,
        # Brevo accepts one email content type in a request.
        "htmlContent": html or f"<pre>{text}</pre>",
    }

    try:
        response = requests.post(
            BREVO_ENDPOINT,
            headers={
                "accept": "application/json",
                "api-key": api_key,
                "content-type": "application/json",
            },
            json=payload,
            timeout=25,
        )
    except requests.RequestException as exc:
        raise RuntimeError("Не вдалося підключитися до Brevo API") from exc

    if response.status_code != 201:
        try:
            err = response.json()
            detail = str(err.get("message", ""))[:240] if isinstance(err, dict) else ""
        except (ValueError, TypeError, AttributeError):
            detail = ""
        raise RuntimeError(
            f"Brevo API повернув HTTP {response.status_code}"
            + (f": {detail}" if detail else "")
        )

    try:
        message_id = response.json().get("messageId")
    except (ValueError, AttributeError, TypeError):
        message_id = None
    if not message_id:
        raise RuntimeError("Brevo API не повернув messageId")
    # Accepted by Brevo; actual mailbox delivery must be checked in Brevo Logs.
    return True
