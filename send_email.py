#!/usr/bin/env python3
"""
HeroMove CZ - Email Backend
Handles form submissions and sends emails via Gmail SMTP
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Email Configuration
GMAIL_ADDRESS = os.getenv('GMAIL_ADDRESS', 'herobala1997@gmail.com')
GMAIL_APP_PASSWORD = os.getenv('GMAIL_APP_PASSWORD', '')  # Set via environment variable
RECIPIENT_EMAIL = 'herobala1997@gmail.com'

# Alternative: Using environment file (.env)
try:
    from dotenv import load_dotenv
    load_dotenv()
    GMAIL_ADDRESS = os.getenv('GMAIL_ADDRESS', 'herobala1997@gmail.com')
    GMAIL_APP_PASSWORD = os.getenv('GMAIL_APP_PASSWORD', '')
except ImportError:
    pass


def send_email_via_gmail(to_email, subject, body, from_email=None):
    """
    Send email using Gmail SMTP
    
    Args:
        to_email (str): Recipient email address
        subject (str): Email subject
        body (str): Email body (plain text)
        from_email (str): Sender email (defaults to GMAIL_ADDRESS)
    
    Returns:
        dict: {'success': bool, 'message': str}
    """
    try:
        if not GMAIL_APP_PASSWORD:
            return {
                'success': False,
                'message': 'Gmail credentials not configured. Please set GMAIL_APP_PASSWORD environment variable.'
            }
        
        # Create email message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = GMAIL_ADDRESS
        msg['To'] = to_email
        
        # Create plain text version
        text_part = MIMEText(body, 'plain')
        msg.attach(text_part)
        
        # Connect to Gmail SMTP server
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=10)
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        
        # Send email
        server.sendmail(GMAIL_ADDRESS, [to_email], msg.as_string())
        server.quit()
        
        logger.info(f"✅ Email sent successfully to {to_email}")
        return {
            'success': True,
            'message': f'Email sent successfully to {to_email}'
        }
    
    except smtplib.SMTPAuthenticationError:
        logger.error("❌ Gmail authentication failed. Check GMAIL_APP_PASSWORD.")
        return {
            'success': False,
            'message': 'Authentication failed. Please check your Gmail credentials.'
        }
    
    except smtplib.SMTPException as e:
        logger.error(f"❌ SMTP error: {str(e)}")
        return {
            'success': False,
            'message': f'Email service error: {str(e)}'
        }
    
    except Exception as e:
        logger.error(f"❌ Error sending email: {str(e)}")
        return {
            'success': False,
            'message': f'Error sending email: {str(e)}'
        }


@app.route('/send-email', methods=['POST', 'OPTIONS'])
def send_email_endpoint():
    """
    Handle email sending requests from forms
    
    Expected JSON payload:
    {
        'fullName': 'John Doe',
        'email': 'john@example.com',
        'phone': '+420 608 147 604',
        'message': 'Full formatted message'
    }
    """
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Extract form data
        full_name = data.get('fullName', 'Unknown User').strip()
        from_email = data.get('email', 'noreply@heromove.cz').strip()
        phone = data.get('phone', 'Not provided').strip()
        message = data.get('message', '').strip()
        
        # Validate required fields
        if not full_name or not message:
            return jsonify({
                'success': False,
                'message': 'Missing required fields: fullName or message'
            }), 400
        
        # Construct email subject
        subject = f"New Application from HeroMove CZ - {full_name}"
        
        # Construct email body
        email_body = f"""
New Application Received from HeroMove CZ

From: {full_name}
Email: {from_email}
Phone: {phone}

{'='*60}

{message}

{'='*60}

Submitted on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Reply-To: {from_email}
"""
        
        # Send email
        result = send_email_via_gmail(
            to_email=RECIPIENT_EMAIL,
            subject=subject,
            body=email_body,
            from_email=from_email
        )
        
        return jsonify(result), 200 if result['success'] else 400
    
    except Exception as e:
        logger.error(f"❌ Error in send_email_endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'HeroMove CZ Email Service',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'service': 'HeroMove CZ Email Backend',
        'version': '1.0.0',
        'endpoints': {
            'POST /send-email': 'Send email from form submission',
            'GET /health': 'Health check endpoint'
        }
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'message': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500


if __name__ == '__main__':
    # Configuration
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    
    print(f"""
╔════════════════════════════════════════════════════════╗
║     HeroMove CZ - Email Backend Service                ║
╚════════════════════════════════════════════════════════╝

📧 Recipient Email: {RECIPIENT_EMAIL}
🔧 Debug Mode: {debug_mode}
🌐 Server: {host}:{port}

Starting Flask server...
Use http://localhost:{port} to test

Press CTRL+C to stop the server.
    """)
    
    app.run(
        host=host,
        port=port,
        debug=debug_mode
    )
