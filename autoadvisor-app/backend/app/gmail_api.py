
import os
import base64
from email.message import EmailMessage

import requests
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request


GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.send"
GMAIL_SEND_URL = (
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
)


def send_gmail_message(
    to_email: str,
    subject: str,
    text: str,
    html: str
) -> bool:

    required = [
        "GMAIL_CLIENT_ID",
        "GMAIL_CLIENT_SECRET",
        "GMAIL_REFRESH_TOKEN",
        "GMAIL_SENDER_EMAIL"
    ]

    missing = [name for name in required if not os.getenv(name)]

    if missing:
        raise RuntimeError(
            "Не налаштовані змінні Gmail: " + ", ".join(missing)
        )

    credentials = Credentials(
        token=None,
        refresh_token=os.environ["GMAIL_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ["GMAIL_CLIENT_ID"],
        client_secret=os.environ["GMAIL_CLIENT_SECRET"],
        scopes=[GMAIL_SCOPE]
    )

    credentials.refresh(Request())

    email = EmailMessage()
    email["From"] = os.environ["GMAIL_SENDER_EMAIL"]
    email["To"] = to_email
    email["Subject"] = subject

    email.set_content(text)
    email.add_alternative(html, subtype="html")

    encoded = base64.urlsafe_b64encode(
        email.as_bytes()
    ).decode("utf-8")

    response = requests.post(
        GMAIL_SEND_URL,
        headers={
            "Authorization": f"Bearer {credentials.token}",
            "Content-Type": "application/json"
        },
        json={"raw": encoded},
        timeout=30
    )

    response.raise_for_status()
    return True
