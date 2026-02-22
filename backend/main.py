from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import resend

# ===============================
# LOAD ENV VARIABLES
# ===============================
load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")

# ===============================
# FASTAPI APP
# ===============================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://herobala.github.io",
        "https://herobala.github.io/HeroMove-CZ",
        "https://heromove-cz.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# INIT RESEND
resend.api_key = RESEND_API_KEY

# ===============================
# ROOT + HEALTH
# ===============================
@app.get("/")
def root():
    return {"message": "HeroMove backend running 🚀"}

@app.get("/health")
def health():
    return {"status": "ok"}

# ===============================
# FORMAT LABEL
# ===============================
def format_label(key: str):
    label = key.replace("_", " ")
    new_label = ""

    for char in label:
        if char.isupper():
            new_label += " " + char
        else:
            new_label += char

    return new_label.strip().title()

# ===============================
# SEND BOOKING
# ===============================
@app.post("/send-booking")
async def send_booking(request: Request):

    try:
        form = await request.form()
        data = {}

        for key, value in form.items():
            data[key] = value

        print("📩 RECEIVED DATA:", data)

        service = data.get("service", "HeroMove Booking")

        html_message = f"""
        <h2>🚀 New {service} Request</h2>
        <hr>
        """

        ignore_fields = [
            "service","terms","_captcha",
            "_subject","_template","_next"
        ]

        for key, value in data.items():
            if key in ignore_fields:
                continue

            label = format_label(key)

            html_message += f"""
            <p><strong>{label}:</strong> {value}</p>
            """

        resend.Emails.send({
            "from": "HeroMove <onboarding@resend.dev>",
            "to": [EMAIL_USER],
            "subject": f"🚀 New {service} Request",
            "html": html_message,
        })

        print("✅ Email sent via Resend")

        return {
            "status": "success",
            "message": f"{service} sent successfully"
        }

    except Exception as e:
        print("❌ BACKEND ERROR:", e)
        return {
            "status": "error",
            "message": "Server failed to process request"
        }
