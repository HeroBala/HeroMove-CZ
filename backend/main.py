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


# ======================================================
# 🎨 HERO MOVE PRO EMAIL TEMPLATE (ADMIN)
# ======================================================
def build_admin_email(subject_prefix: str, data: dict):

    rows = ""

    ignore_fields = [
        "service","terms","_captcha",
        "_subject","_template","_next"
    ]

    for key, value in data.items():
        if key in ignore_fields:
            continue

        label = format_label(key)

        rows += f"""
        <tr>
            <td style="padding:10px;font-weight:600;border-bottom:1px solid #eee;">{label}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;">{value}</td>
        </tr>
        """

    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;background:#0b1220;padding:30px;">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:14px;padding:26px;">

            <h2 style="margin:0;color:#16a34a;">🚀 HeroMove CZ</h2>
            <p style="color:#777;margin-top:6px;">New Submission Received</p>

            <h3 style="margin-top:18px;">{subject_prefix}</h3>

            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
                {rows}
            </table>

            <hr style="margin-top:24px">

            <p style="font-size:12px;color:#999;">
                HeroMove Universal Form System • Auto Generated Email
            </p>
        </div>
    </div>
    """


# ======================================================
# 📩 HERO MOVE AUTO REPLY TEMPLATE (USER)
# ======================================================
def build_user_email(service: str, user_name: str):

    service_lower = service.lower()

    if "bolt" in service_lower:
        intro = "Your Bolt Fleet application has been received."
    elif "wolt" in service_lower:
        intro = "Your Wolt Fleet application has been received."
    elif "foodora" in service_lower:
        intro = "Your Foodora Fleet application has been received."
    elif "airport" in service_lower:
        intro = "Your airport booking request has been received."
    elif "student" in service_lower:
        intro = "Your student support request has been received."
    else:
        intro = "Your request has been received successfully."

    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;background:#0b1220;padding:30px;">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:14px;padding:28px;text-align:center;">

            <h2 style="color:#16a34a;margin:0;">🚀 HeroMove CZ</h2>

            <p style="margin-top:18px;">Hello <strong>{user_name}</strong>,</p>

            <p>{intro}</p>

            <p style="color:#555;">
            ✔ Our team will review your submission<br>
            ✔ We may contact you via WhatsApp or Email<br>
            ✔ Approval usually takes 1–3 business days
            </p>

            <a href="https://herobala.github.io/HeroMove-CZ/"
            style="display:inline-block;margin-top:18px;padding:12px 22px;
            background:#16a34a;color:#ffffff;border-radius:8px;
            text-decoration:none;font-weight:600;">
            Visit HeroMove CZ
            </a>

            <p style="margin-top:22px;font-size:12px;color:#999;">
            This is an automatic confirmation email.
            </p>

        </div>
    </div>
    """


# ======================================================
# SEND BOOKING / APPLICATION
# PRO+ VERSION
# ======================================================
@app.post("/send-booking")
async def send_booking(request: Request):

    try:
        form = await request.form()

        data = {}
        attachments = []

        MAX_FILE_SIZE = 5 * 1024 * 1024

        for key, value in form.items():

            if hasattr(value, "filename") and value.filename:

                print("📎 FILE RECEIVED:", value.filename)

                file_bytes = await value.read()

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

                data[key] = value.filename

            else:
                data[key] = value

        print("📩 RECEIVED DATA:", data)

        # ===============================
        # SUBJECT LINE
        # ===============================
        service = data.get("service", "HeroMove Request")
        service_lower = service.lower()

        if "student" in service_lower:
            subject_prefix = "🎓 Student Arrival Support"
        elif "job" in service_lower:
            subject_prefix = "🧑‍💼 Job Application"
        elif "airport" in service_lower:
            subject_prefix = "✈️ Airport Booking"
        elif "fleet" in service_lower or "courier" in service_lower:
            subject_prefix = "🚚 Fleet Courier Application"
        else:
            subject_prefix = f"🚀 {service}"

        # ===============================
        # BUILD HERO MOVE ADMIN EMAIL
        # ===============================
        html_message = build_admin_email(subject_prefix, data)

        # ===============================
        # SEND ADMIN EMAIL
        # ===============================
        resend.Emails.send({
            "from": "HeroMove <onboarding@resend.dev>",
            "to": [EMAIL_USER],
            "subject": f"{subject_prefix}",
            "html": html_message,
            "attachments": attachments
        })

        print("✅ Admin email sent via Resend")

        # ===============================
        # AUTO REPLY TO USER
        # ===============================
        user_email = data.get("email")
        user_name = data.get("fullName", "Customer")

        if user_email:
            resend.Emails.send({
                "from": "HeroMove <onboarding@resend.dev>",
                "to": [user_email],
                "subject": f"{subject_prefix} — Received",
                "html": build_user_email(service, user_name)
            })
            print("📩 Auto reply sent to user")

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