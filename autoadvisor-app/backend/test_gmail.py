
from dotenv import load_dotenv

load_dotenv()

from app.gmail_api import send_gmail_message


recipient = input("Введи email для тесту: ").strip()

result = send_gmail_message(
    to_email=recipient,
    subject="Тест AutoAdvisor",
    text="Привіт! Це тестове повідомлення AutoAdvisor.",
    html="""
    <h2>AutoAdvisor</h2>
    <p>Надсилання через Gmail API працює!</p>
    """
)

print("Лист передано Gmail API:", result)
