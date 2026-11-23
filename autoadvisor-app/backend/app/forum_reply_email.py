
import os
from html import escape
from urllib.parse import urlencode

from .brevo_api import send_brevo_message


def send_forum_reply_email(
    to_email: str,
    author_name: str,
    reply_text: str,
    parent_id: int
) -> bool:

    base_url = os.getenv(
        "PUBLIC_SITE_URL",
        "https://autoadvisor-sn.netlify.app"
    ).rstrip("/")

    query = urlencode({
        "tab": "reviews",
        "forum_message": parent_id
    })

    link = f"{base_url}/?{query}"

    safe_author = escape(author_name)
    safe_reply = escape(reply_text).replace("\n", "<br>")

    subject = "AutoAdvisor — вам відповіли у форумі"

    text = (
        f"Користувач {author_name} відповів на ваше повідомлення "
        f"у форумі AutoAdvisor.\n\n"
        f"Відповідь:\n{reply_text}\n\n"
        f"Переглянути форум: {link}"
    )

    html = f"""
    <html>
      <body style="font-family:Arial,sans-serif;
                   background:#f8fafc;padding:24px;">
        <div style="max-width:520px;margin:auto;
                    background:white;padding:30px;
                    border-radius:16px;">
          <h2 style="color:#059669;">
            Вам відповіли у форумі AutoAdvisor!
          </h2>

          <p>
            Користувач <b>{safe_author}</b>
            відповів на ваше повідомлення.
          </p>

          <p style="margin-top:25px;">
            Перейдіть на сайт, щоб прочитати відповідь
            та продовжити обговорення.
          </p>

          <a href="{link}"
             style="display:inline-block;background:#10b981;
                    color:white;padding:12px 20px;
                    border-radius:10px;text-decoration:none;">
            Відкрити AutoAdvisor
          </a>
        </div>
      </body>
    </html>
    """

    return send_brevo_message(
        to_email=to_email,
        subject=subject,
        text=text,
        html=html
    )
