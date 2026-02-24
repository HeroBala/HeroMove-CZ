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
# ===============================
@app.post("/send-booking")
async def send_booking(request: Request):

    try:
        form = await request.form()

        data = {}
        attachments = []

        MAX_FILE_SIZE = 5 * 1024 * 1024

        # ===============================
        # READ FORM DATA
        # ===============================
        for key, value in form.items():

            if hasattr(value, "filename") and value.filename:

                print("📎 FILE RECEIVED:", value.filename)

                file_bytes = await value.read()

                if len(file_bytes) > MAX_FILE_SIZE:
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
        # SUBJECT DETECTION
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
        # BUILD ADMIN EMAIL HTML
        # ===============================
        html_message = f"""
        <div style="font-family:Arial;padding:20px;">
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

        html_message += "</div>"

        # ===============================
        # SEND ADMIN EMAIL
        # ===============================
        resend.Emails.send({
            "from": "HeroMove <onboarding@resend.dev>",
            "to": [EMAIL_USER] if EMAIL_USER else [],
            "subject": subject_prefix,
            "html": html_message,
            "attachments": attachments
        })

        print("✅ Admin email sent")

        # ===============================
        # AUTO REPLY TO USER
        # ===============================
        user_email = data.get("email")

        if user_email:

            user_html = fuser_html = f"""
                <div style="background:#0b1220;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">
                <div style="max-width:600px;margin:auto;background:#111827;border-radius:14px;padding:30px;color:#e5e7eb;">

                    <!-- HEADER -->
                    <div style="text-align:center;margin-bottom:20px;">
                    <h1 style="margin:0;color:#22c55e;font-weight:700;">🚀 HeroMove CZ</h1>
                    <p style="margin:5px 0 0;color:#9ca3af;">Courier • Transport • Support Services</p>
                    </div>

                    <!-- TITLE -->
                    <h2 style="color:#ffffff;margin-top:10px;">
                    ✅ Application Received
                    </h2>

                    <p style="color:#d1d5db;">
                    Hello,
                    </p>

                    <p style="color:#d1d5db;">
                    Thank you for submitting your application to <strong>HeroMove CZ</strong>.
                    Our onboarding team has successfully received your request.
                    </p>

                    <!-- SERVICE BOX -->
                    <div style="
                    background:#020617;
                    border:1px solid #1f2937;
                    padding:16px;
                    border-radius:10px;
                    margin:20px 0;
                    ">
                    <strong style="color:#22c55e;">Application Type:</strong>
                    <span style="color:#e5e7eb;"> {subject_prefix}</span>
                    </div>

                    <p style="color:#d1d5db;">
                    📞 Our onboarding specialist will contact you shortly with the next steps.
                    </p>

                    <p style="color:#d1d5db;">
                    If you have any questions, simply reply to this email.
                    </p>

                    <hr style="border:none;border-top:1px solid #1f2937;margin:25px 0;">

                    <!-- FOOTER -->
                    <div style="text-align:center;">
                    <p style="margin:0;color:#9ca3af;">
                        HeroMove CZ Team
                    </p>
                    <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">
                        Reliable courier & transport solutions across Czech Republic
                    </p>
                    </div>

                </div>
                </div>
                """

            resend.Emails.send({
                "from": "HeroMove <onboarding@resend.dev>",
                "to": [user_email],
                "subject": f"✅ We received your {subject_prefix}",
                "html": user_html
            })

            print("📨 User auto-reply sent")

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