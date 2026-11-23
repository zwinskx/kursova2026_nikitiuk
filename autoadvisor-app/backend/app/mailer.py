
import os
from html import escape

from dotenv import load_dotenv
from .brevo_api import send_brevo_message

load_dotenv()

PUBLIC_SITE_URL = os.getenv(
    "PUBLIC_SITE_URL",
    "https://autoadvisor-sn.netlify.app"
).rstrip("/")


def _send_message(
    to_email: str,
    subject: str,
    text: str,
    html: str
):
    if not to_email or not to_email.strip():
        raise ValueError("Не вказано адресу одержувача.")

    return send_brevo_message(
        to_email=to_email.strip(),
        subject=subject,
        text=text,
        html=html
    )


def send_email_alert(
    to_email: str,
    car_title: str,
    price
):
    subject = f"🚗 Нове надходження на ринку: {car_title}!"

    text = (
        f"Вітаємо!\n\n"
        f"У базі AutoAdvisor з'явилося нове авто:\n"
        f"{car_title}\n"
        f"Ціна: ${price}\n\n"
        f"Перейдіть на сайт, щоб переглянути автомобіль:\n"
        f"{PUBLIC_SITE_URL}"
    )

    safe_title = escape(str(car_title))
    safe_price = escape(str(price))
    safe_url = escape(PUBLIC_SITE_URL, quote=True)

    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif;
                   color: #333;
                   padding: 20px;
                   background-color: #f8fafc;">

        <div style="max-width: 500px;
                    margin: auto;
                    background: #f0fdf4;
                    padding: 30px;
                    border-radius: 16px;
                    border: 1px solid #bbf7d0;">

          <h2 style="color: #065f46; margin-top: 0;">
            🚗 Нова пропозиція в каталозі!
          </h2>

          <p style="color: #1f2937; font-size: 14px;">
            До вашої уваги щойно додано новий автомобіль:
          </p>

          <p style="font-size: 16px;">
            <b>{safe_title}</b>
          </p>

          <p style="font-size: 18px;">
            Ціна:
            <span style="color: #10b981; font-weight: bold;">
              ${safe_price}
            </span>
          </p>

          <hr style="border: none;
                     border-top: 1px solid #bbf7d0;
                     margin: 20px 0;">

          <p style="color: #4b5563; font-size: 12px;">
            Завітайте на
            <a href="{safe_url}"
               style="color: #10b981; font-weight: bold;">
              AutoAdvisor
            </a>,
            щоб переглянути характеристики автомобіля.
          </p>

        </div>
      </body>
    </html>
    """

    try:
        result = _send_message(
            to_email=to_email,
            subject=subject,
            text=text,
            html=html
        )

        print(
            f"Email про нове авто успішно надіслано на {to_email}"
        )

        return result

    except Exception as error:
        print(
            f"Помилка відправки email на {to_email}: "
            f"{type(error).__name__}: {error}"
        )
        return False


def send_reset_code_email(
    to_email: str,
    title: str,
    code: str
):
    subject = (
        "🔐 Код підтвердження для відновлення пароля — AutoAdvisor"
    )

    text = (
        f"Вітаємо!\n\n"
        f"Ви запросили відновлення пароля в AutoAdvisor.\n\n"
        f"Ваш код підтвердження: {code}\n\n"
        f"Якщо ви не запитували відновлення пароля, "
        f"проігноруйте цей лист."
    )

    safe_code = escape(str(code))

    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif;
                   color: #333;
                   padding: 20px;
                   background-color: #f8fafc;">

        <div style="max-width: 500px;
                    margin: auto;
                    background: #f8fafc;
                    padding: 30px;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;">

          <h2 style="color: #0f172a; margin-top: 0;">
            🔒 Відновлення пароля
          </h2>

          <p style="color: #475569; font-size: 14px;">
            Ви запросили зміну пароля для свого
            акаунта в <b>AutoAdvisor</b>.
          </p>

          <p style="color: #475569; font-size: 14px;">
            Ваш секретний код підтвердження:
          </p>

          <div style="background: #10b981;
                      color: white;
                      font-size: 28px;
                      font-weight: bold;
                      text-align: center;
                      padding: 15px;
                      border-radius: 12px;
                      letter-spacing: 4px;
                      margin: 20px 0;">

            {safe_code}

          </div>

          <p style="color: #94a3b8; font-size: 12px;">
            Якщо ви не запитували відновлення пароля,
            просто проігноруйте цей лист.
          </p>

        </div>
      </body>
    </html>
    """

    # Винятки не приховуємо: API повинен знати, якщо лист не надісланий.
    return _send_message(
        to_email=to_email,
        subject=subject,
        text=text,
        html=html
    )
