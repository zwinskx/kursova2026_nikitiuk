import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Налаштування SMTP (Gmail)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "support.autoadvisor@gmail.com"
SENDER_PASSWORD = "hwvoinixgpisxqit"

# 1. Лист про нове надходження в каталозі
def send_email_alert(to_email: str, car_title: str, price):
    message = MIMEMultipart("alternative")
    message["Subject"] = f"🔥 Нове надходження на ринку: {car_title}!"
    message["From"] = SENDER_EMAIL
    message["To"] = to_email

    text = f"Вітаємо! У базі AutoAdvisor з'явилося нове авто: {car_title} за ціною ${price}. Перевірте свій кабінет."
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #f0fdf4; padding: 30px; border-radius: 16px; border: 1px solid #bbf7d0;">
          <h2 style="color: #065f46; margin-top: 0;">🚗 Нова пропозиція в каталозі!</h2>
          <p style="color: #1f2937; font-size: 14px;">До вашої уваги щойно додано новий автомобіль:</p>
          <p style="font-size: 16px;"><b>{car_title}</b></p>
          <p style="font-size: 18px;">Ціна: <span style="color: #10b981; font-weight: bold;">${price}</span></p>
          <hr style="border: none; border-top: 1px solid #bbf7d0; margin: 20px 0;">
          <p style="color: #4b5563; font-size: 12px;">Завітайте на <a href="http://localhost:3000" style="color: #10b981; font-weight: bold;">AutoAdvisor</a>, щоб переглянути характеристики та забронювати тест-драйв.</p>
        </div>
      </body>
    </html>
    """

    message.attach(MIMEText(text, "plain"))
    message.attach(MIMEText(html, "html"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, message.as_string())
        server.quit()
        print(f"Email про нове авто успішно надіслано на {to_email}")
    except Exception as e:
        print(f"Помилка відправки email на {to_email}: {e}")


# 2. Окрема функція спеціально для відправки коду відновлення пароля
def send_reset_code_email(to_email: str, title: str, code: str):
    message = MIMEMultipart("alternative")
    message["Subject"] = "🔐 Код підтвердження для відновлення пароля — AutoAdvisor"
    message["From"] = SENDER_EMAIL
    message["To"] = to_email

    text = f"Ваш код для відновлення пароля в системі AutoAdvisor: {code}. Донатимо на ЗСУ та рухаємося далі!"
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #f8fafc; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin-top: 0;">🔒 Відновлення пароля</h2>
          <p style="color: #475569; font-size: 14px;">Ви запросили зміну пароля для свого акаунта в <b>AutoAdvisor</b>.</p>
          <p style="color: #475569; font-size: 14px;">Ваш секретний код підтвердження:</p>
          <div style="background: #10b981; color: white; font-size: 28px; font-weight: bold; text-align: center; padding: 15px; border-radius: 12px; letter-spacing: 4px; margin: 20px 0;">
            {code}
          </div>
          <p style="color: #94a3b8; font-size: 12px;">Якщо ви не запитували відновлення пароля, просто проігноруйте цей лист.</p>
        </div>
      </body>
    </html>
    """

    message.attach(MIMEText(text, "plain"))
    message.attach(MIMEText(html, "html"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, message.as_string())
        server.quit()
        print(f"Код відновлення успішно надіслано на {to_email}")
    except Exception as e:
        print(f"Помилка надсилання коду на {to_email}: {e}")