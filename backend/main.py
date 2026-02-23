from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import resend
import base64

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
# SEND BOOKING / APPLICATION
# PRO+ VERSION
# ===============================
@app.post("/send-booking")
async def send_booking(request: Request):

    try:
        form = await request.form()

        data = {}
        attachments = []

        # ⭐ PRO+: max file size protection (5MB)
        MAX_FILE_SIZE = 5 * 1024 * 1024

        for key, value in form.items():

            # ===============================
            # FILE HANDLING
            # ===============================
            if hasattr(value, "filename") and value.filename:

                print("📎 FILE RECEIVED:", value.filename)

                file_bytes = await value.read()

                # 🚨 FILE SIZE CHECK
                if len(file_bytes) > MAX_FILE_SIZE:
                    print("❌ File too large:", value.filename)
                    return {
                        "status": "error",
                        "message": "File too large (max 5MB)"
                    }

                encoded = base64.b64encode(file_bytes).decode()

                attachments.append({
                    "filename": value.filename,
                    "content": f"data:{value.content_type};base64,{encoded}"
                })

                # show filename in email body
                data[key] = value.filename

            else:
                data[key] = value

        print("📩 RECEIVED DATA:", data)

        # ===============================
        # SMART SUBJECT LINE
        # ===============================
        service = data.get("service", "HeroMove Request")

        if "job" in service.lower():
            subject_prefix = "🧑‍💼 Job Application"
        elif "airport" in service.lower():
            subject_prefix = "✈️ Airport Booking"
        else:
            subject_prefix = "🚀 HeroMove Request"

        # ===============================
        # BUILD HTML EMAIL
        # ===============================
        html_message = f"""
        <h2>{subject_prefix}</h2>
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

        # ===============================
        # SEND EMAIL
        # ===============================
        resend.Emails.send({
            "from": "HeroMove <onboarding@resend.dev>",
            "to": [EMAIL_USER],
            "subject": f"{subject_prefix}",
            "html": html_message,
            "attachments": attachments
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