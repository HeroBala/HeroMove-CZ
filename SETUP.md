# HeroMove CZ — Cleaned Setup Guide

## ✅ Workspace Status

**Kept:**
- `send_email.py` — Python Flask backend (for optional local/staging use)
- `.env` — Gmail credentials (GMAIL_ADDRESS & GMAIL_APP_PASSWORD)
- `requirements.txt` — Python dependencies
- All HTML pages with **FormSubmit** integration

**Removed:**
- `send-email.php` — No longer needed; using FormSubmit
- Backend documentation files (FORM_SETUP.md, EMAIL_TROUBLESHOOTING.md, PYTHON_BACKEND_SETUP.md)
- `test-email.html` — No longer needed

---

## 📧 Form Submission Setup

### Current Configuration
All forms now use **FormSubmit.co** — a free, GitHub Pages-compatible form backend.

**Forms Converted:**
1. [signup.html](signup.html) — Courier recruitment
2. [business-licence-guidance.html](business-licence-guidance.html) — Business registration
3. [online-growth-support.html](online-growth-support.html) — Income growth consulting
4. [personal-assistance.html](personal-assistance.html) — Personal support
5. [online-offline-help.html](online-offline-help.html) — Multi-channel help
6. [other-services.html](other-services.html) — General contact

### How Forms Work

**Frontend (HTML):**
```html
<form action="https://formsubmit.co/herobala1997@gmail.com" method="POST">
  <input type="hidden" name="_captcha" value="false">
  <input type="hidden" name="_subject" value="New HeroMove Request">
  <input type="hidden" name="_template" value="table">
  <input type="hidden" name="_next" value="thank-you.html">
  <!-- Form fields here -->
</form>
```

**Backend:**
- FormSubmit receives the POST
- Emails go to: **herobala1997@gmail.com**
- User redirected to: **thank-you.html** (success page)

---

## 🚀 How to Use

### For GitHub Pages (No Backend Needed)
✅ **Just deploy** — forms work immediately with FormSubmit.

```bash
git push origin main
# Forms will submit directly to FormSubmit.co
```

### For Local Testing with Python Backend (Optional)

1. **Start Python backend** (for advanced use only):
   ```bash
   pip install -r requirements.txt
   python3 send_email.py
   ```

2. **Forms will still use FormSubmit** — Python backend is a fallback if you integrate it.

---

## 📧 Gmail Configuration

### You Already Have:
- **Email:** herobala1997@gmail.com
- **App Password:** `giehmfvdtimqbtsi` (in `.env`)

### To Update Gmail Credentials:

1. Go to: https://myaccount.google.com/apppasswords
2. Generate a new 16-character app password
3. Update `.env`:
   ```
   GMAIL_ADDRESS=herobala1997@gmail.com
   GMAIL_APP_PASSWORD=your_new_16_char_password
   ```

> **Note:** FormSubmit uses its own email service (not your Python backend). Forms will send to herobala1997@gmail.com automatically.

---

## ✅ Pre-Publication Checklist

- [x] All 6 forms converted to FormSubmit
- [x] WhatsApp buttons functional (open with pre-filled messages)
- [x] Thank-you page created (`thank-you.html`)
- [x] No JavaScript POST handlers (clean, simple HTML forms)
- [x] No errors in any HTML files
- [x] Python script available for optional local use
- [x] Gmail credentials configured

### Final Tests to Run:

1. **Test form submission** (any page):
   - Fill form → Click submit → Should redirect to `thank-you.html`
   - Check herobala1997@gmail.com inbox (wait 1-2 min)

2. **Test WhatsApp button** (any form):
   - Click "💬 Send via WhatsApp" → Should open WhatsApp Web with pre-filled message

3. **Mobile test**:
   - Open on phone → Fill form → Submit → Verify success page and email delivery

---

## 📁 File Structure (Clean)

```
/Users/joyasarkar/heromove-cz/
├── HTML Pages (6 forms + support pages)
│   ├── signup.html
│   ├── business-licence-guidance.html
│   ├── online-growth-support.html
│   ├── personal-assistance.html
│   ├── online-offline-help.html
│   ├── other-services.html
│   ├── thank-you.html
│   ├── index.html
│   └── [other service pages]
│
├── Styling & Scripts
│   ├── style.css
│   └── script.js
│
├── Python Backend (Optional)
│   ├── send_email.py
│   ├── requirements.txt
│   └── .env (with Gmail credentials)
│
└── [Other assets]
```

---

## 🔧 Troubleshooting

### Form not submitting?
- Check browser console (F12) for errors
- Verify form has all required fields filled
- Try again (FormSubmit may have brief delays)

### Not receiving emails?
- Check spam folder in Gmail
- Verify FormSubmit delivery: https://formsubmit.co/
- Wait 1-2 minutes (email can be delayed)

### WhatsApp button not working?
- You need WhatsApp Web account or mobile app installed
- Try on mobile phone for best compatibility
- Check +420 608 147 604 is correct in code

---

## 📋 Deployment

### Push to GitHub
```bash
cd /Users/joyasarkar/heromove-cz
git add .
git commit -m "Clean setup: FormSubmit integration, Python backend optional"
git push origin main
```

### Enable GitHub Pages
1. Go to repo settings
2. Select: Settings → Pages → Source: Main branch
3. Your site will be live at: `https://yourusername.github.io/heromove-cz`

### Forms Will Work Immediately
- No server setup needed
- FormSubmit handles all email delivery
- Fully GitHub Pages compatible ✅

---

## 🎯 Summary

- ✅ **Forms:** 6 pages with FormSubmit (no backend required for GitHub Pages)
- ✅ **Email:** All submissions go to herobala1997@gmail.com
- ✅ **WhatsApp:** Alternative contact method on all forms
- ✅ **Python:** Available locally for optional advanced use
- ✅ **Clean:** Removed all unnecessary files and old backend code
- ✅ **Ready:** Deploy to GitHub Pages anytime

---

**Last Updated:** February 18, 2026  
**Status:** ✅ Ready for Publication
