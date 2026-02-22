from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

from dotenv import load_dotenv


# ===============================
# LOAD ENV VARIABLES
# ===============================
load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")


# ===============================
# FASTAPI APP
# ===============================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://herobala.github.io",
        "https://herobala.github.io/HeroMove-CZ"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "HeroMove backend running"}


# ===============================
# HELPER: FORMAT FIELD LABELS
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
# UNIVERSAL BOOKING API
# ===============================
@app.post("/send-booking")
async def send_booking(request: Request):

    form = await request.form()

    data = {}
    file_attachment = None

    # ===============================
    # EXTRACT FORM DATA + FILE
    # ===============================
    for key, value in form.items():

        # ⭐ detect file safely
        if hasattr(value, "filename"):
            file_attachment = value
            continue

        data[key] = value

    print("RECEIVED DATA:", data)

    service = data.get("service", "HeroMove Booking")

    # ===============================
    # BUILD CLEAN HTML EMAIL
    # ===============================
    html_message = f"""
    <h2>🚀 New {service} Request</h2>
    <hr>
    """

    ignore_fields = ["service", "terms", "_captcha", "_subject", "_template", "_next"]

    for key, value in data.items():

        if key in ignore_fields:
            continue

        label = format_label(key)

        html_message += f"""
        <p><strong>{label}:</strong> {value}</p>
        """

    # ===============================
    # CREATE EMAIL
    # ===============================
    msg = MIMEMultipart()
    msg["Subject"] = f"🚀 New {service} Request"
    msg["From"] = EMAIL_USER
    msg["To"] = EMAIL_USER

    msg.attach(MIMEText(html_message, "html", "utf-8"))

    # ===============================
    # ATTACH FILE IF EXISTS
    # ===============================
    if file_attachment and getattr(file_attachment, "filename", None):

        file_bytes = await file_attachment.read()

        part = MIMEBase("application", "octet-stream")
        part.set_payload(file_bytes)

        encoders.encode_base64(part)

        part.add_header(
            "Content-Disposition",
            f'attachment; filename="{file_attachment.filename}"'
        )

        msg.attach(part)

    # ===============================
    # SEND EMAIL
    # ===============================
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)

        print("✅ Email with attachment sent")

        return {
            "status": "success",
            "message": f"{service} sent successfully"
        }

    except Exception as e:
        print("❌ EMAIL ERROR:", e)

        return {
            "status": "error",
            "message": "Email sending failed"
        }