import json
import logging
import os
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

logger = logging.getLogger(__name__)


def send_forum_reply_email(to_email: str, reply_author: str, message_preview: str):
    """Send through Resend HTTPS API, suitable for Render Free. Never leak recipient or secrets in logs."""
    api_key = os.getenv('RESEND_API_KEY')
    from_email = os.getenv('RESEND_FROM_EMAIL')
    if not api_key or not from_email:
        logger.warning('Forum reply email skipped: RESEND_API_KEY or RESEND_FROM_EMAIL missing')
        return

    site = os.getenv('PUBLIC_SITE_URL', 'https://autoadvisor-sn.netlify.app').rstrip('/')
    # Avoid putting HTML from user-generated messages into email.
    author = reply_author.replace('\r', ' ').replace('\n', ' ')[:100]
    preview = message_preview.replace('\r', ' ').replace('\n', ' ')[:350]
    payload = json.dumps({
        'from': from_email,
        'to': [to_email],
        'subject': 'Вам відповіли на повідомлення у форумі AutoAdvisor',
        'text': (
            'Вітаємо! На ваше повідомлення у форумі AutoAdvisor відповів '
            f'{author}.\n\nВідповідь: {preview}\n\n'
            f'Відкрийте AutoAdvisor та перейдіть у розділ «Відгуки / Форум»: {site}\n\n'
            'Якщо ви не бажаєте отримувати сповіщення, вимкніть email-сповіщення в налаштуваннях акаунта.'
        )
    }, ensure_ascii=False).encode('utf-8')

    request = Request(
        'https://api.resend.com/emails',
        data=payload,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )
    try:
        with urlopen(request, timeout=12) as response:
            if response.status not in (200, 201, 202):
                logger.warning('Forum reply email unexpected HTTP status: %s', response.status)
    except (HTTPError, URLError, TimeoutError, OSError) as exc:
        logger.error('Forum reply email delivery failed: %s', type(exc).__name__)
