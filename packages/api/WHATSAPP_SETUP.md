# WhatsApp Integration Setup Guide

## Overview
Flowa is integrated with **Meta WhatsApp Business API** to receive customer messages and send AI-powered responses automatically.

## Setup Steps

### 1. Prerequisites
- Meta Business Account (free)
- WhatsApp Business Account (free)
- A phone number (can be virtual for testing)

### 2. Get WhatsApp API Credentials

#### Option A: Production Setup (Real Numbers)
1. Go to [Meta Developers Console](https://developers.facebook.com)
2. Create/Select your app → WhatsApp → Setup
3. Get your:
   - **Phone ID** (Business Phone Number ID)
   - **Access Token** (with `whatsapp_business_messaging` permission)
   - **Webhook Verify Token** (you create this)

#### Option B: Testing/Sandbox
Use Meta's test numbers for development:
- Test Business Account available in App Dashboard
- Pre-configured test numbers for customers

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your credentials
WHATSAPP_PHONE_ID=YOUR_PHONE_ID
WHATSAPP_API_TOKEN=YOUR_ACCESS_TOKEN
WHATSAPP_WEBHOOK_TOKEN=your_custom_secret_token
```

### 4. Set Up Webhook

1. In Meta Developers Console → WhatsApp → Configuration
2. Set Webhook URL to: `https://your-domain.com/api/whatsapp/webhook`
3. Set Verify Token to: `flowa_webhook_secret_123` (or your custom token from .env)
4. Subscribe to webhook fields: `messages`, `message_status`

### 5. Test Locally (with ngrok)

For local testing, expose your Flask app to the internet:

```bash
# Install ngrok (https://ngrok.com)
ngrok http 5000

# This gives you a public URL like: https://xxxx-xx-xxx-xxx-x.ngrok.io
# Use this URL in your webhook configuration
```

### 6. Configure Business Numbers

In [app.py](app.py), the system matches incoming messages to businesses by their WhatsApp number in the database.

**The Hook:**
- When a customer texts your business WhatsApp number
- Flowa finds the matching business
- AI processes the message
- Response sent back automatically

### How It Works

```
Customer WhatsApp
        ↓
  Meta WhatsApp API
        ↓
Flowa Webhook: /api/whatsapp/webhook (POST)
        ↓
Find matching business by phone ← FlowaStore
        ↓
Run message through AI engine
        ↓
Store lead/conversation
        ↓
Send AI response back via WhatsApp API
        ↓
Dashboard shows all conversations
```

## Free Tier Usage

✅ **Always Free:**
- Receiving messages
- Test mode sandbox

✅ **Free Quota:**
- First 1,000 messages/month

💰 **After 1,000 messages:**
- Pay per message (typically ₦13-20 in Nigeria)

## Testing with Mock Data

The app comes with mock businesses and customers. Once webhook is configured:
1. Text your Flowa WhatsApp number: "I want a 10-inch chocolate cake"
2. AI responds with order summary and missing fields
3. Check dashboard to see conversation logged
4. Export CSV with all leads

## Troubleshooting

### Webhook not connecting
- Verify token matches in .env and Meta Console
- Check URL is publicly accessible (use ngrok for local)
- Check logs in Flask terminal

### Messages not received
- Ensure business WhatsApp number in database matches sending number
- Check API token has `whatsapp_business_messaging` permission
- Verify webhook subscription to `messages` field

### Responses not sending
- Check API token validity
- Ensure destination phone number includes country code (+234 for Nigeria)
- Check rate limits (may have back-off period)

## Production Checklist

- [ ] Use production phone numbers (not test numbers)
- [ ] Move API token to secure environment variables
- [ ] Set up HTTPS (required for webhooks)
- [ ] Monitor message costs
- [ ] Set up error logging/alerting
- [ ] Test with real customers
- [ ] Handle long-running conversations (reminders, follow-ups)

## Additional Resources

- [Meta WhatsApp API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- [Webhook Events Reference](https://developers.facebook.com/docs/whatsapp/webhooks/components/)
- [Message Templates (Optional)](https://developers.facebook.com/docs/whatsapp/message-templates)
