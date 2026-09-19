# FLOWA - WhatsApp Commerce Operating System

**From Conversation to Completion**

FLOWA is a monorepo containing:
- 🎯 **Landing Page** - Beautiful marketing site built with React, TanStack Router, and Tailwind CSS
- 🤖 **Backend API** - Flask-based WhatsApp bot that processes customer conversations and manages orders
- 📊 **Admin Dashboard** - Web interface for business management and lead tracking

## 📂 Monorepo Structure

```
flowa/
├── packages/
│   ├── landing/          # React frontend landing page
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── api/              # Flask backend API
│       ├── app.py        # Main Flask application
│       ├── templates/    # Jinja2 templates for dashboard
│       ├── static/       # CSS, JS, images
│       ├── requirements.txt
│       └── .venv/        # Python virtual environment
│
├── package.json          # Root workspace config
├── README.md
└── docker-compose.yml    # (Optional) Docker setup
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18 or **Bun** ≥ 1.1
- **Python** ≥ 3.10
- **Git**

### Installation

```bash
# Clone and setup
cd flowa

# Install dependencies
bun install              # or npm install

# Setup Python backend
cd packages/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ../..
```

### Running Locally

**Option 1: Run both simultaneously (recommended)**
```bash
# From root directory
bun run dev:concurrent

# Or manually in two terminals:
# Terminal 1:
bun run api

# Terminal 2:
bun run landing
```

**Option 2: Run separately**
```bash
# Just landing page
bun run landing

# Just API (in packages/api)
source .venv/bin/activate
python app.py
```

### Access Points

| Interface | URL | Purpose | Use Case |
|-----------|-----|---------|----------|
| **Landing Page** | http://localhost:5173 | Marketing site | Production-facing (public) |
| **Dashboard** | http://localhost:5000 | Admin panel | Development/testing (internal) |
| **API Server** | http://localhost:5000 | Backend | WhatsApp bot engine |

**Important:** 
- 🎨 **Landing Page** (5173) = What goes to production
- 📊 **Dashboard** (5000) = Internal testing tool only
- 🤖 **WhatsApp Bot** = Silent, runs on backend API

## 📦 Packages

### `/packages/landing` - React Frontend

**Technology Stack:**
- React 19
- TanStack Router v1
- Vite (build tool)
- Tailwind CSS
- TypeScript
- Bun (package manager)

**Key Components:**
- Landing page with hero, features, demo
- Navigation and CTAs
- Responsive design
- SEO optimized (OpenGraph, Twitter cards)

**Scripts:**
```bash
cd packages/landing
bun run dev          # Start dev server
bun run build        # Build for production
bun run preview      # Preview production build
bun run lint         # Run ESLint
bun run format       # Format code with Prettier
```

### `/packages/api` - Flask Backend

**Technology Stack:**
- Flask 3.0.3
- Python 3.10+
- Jinja2 templating
- WhatsApp Cloud API integration
- In-memory storage (mock data for MVP)

**Key Features:**
- ✅ Business onboarding
- ✅ Customer conversation processing via WhatsApp
- ✅ AI-driven response generation
- ✅ Lead/order management
- ✅ Payment status tracking
- ✅ CSV export for reports
- ✅ Mock webhook endpoints for WhatsApp

**API Routes:**
```
GET  /                          # Dashboard
GET  /api/businesses            # List businesses
POST /api/businesses            # Create business
GET  /api/leads                 # List leads/orders
POST /api/leads                 # Create lead
POST /api/chat                  # Process customer message
GET  /api/reports/export        # Export CSV
GET  /api/reports               # JSON report
GET  /api/health                # Health check
GET  /api/whatsapp/webhook      # Webhook verification
POST /api/whatsapp/webhook      # Receive WhatsApp messages
POST /api/whatsapp/test         # Test WhatsApp flow
```

**Scripts:**
```bash
cd packages/api
source .venv/bin/activate
python app.py                   # Run dev server
pip install -r requirements.txt # Install deps
```

## 🔌 WhatsApp Integration

The backend includes WhatsApp Cloud API integration for:
- Receiving customer messages
- Sending AI-generated responses
- Processing orders
- Managing payment flow

### Setup WhatsApp Bot

See [WHATSAPP_SETUP.md](packages/api/WHATSAPP_SETUP.md) for detailed instructions on:
- Getting API credentials from Meta
- Configuring webhooks
- Testing with local development (ngrok)
- Deploying to production

### Test WhatsApp Flow

```bash
# Without setting up real WhatsApp API, test with:
curl -X POST http://localhost:5000/api/whatsapp/test \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "biz_1001",
    "customer_phone": "+2348012345678",
    "message": "I want a 10-inch chocolate cake"
  }'
```

## 📊 Mock Data

The API comes with mock data for testing:

**5 Sample Businesses:**
1. Sweet Crumb Cakes (Baker)
2. Premium Tailoring (Fashion)
3. Photo Moments Studio (Photography)
4. Reliable Plumbing (Home Services)
5. Bead & Accessories (Jewelry)

**7 Sample Leads in Different Statuses:**
- Waiting for payment
- Paid/Completed
- Waiting for details
- Interested
- Follow-up scheduled
- New inquiry

## 🏗️ Building for Production

### Landing Page
```bash
cd packages/landing
bun run build
# Output: dist/ folder ready for static hosting
```

### API Backend
```bash
cd packages/api
# Deploy to cloud (Heroku, Railway, Render, etc.)
# Set environment variables for WhatsApp credentials
```

## 🔐 Environment Variables

### Backend (`packages/api/.env`)
```env
WHATSAPP_PHONE_ID=your_phone_id
WHATSAPP_API_TOKEN=your_access_token
WHATSAPP_WEBHOOK_TOKEN=your_webhook_verification_token
FLASK_ENV=development
DEBUG=True
```

See [.env.example](packages/api/.env.example) for template.

## 📝 Project Status

**MVP Features (✅ Complete):**
- Landing page
- Business onboarding form
- Customer WhatsApp conversation processing
- AI response generation
- Lead/order management
- CSV export
- Admin dashboard

**Roadmap Features:**
- [ ] Real WhatsApp integration (move from mock)
- [ ] Database (PostgreSQL/MongoDB)
- [ ] Authentication & multi-team support
- [ ] Payment processing (Paystack)
- [ ] Reminder scheduling
- [ ] Analytics and insights
- [ ] Mobile app
- [ ] Template management for responses

## 🎯 Key Workflows

### Customer Onboarding Flow
1. Customer texts business WhatsApp number
2. Flowa receives message via webhook
3. AI analyzes and matches to products
4. AI responds with order summary and missing info
5. Customer provides details
6. AI guides to payment
7. Payment confirmation triggers completion
8. Business can view lead in dashboard

### Business Setup Flow
1. Business fills onboarding form (or setup via API)
2. Provides WhatsApp number and payment details
3. Adds product catalog
4. Done! Ready to receive WhatsApp orders

## 💡 Example: Cake Order

```
Customer: Hi, I want a 10-inch chocolate cake
→ AI: Thanks! I can help with the 10 inch chocolate cake.
      To complete this order, I still need: flavour, design, delivery_date, delivery_time
      Once confirmed, I will share the total and account details for payment.

Customer: Vanilla flavour, gold design, next Saturday 2pm in Lekki
→ AI: Thanks! Your order is ready for payment.
      The total is ₦50,000. Please pay into Sweet Crumb Cakes - Access Bank 0123456789.
      Once payment is sent, I will confirm receipt.

Customer: I have sent the money
→ AI: Thank you! We have received your payment. Your order is now confirmed.

Business Dashboard: Order shows as PAID, ready for production
```

## 📚 Documentation

- [WhatsApp Setup Guide](packages/api/WHATSAPP_SETUP.md) - How to integrate real WhatsApp API
- [Landing Page Components](packages/landing/src/components/) - React component docs
- [API Route Docs](packages/api/app.py) - Backend API reference

## 📄 License

MIT License

---

**Made with ❤️ for African entrepreneurs**
