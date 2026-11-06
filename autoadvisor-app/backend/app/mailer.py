import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email_alert(to_email: str, car_title: str, price):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "support.autoadvisor@gmail.com"
    sender_password = "hwvoinixgpisxqit"

    message = MIMEMultipart("alternative")
    message["Subject"] = f"Нове авто на продаж: {car_title}!"
    message["From"] = sender_email
    message["To"] = to_email

    text = f"Вітаємо! У базі з'явилося нове авто: {car_title} за ціною ${price}. Перевірте свій кабінет AutoAdvisor."
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2>Нова пропозиція на ринку!</h2>
        <p>Автомобіль: <b>{car_title}</b></p>
        <p>Ціна: <span style="color: #10b981; font-weight: bold;">${price}</span></p>
        <p>Завітайте на <a href="http://localhost:3000">AutoAdvisor</a>, щоб переглянути деталі.</p>
      </body>
    </html>
    """

    message.attach(MIMEText(text, "plain"))
    message.attach(MIMEText(html, "html"))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, message.as_string())
        server.quit()
        print(f"✅ Email успішно надіслано на {to_email}")
    except Exception as e:
        print(f"❌ Помилка відправки email на {to_email}: {e}")

# Окрема функція спеціально для відправки коду відновлення пароля
def send_reset_code_email(to_email: str, code: str):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "support.autoadvisor@gmail.com"
    sender_password = "hwvoinixgpisxqit"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Код підтвердження для відновлення пароля — AutoAdvisor"
    message["From"] = sender_email
    message["To"] = to_email

    text = f"Ваш код для відновлення пароля в системі AutoAdvisor: {code}. Донатимо на ЗСУ та рухаємося далі!"
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #f8fafc; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin-top: 0;">Відновлення пароля</h2>
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
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, message.as_string())
        server.quit()
        print(f"Код відновлення успішно надіслано на {to_email}")
    except Exception as e:
        print(f"Помилка надсилання коду на {to_email}: {e}")