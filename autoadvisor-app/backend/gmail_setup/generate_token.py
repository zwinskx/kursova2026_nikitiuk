
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

folder = Path(__file__).resolve().parent
credentials_file = folder / "credentials.json"
token_file = folder / "token.json"

if not credentials_file.exists():
    raise FileNotFoundError("Не знайдено credentials.json")

flow = InstalledAppFlow.from_client_secrets_file(
    str(credentials_file),
    scopes=SCOPES
)

credentials = flow.run_local_server(
    host="localhost",
    port=0,
    access_type="offline",
    prompt="consent"
)

if not credentials.refresh_token:
    raise RuntimeError(
        "Google не повернув refresh token. "
        "Перевір дозволи й повтори OAuth-авторизацію."
    )

token_file.write_text(
    credentials.to_json(),
    encoding="utf-8"
)

print("Авторизація Gmail успішна!")
print("Токен збережено в gmail_setup/token.json")
