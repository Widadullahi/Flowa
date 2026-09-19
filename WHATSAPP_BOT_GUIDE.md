# FLOWA WhatsApp Bot - Quick Start

## ⚡ Start Everything NOW

### Two Interfaces:
- 🎨 **Landing Page** (localhost:5173) - Goes to production
- 📊 **Dashboard** (localhost:5000) - Admin/testing only

### Setup (one time only):
```bash
bash /home/biltronix/FLOWA/start.sh
```

### Run Backend:
```bash
cd /home/biltronix/FLOWA/packages/api
source .venv/bin/activate
python app.py
```

**Output should show:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: off
```

### Run Frontend (in another terminal):
```bash
cd /home/biltronix/FLOWA/packages/landing
npm run dev
```

**Output should show:**
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

---

## 🧪 Test WhatsApp Bot Immediately

**Without setting up Meta API**, test the bot:

```bash
bash /home/biltronix/FLOWA/test-whatsapp-bot.sh
```

This sends:
- ✅ Cake order message
- ✅ Additional details
- ✅ Payment message
- ✅ Tailor inquiry
- ✅ Photography inquiry

**Check the results at:** http://localhost:5000

---

## 🔌 Connect Real WhatsApp (Optional)

### Step 1: Get Meta Credentials
https://developers.facebook.com/docs/whatsapp/cloud-api/

You'll get:
- Phone Number ID
- Access Token
- Webhook Verify Token

### Step 2: Set Environment Variables
```bash
cd /home/biltronix/FLOWA/packages/api

# Create .env file
cat > .env << 'EOF'
WHATSAPP_PHONE_ID=YOUR_PHONE_ID
WHATSAPP_API_TOKEN=YOUR_ACCESS_TOKEN
WHATSAPP_WEBHOOK_TOKEN=your_custom_webhook_token
EOF
```

### Step 3: Configure Webhook in Meta Console
1. Go to your app dashboard
2. WhatsApp → Configuration
3. Set:
   - **Webhook URL:** `https://your-domain.com/api/whatsapp/webhook`
   - **Verify Token:** `your_custom_webhook_token` (same as .env)
   - **Subscribe to:** `messages`, `message_status`

### Step 4: Deploy to Public Server
```bash
# Use ngrok for local testing:
ngrok http 5000

# Then update webhook URL to ngrok URL
```

---

## 🤖 How It Works

```
Customer texts WhatsApp number
        ↓
Meta webhook sends to: /api/whatsapp/webhook
        ↓
Flowa processes message through AI
        ↓
AI extracts products, prices, details
        ↓
Generates intelligent response
        ↓
Sends response back via WhatsApp API
        ↓
Lead logged in dashboard
```

---

## 📊 Dashboard Features

Access at: **http://localhost:5000**

- 📈 Live statistics (businesses, leads, paid orders)
- 💬 Customer conversations
- 📋 Order summary
- 💳 Payment status tracking
- 📊 Export to CSV
- 🏢 Business management

---

## 🧪 Example Conversation

```
Customer: "Hi, I want a 10-inch chocolate cake"
AI Response: "Thanks! I can help with the 10 inch chocolate cake. 
             To complete this order, I still need: flavour, design, 
             delivery_date, delivery_time. Once that is confirmed, 
             I will share the total and account details for payment."

Customer: "Vanilla, gold design, Saturday 2pm in Lekki"
AI Response: "Thanks! Your order is ready for payment. 
             The total is ₦50,000. Please pay into Sweet Crumb Cakes - 
             Access Bank 0123456789. Once payment is sent, 
             I will confirm receipt."

Customer: "I sent the money"
AI Response: "Thank you! We have received your payment. 
             Your order is now confirmed and ready for production."

Dashboard: Shows order as PAID, ready for fulfillment
```

---

## 📊 Mock Businesses Included

1. **Sweet Crumb Cakes** (Baker) - Lekki, Lagos
2. **Premium Tailoring** (Fashion) - Ikeja, Lagos  
3. **Photo Moments Studio** (Photography) - VI, Lagos
4. **Reliable Plumbing** (Home Services) - Surulere, Lagos
5. **Bead & Accessories** (Jewelry) - Ogba, Lagos

Each has mock products and leads in different order stages.

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on localhost:5000 | Check backend is running: `python app.py` |
| No page on localhost:5173 | Check frontend: `npm run dev` |
| Vite not found | Run: `npm install` in landing folder |
| Webhook not working | Check credentials in .env file |
| Webhook 403 error | Verify token doesn't match - update .env |

---

## 📚 More Info

- [WhatsApp Setup Guide](packages/api/WHATSAPP_SETUP.md)
- [Backend Code](packages/api/app.py)
- [API Endpoints](packages/api/app.py#L440)
- [Monorepo Structure](MONOREPO_STRUCTURE.md)

---

**Made for African entrepreneurs** 🚀
