from __future__ import annotations

import csv
import io
import os
import re
from datetime import datetime, timedelta, timezone
from typing import Any
import json

import requests
from flask import Flask, jsonify, make_response, render_template, request
from cryptography.fernet import Fernet, InvalidToken
from typing import Optional

app = Flask(__name__)

# WhatsApp Configuration
WHATSAPP_API_URL = os.getenv("WHATSAPP_API_URL", "https://graph.instagram.com/v18.0")
WHATSAPP_PHONE_ID = os.getenv("WHATSAPP_PHONE_ID", "YOUR_PHONE_ID")
WHATSAPP_API_TOKEN = os.getenv("WHATSAPP_API_TOKEN", "YOUR_API_TOKEN")
WHATSAPP_WEBHOOK_TOKEN = os.getenv("WHATSAPP_WEBHOOK_TOKEN", "flowa_webhook_secret_123")

# Master key used to encrypt per-business credentials. Must be a Fernet key (urlsafe base64 32-byte).
MASTER_KEY = os.getenv("MASTER_KEY")


def _get_fernet() -> Optional[Fernet]:
    if not MASTER_KEY:
        print("WARNING: MASTER_KEY not set. Per-business credentials will be stored in-memory unencrypted for this session only.")
        return None
    try:
        return Fernet(MASTER_KEY.encode())
    except Exception as e:
        print(f"Invalid MASTER_KEY provided: {e}")
        return None


def send_whatsapp_message(phone_number: str, message: str, business_id: Optional[str] = None) -> bool:
    """Send a message via WhatsApp API. If `business_id` has credentials stored, use them."""
    try:
        phone_id = WHATSAPP_PHONE_ID
        token = WHATSAPP_API_TOKEN

        # If business-specific credentials exist, use them
        if business_id:
            creds = store.get_whatsapp_credentials(business_id)
            if creds:
                phone_id = creds.get("phone_id") or phone_id
                token = creds.get("api_token") or token

        url = f"{WHATSAPP_API_URL}/{phone_id}/messages"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": phone_number,
            "type": "text",
            "text": {"body": message},
        }
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code >= 400:
            print(f"WhatsApp send failed: {response.status_code} - {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"WhatsApp send error: {e}")
        return False


class FlowaStore:
    def __init__(self) -> None:
        self.businesses: list[dict[str, Any]] = [
            {
                "id": "biz_1001",
                "business_name": "Sweet Crumb Cakes",
                "owner_name": "Tola Adeyemi",
                "category": "Baker",
                "what_they_do": "Custom cakes, cupcakes, and dessert boxes for birthdays and events.",
                "service_type": "Product seller",
                "business_description": "Premium custom cakes and gift boxes for events and special occasions.",
                "pricing": "₦25,000+ depending on size and design",
                "whatsapp_number": "+2348123456789",
                "location": "Lekki, Lagos",
                "bank_name": "Access Bank",
                "account_name": "Sweet Crumb Cakes",
                "account_number": "0123456789",
                "accepts_deposit": True,
                "payment_mode": "Paystack + Transfer",
                "registration_type": "CAC Registered",
                "status": "active",
                "logo_url": "",
                "products": [
                    {
                        "name": "6 inch chocolate cake",
                        "price": 25000,
                        "category": "cake",
                        "required_fields": ["size", "flavour", "design", "delivery_date", "delivery_time", "delivery_location"],
                    },
                    {
                        "name": "8 inch chocolate cake",
                        "price": 35000,
                        "category": "cake",
                        "required_fields": ["size", "flavour", "design", "delivery_date", "delivery_time", "delivery_location"],
                    },
                    {
                        "name": "10 inch chocolate cake",
                        "price": 50000,
                        "category": "cake",
                        "required_fields": ["size", "flavour", "design", "delivery_date", "delivery_time", "delivery_location"],
                    },
                    {
                        "name": "balloon gift box",
                        "price": 20000,
                        "category": "gift",
                        "required_fields": ["colour", "delivery_date", "delivery_time", "delivery_location"],
                    },
                ],
                "order_requirements": [
                    "product",
                    "size",
                    "flavour",
                    "design",
                    "colour",
                    "delivery_date",
                    "delivery_time",
                    "delivery_location",
                    "customer_name",
                ],
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
            {
                "id": "biz_1002",
                "business_name": "Premium Tailoring",
                "owner_name": "Folake Okafor",
                "category": "Fashion",
                "what_they_do": "Bespoke tailoring services for traditional wears, suits, and custom outfits.",
                "service_type": "Service provider",
                "business_description": "High-quality tailoring with expert craftsmanship for traditional and modern wear.",
                "pricing": "₦15,000 - ₦50,000 depending on complexity",
                "whatsapp_number": "+2349012345678",
                "location": "Ikeja, Lagos",
                "bank_name": "GTBank",
                "account_name": "Folake Okafor",
                "account_number": "0987654321",
                "accepts_deposit": True,
                "payment_mode": "50% deposit + balance on delivery",
                "registration_type": "Tax Registered",
                "status": "active",
                "logo_url": "",
                "products": [
                    {
                        "name": "Aso oke design",
                        "price": 35000,
                        "category": "traditional",
                        "required_fields": ["measurement_date", "delivery_date", "fabric_preference"],
                    },
                    {
                        "name": "3-piece suit",
                        "price": 50000,
                        "category": "formal",
                        "required_fields": ["measurement_date", "delivery_date", "fabric_type"],
                    },
                ],
                "order_requirements": ["product", "measurement_date", "delivery_date", "customer_name"],
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
            {
                "id": "biz_1003",
                "business_name": "Photo Moments Studio",
                "owner_name": "Chisom Okoro",
                "category": "Photography",
                "what_they_do": "Event photography, portraits, product shoots, and photo editing for social media.",
                "service_type": "Service provider",
                "business_description": "Professional photography services with quick turnaround and social media optimized edits.",
                "pricing": "₦50,000 - ₦200,000 based on hours and deliverables",
                "whatsapp_number": "+2347054321098",
                "location": "VI, Lagos",
                "bank_name": "FirstBank",
                "account_name": "Chisom Photography",
                "account_number": "1234567890",
                "accepts_deposit": True,
                "payment_mode": "50% upfront, balance after shoot",
                "registration_type": "CAC Registered",
                "status": "active",
                "logo_url": "",
                "products": [
                    {
                        "name": "4-hour event package",
                        "price": 80000,
                        "category": "event",
                        "required_fields": ["event_date", "event_type", "location"],
                    },
                    {
                        "name": "Engagement photoshoot",
                        "price": 120000,
                        "category": "couples",
                        "required_fields": ["shoot_date", "location", "theme"],
                    },
                ],
                "order_requirements": ["product", "event_date", "location", "customer_name"],
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
            {
                "id": "biz_1004",
                "business_name": "Reliable Plumbing",
                "owner_name": "Godwin Musa",
                "category": "Home Services",
                "what_they_do": "Plumbing repairs, installations, and maintenance for residential and commercial properties.",
                "service_type": "Service provider",
                "business_description": "Fast, reliable plumbing services with skilled technicians and quality materials.",
                "pricing": "₦5,000 callout + ₦30,000 - ₦100,000 for jobs",
                "whatsapp_number": "+2348765432109",
                "location": "Surulere, Lagos",
                "bank_name": "UBA",
                "account_name": "Godwin Musa",
                "account_number": "2109876543",
                "accepts_deposit": False,
                "payment_mode": "Cash on completion",
                "registration_type": "Tax Registered",
                "status": "active",
                "logo_url": "",
                "products": [
                    {
                        "name": "Pipe replacement",
                        "price": 45000,
                        "category": "repair",
                        "required_fields": ["location", "date_needed"],
                    },
                    {
                        "name": "Sink installation",
                        "price": 35000,
                        "category": "installation",
                        "required_fields": ["location", "date_needed"],
                    },
                ],
                "order_requirements": ["product", "location", "date_needed", "customer_name"],
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
            {
                "id": "biz_1005",
                "business_name": "Bead & Accessories",
                "owner_name": "Zainab Adeniyi",
                "category": "Jewelry",
                "what_they_do": "Handmade beaded jewelry, accessories, and fashion pieces.",
                "service_type": "Product seller",
                "business_description": "Unique handcrafted beaded necklaces, bracelets, and earrings perfect for gifts and personal use.",
                "pricing": "₦3,000 - ₦15,000 per piece",
                "whatsapp_number": "+2349876543210",
                "location": "Ogba, Lagos",
                "bank_name": "Zenith Bank",
                "account_name": "Bead Accessories",
                "account_number": "3210987654",
                "accepts_deposit": True,
                "payment_mode": "Full payment or 2-piece minimum order",
                "registration_type": "Not registered",
                "status": "active",
                "logo_url": "",
                "products": [
                    {
                        "name": "Beaded necklace",
                        "price": 8000,
                        "category": "necklace",
                        "required_fields": ["color_preference", "delivery_location"],
                    },
                    {
                        "name": "Bracelet set",
                        "price": 12000,
                        "category": "bracelet",
                        "required_fields": ["color_preference", "delivery_location"],
                    },
                ],
                "order_requirements": ["product", "color_preference", "delivery_location", "customer_name"],
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
        ]

        # In-memory encrypted per-business WhatsApp credential storage.
        # Structure: { business_id: encrypted_bytes }
        self._whatsapp_creds: dict[str, bytes] = {}

    # --- WhatsApp credential storage helpers ---
    def set_whatsapp_credentials(self, business_id: str, creds: dict[str, Any]) -> None:
        """Encrypt and store credentials for a business.

        creds should contain keys: phone_id, api_token, webhook_verify_token (optional)
        """
        f = _get_fernet()
        raw = json.dumps(creds).encode()
        if f:
            token = f.encrypt(raw)
            self._whatsapp_creds[business_id] = token
        else:
            # fallback: store plaintext bytes (only for local testing)
            self._whatsapp_creds[business_id] = raw

    def get_whatsapp_credentials(self, business_id: str) -> dict[str, Any] | None:
        data = self._whatsapp_creds.get(business_id)
        if not data:
            return None
        f = _get_fernet()
        try:
            if f:
                dec = f.decrypt(data)
            else:
                dec = data
            return json.loads(dec.decode())
        except InvalidToken:
            print("Failed to decrypt credentials: invalid token")
            return None
        except Exception as e:
            print(f"Failed to parse credentials: {e}")
            return None
        self.leads: list[dict[str, Any]] = [
            {
                "id": "lead_2001",
                "business_id": "biz_1001",
                "customer_name": "Tolu",
                "customer_phone": "+2348012345678",
                "product_or_service": "10 inch chocolate cake",
                "amount": 50000,
                "status": "waiting_for_payment",
                "payment_status": "pending",
                "order_status": "payment_pending",
                "order_summary": "10 inch chocolate cake, navy blue and gold, delivery in Lekki, Saturday, 4pm.",
                "summary": "Customer requested a chocolate cake and asked for account details. Awaiting payment confirmation.",
                "conclusion": "Payment has not been received yet.",
                "last_message": "Hi, I want a 10-inch chocolate cake for Saturday. Please send your account details.",
                "missing_fields": [],
                "required_fields": [],
                "reminder_at": None,
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
                "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
            {
                "id": "lead_2002",
                "business_id": "biz_1001",
                "customer_name": "Ada",
                "customer_phone": "+2348098765432",
                "product_or_service": "Balloon gift box",
                "amount": 20000,
                "status": "paid",
                "payment_status": "paid",
                "order_status": "paid",
                "order_summary": "Pink balloon gift box for delivery in Ikoyi.",
                "summary": "Customer paid for the balloon gift box and confirmed the design.",
                "conclusion": "Payment confirmed and order is ready for production.",
                "last_message": "I have sent the money. Please proceed.",
                "missing_fields": [],
                "required_fields": [],
                "reminder_at": None,
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
                "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
            {
                "id": "lead_2003",
                "business_id": "biz_1002",
                "customer_name": "Chidi",
                "customer_phone": "+2348765432101",
                "product_or_service": "3-piece suit",
                "amount": 50000,
                "status": "waiting_for_details",
                "payment_status": "pending",
                "order_status": "awaiting_details",
                "order_summary": "3-piece suit, measurement and delivery date needed.",
                "summary": "Customer interested in suit but hasn't provided measurement date yet.",
                "conclusion": "Missing key details for order completion.",
                "last_message": "Hi, I need a 3-piece suit for my wedding in December.",
                "missing_fields": ["measurement_date", "delivery_date"],
                "required_fields": ["measurement_date", "delivery_date"],
                "reminder_at": None,
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
                "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
            {
                "id": "lead_2004",
                "business_id": "biz_1003",
                "customer_name": "Nneka",
                "customer_phone": "+2347012345678",
                "product_or_service": "Engagement photoshoot",
                "amount": 120000,
                "status": "interested",
                "payment_status": "pending",
                "order_status": "interest_confirmed",
                "order_summary": "Engagement photoshoot inquiry.",
                "summary": "Customer is interested in engagement photoshoot package.",
                "conclusion": "Customer asking about pricing and availability.",
                "last_message": "How much for an engagement shoot? Do you have availability in August?",
                "missing_fields": [],
                "required_fields": [],
                "reminder_at": None,
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
                "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
            {
                "id": "lead_2005",
                "business_id": "biz_1004",
                "customer_name": "Emeka",
                "customer_phone": "+2348543210987",
                "product_or_service": "Pipe replacement",
                "amount": 45000,
                "status": "follow_up",
                "payment_status": "pending",
                "order_status": "follow_up",
                "order_summary": "Pipe replacement service in Surulere.",
                "summary": "Customer contacted about pipe replacement but asked to call back later.",
                "conclusion": "Waiting for customer to confirm they're ready to proceed.",
                "last_message": "Can you come fix my pipes? Call me later today.",
                "missing_fields": [],
                "required_fields": [],
                "reminder_at": (datetime.now(timezone.utc) + timedelta(hours=4)).strftime("%Y-%m-%dT%H:%M:%S"),
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
                "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
            {
                "id": "lead_2006",
                "business_id": "biz_1005",
                "customer_name": "Mina",
                "customer_phone": "+2349876543212",
                "product_or_service": "Beaded necklace",
                "amount": 8000,
                "status": "new",
                "payment_status": "pending",
                "order_status": "new",
                "order_summary": "Beaded necklace inquiry.",
                "summary": "Customer just reached out, needs to provide color preference.",
                "conclusion": "Initial contact made, waiting for product details.",
                "last_message": "Hi! Do you do custom color beads?",
                "missing_fields": ["color_preference"],
                "required_fields": ["color_preference"],
                "reminder_at": None,
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
                "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
            {
                "id": "lead_2007",
                "business_id": "biz_1001",
                "customer_name": "Kunle",
                "customer_phone": "+2347654321098",
                "product_or_service": "6 inch chocolate cake",
                "amount": 25000,
                "status": "paid",
                "payment_status": "paid",
                "order_status": "paid",
                "order_summary": "6 inch vanilla cake with strawberry design, delivery Monday, 2pm in Yaba.",
                "summary": "Customer paid for cake. Order ready for production.",
                "conclusion": "Payment confirmed. Business can proceed with cake preparation.",
                "last_message": "Money sent! Please make it perfect.",
                "missing_fields": [],
                "required_fields": [],
                "reminder_at": None,
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
                "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            },
        ]

    def list_businesses(self) -> list[dict[str, Any]]:
        return self.businesses

    def get_business(self, business_id: str) -> dict[str, Any] | None:
        for business in self.businesses:
            if business["id"] == business_id:
                return business
        return None

    def create_business(self, payload: dict[str, Any]) -> dict[str, Any]:
        business = {
            "id": f"biz_{len(self.businesses) + 1001}",
            "business_name": payload.get("business_name") or "New Business",
            "owner_name": payload.get("owner_name") or "Business owner",
            "category": payload.get("category") or "General",
            "what_they_do": payload.get("what_they_do") or "Custom products and services",
            "service_type": payload.get("service_type") or "Product seller",
            "business_description": payload.get("business_description") or "Business description",
            "pricing": payload.get("pricing") or "Price on enquiry",
            "whatsapp_number": payload.get("whatsapp_number") or "+2340000000000",
            "location": payload.get("location") or "Not specified",
            "bank_name": payload.get("bank_name") or "First Bank",
            "account_name": payload.get("account_name") or "Business Account",
            "account_number": payload.get("account_number") or "0000000000",
            "accepts_deposit": bool(payload.get("accepts_deposit", True)),
            "payment_mode": payload.get("payment_mode") or "Paystack + Transfer",
            "registration_type": payload.get("registration_type") or "Not registered yet",
            "status": "active",
            "logo_url": payload.get("logo_url") or "",
            "products": payload.get("products") or [
                {
                    "name": "Custom order",
                    "price": 0,
                    "category": "custom",
                    "required_fields": ["product_name", "delivery_date", "delivery_location"],
                }
            ],
            "order_requirements": payload.get("order_requirements") or [
                "product",
                "delivery_date",
                "delivery_location",
                "customer_name",
            ],
            "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
        }
        self.businesses.insert(0, business)
        return business

    def list_leads(self) -> list[dict[str, Any]]:
        return self.leads

    def create_lead(self, payload: dict[str, Any]) -> dict[str, Any]:
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
        lead = {
            "id": f"lead_{len(self.leads) + 2001}",
            "business_id": payload.get("business_id"),
            "customer_name": payload.get("customer_name") or "Customer",
            "customer_phone": payload.get("customer_phone") or "+2340000000000",
            "product_or_service": payload.get("product_or_service") or "General enquiry",
            "amount": payload.get("amount") or 0,
            "status": payload.get("status") or "new",
            "payment_status": payload.get("payment_status") or "pending",
            "order_status": payload.get("order_status") or "new",
            "order_summary": payload.get("order_summary") or "Order not yet structured.",
            "summary": payload.get("summary") or "New customer enquiry received.",
            "conclusion": payload.get("conclusion") or "Waiting for a customer response.",
            "last_message": payload.get("last_message") or "Customer enquiry opened.",
            "missing_fields": payload.get("missing_fields") or [],
            "required_fields": payload.get("required_fields") or [],
            "reminder_at": payload.get("reminder_at"),
            "created_at": now,
            "updated_at": now,
        }
        self.leads.insert(0, lead)
        return lead

    def update_lead(self, lead_id: str, changes: dict[str, Any]) -> dict[str, Any] | None:
        for lead in self.leads:
            if lead["id"] == lead_id:
                lead.update(changes)
                lead["updated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
                return lead
        return None

    def export_leads_csv(self) -> str:
        output = io.StringIO()
        writer = csv.DictWriter(
            output,
            fieldnames=[
                "id",
                "business_name",
                "customer_name",
                "customer_phone",
                "product_or_service",
                "amount",
                "status",
                "payment_status",
                "order_status",
                "missing_fields",
                "summary",
                "conclusion",
                "reminder_at",
                "created_at",
                "updated_at",
            ],
        )
        writer.writeheader()
        for lead in self.leads:
            business = self.get_business(lead["business_id"])
            writer.writerow(
                {
                    "id": lead["id"],
                    "business_name": (business or {}).get("business_name", "Unknown"),
                    "customer_name": lead["customer_name"],
                    "customer_phone": lead["customer_phone"],
                    "product_or_service": lead["product_or_service"],
                    "amount": lead["amount"],
                    "status": lead["status"],
                    "payment_status": lead["payment_status"],
                    "order_status": lead.get("order_status", "new"),
                    "missing_fields": ", ".join(lead.get("missing_fields") or []),
                    "summary": lead["summary"],
                    "conclusion": lead["conclusion"],
                    "reminder_at": lead.get("reminder_at") or "",
                    "created_at": lead.get("created_at", ""),
                    "updated_at": lead.get("updated_at", ""),
                }
            )
        return output.getvalue()


store = FlowaStore()


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "")).strip().lower()


def price_from_text(text: str) -> int:
    matches = re.findall(r"(?:n|ngn|₦)?\s?(\d{3,7})", text.replace(",", ""))
    if matches:
        return int(matches[0])
    return 0


def find_matching_product(business: dict[str, Any], text: str) -> dict[str, Any] | None:
    product_text = normalize_text(text)
    for product in business.get("products", []):
        product_name = normalize_text(str(product.get("name", "")))
        if product_name in product_text or product_text in product_name:
            return product
    return None


def detect_missing_fields(business: dict[str, Any], text: str, product: dict[str, Any] | None) -> list[str]:
    missing: list[str] = []
    required = list(product.get("required_fields", [])) if product else business.get("order_requirements", [])
    lower_text = normalize_text(text)

    if "size" in required and not any(word in lower_text for word in ["6 inch", "6-inch", "8 inch", "8-inch", "10 inch", "10-inch", "12 inch", "12-inch"]):
        missing.append("size")
    if "flavour" in required and not any(word in lower_text for word in ["chocolate", "vanilla", "red velvet", "strawberry", "vanilla"]):
        missing.append("flavour")
    if "design" in required and not any(word in lower_text for word in ["design", "colour", "color", "gold", "navy", "pink", "white", "blue"]):
        missing.append("design")
    if "delivery_location" in required and not any(word in lower_text for word in ["lekki", "ikoyi", "yaba", "surulere", "lagos", "abuja"]):
        missing.append("delivery_location")
    if "delivery_date" in required and not any(word in lower_text for word in ["today", "tomorrow", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]):
        missing.append("delivery_date")
    if "delivery_time" in required and not any(word in lower_text for word in ["am", "pm", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm"]):
        missing.append("delivery_time")
    if "customer_name" in required and "my name" not in lower_text and "i am" not in lower_text:
        missing.append("customer_name")
    return missing


def extract_reminder_datetime(text: str) -> str | None:
    lower = normalize_text(text)
    if any(word in lower for word in ["tomorrow", "next day", "check back tomorrow"]):
        ts = datetime.now(timezone.utc) + timedelta(days=1)
        return ts.strftime("%Y-%m-%dT%H:%M:%S")
    if any(word in lower for word in ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]):
        ts = datetime.now(timezone.utc) + timedelta(days=2)
        return ts.strftime("%Y-%m-%dT%H:%M:%S")
    if any(word in lower for word in ["later", "not ready", "check back", "call me later", "another time"]):
        ts = datetime.now(timezone.utc) + timedelta(days=3)
        return ts.strftime("%Y-%m-%dT%H:%M:%S")
    return None


def build_ai_response(business: dict[str, Any], message: str, lead: dict[str, Any] | None = None) -> tuple[str, dict[str, Any]]:
    text = normalize_text(message)
    customer_name = (lead or {}).get("customer_name") or "Customer"
    product = find_matching_product(business, message)
    amount = (lead or {}).get("amount") or price_from_text(message) or (product or {}).get("price", 0)

    if any(word in text for word in ["i have paid", "i paid", "sent money", "transfer done", "payment sent"]):
        lead_state = {
            "status": "paid",
            "payment_status": "paid",
            "order_status": "paid",
            "conclusion": "Customer has paid and the business should proceed with fulfilment.",
        }
        response = (
            f"Thank you, {customer_name}. We have received your payment. "
            f"Your order is now confirmed and the business can proceed."
        )
        return response, lead_state

    if any(word in text for word in ["not ready", "later", "check back", "call me later", "another time", "maybe later"]):
        reminder_at = extract_reminder_datetime(text)
        lead_state = {
            "status": "follow_up",
            "payment_status": "pending",
            "order_status": "follow_up",
            "reminder_at": reminder_at,
            "conclusion": "Customer is not ready yet and requested a follow-up reminder.",
        }
        response = (
            f"No problem, {customer_name}. We can check back later. "
            f"I will follow up on {reminder_at or 'the scheduled time'} and keep it simple."
        )
        return response, lead_state

    if product:
        missing = detect_missing_fields(business, message, product)
        if missing:
            lead_state = {
                "status": "waiting_for_details",
                "payment_status": "pending",
                "order_status": "awaiting_details",
                "amount": amount,
                "missing_fields": missing,
                "required_fields": missing,
                "conclusion": "Customer has shown interest, but key order details are still missing.",
            }
            response = (
                f"Thanks, {customer_name}. I can help with the {product['name']}. "
                f"To complete this order, I still need: {', '.join(missing)}. "
                f"Once that is confirmed, I will share the total and account details for payment."
            )
            return response, lead_state

        lead_state = {
            "status": "waiting_for_payment",
            "payment_status": "pending",
            "order_status": "payment_pending",
            "amount": amount,
            "missing_fields": [],
            "required_fields": [],
            "conclusion": "The order is ready and the customer is being guided to payment.",
        }
        response = (
            f"Thanks, {customer_name}. Your order is ready for payment. "
            f"The total is ₦{amount}. Please pay into {business.get('account_name', 'Business Account')} - "
            f"{business.get('bank_name', 'Bank')} {business.get('account_number', '0000000000')}. "
            f"Once payment is sent, I will confirm receipt and update the status."
        )
        return response, lead_state

    if any(word in text for word in ["how much", "price", "cost", "what is the price", "quote", "pricing"]):
        lead_state = {
            "status": "interested",
            "payment_status": "pending",
            "order_status": "interest_confirmed",
            "conclusion": "Customer is interested and is asking about the pricing and next step.",
        }
        response = (
            f"Hi {customer_name}, for {business.get('business_name', 'our business')}, the current pricing is "
            f"{business.get('pricing', 'available on request')}. "
            f"If you want to proceed, I can help create the order and share the payment details."
        )
        return response, lead_state

    if any(word in text for word in ["account", "bank", "transfer", "pay", "paystack", "send details"]):
        lead_state = {
            "status": "waiting_for_payment",
            "payment_status": "pending",
            "order_status": "payment_pending",
            "conclusion": "Customer has been given payment instructions and is waiting to complete the payment.",
        }
        response = (
            f"Thanks, {customer_name}. Please pay into {business.get('account_name', 'Business Account')} - "
            f"{business.get('bank_name', 'Bank')} {business.get('account_number', '0000000000')}. "
            f"Once payment is sent, I will confirm receipt and update the order status."
        )
        return response, lead_state

    if business.get("service_type") == "Service provider":
        response = (
            f"Hi {customer_name}, I can help with {business.get('what_they_do', 'your request')}. "
            f"Please tell me what you need and I will guide you to the best next step."
        )
    else:
        response = (
            f"Hi {customer_name}, thank you for contacting {business.get('business_name', 'this business')}. "
            f"Please tell me what you need and I will help you with the order, pricing, and payment details."
        )

    lead_state = {
        "status": "new",
        "payment_status": "pending",
        "order_status": "new",
        "conclusion": "Customer inquiry is still in discussion and needs a next step.",
    }
    return response, lead_state


@app.route("/")
def index() -> str:
    business_summary = {
        "total_businesses": len(store.list_businesses()),
        "active_businesses": sum(1 for business in store.list_businesses() if business.get("status") == "active"),
        "active_leads": sum(1 for lead in store.list_leads() if lead["status"] in {"new", "interested", "waiting_for_payment", "follow_up", "waiting_for_details"}),
        "paid_leads": sum(1 for lead in store.list_leads() if lead["payment_status"] == "paid"),
    }
    return render_template(
        "index.html",
        businesses=store.list_businesses(),
        leads=store.list_leads(),
        summary=business_summary,
    )


@app.route("/api/businesses", methods=["GET"])
def get_businesses():
    return jsonify({"businesses": store.list_businesses()})


@app.route("/api/businesses", methods=["POST"])
def create_business():
    payload = request.get_json(silent=True) or {}
    business = store.create_business(payload)
    return jsonify({"success": True, "business": business})


@app.route("/api/businesses/<business_id>/catalog", methods=["GET"])
def get_business_catalog(business_id: str):
    business = store.get_business(business_id)
    if not business:
        return jsonify({"error": "Business not found"}), 404
    return jsonify({"products": business.get("products", []), "order_requirements": business.get("order_requirements", [])})


@app.route("/api/leads", methods=["GET"])
def get_leads():
    return jsonify({"leads": store.list_leads()})


@app.route("/api/leads", methods=["POST"])
def create_lead():
    payload = request.get_json(silent=True) or {}
    lead = store.create_lead(payload)
    return jsonify({"success": True, "lead": lead})


@app.route("/api/chat", methods=["POST"])
def process_chat():
    payload = request.get_json(silent=True) or {}
    business_id = payload.get("business_id")
    business = store.get_business(business_id)
    if not business:
        return jsonify({"error": "Business not found"}), 404

    customer_name = payload.get("customer_name") or "Customer"
    message = payload.get("message") or ""
    lead_id = payload.get("lead_id")
    existing_lead = next((lead for lead in store.list_leads() if lead["id"] == lead_id), None)

    product = find_matching_product(business, message)
    product_name = product.get("name") if product else payload.get("product_or_service") or "General enquiry"
    amount = (product or {}).get("price", 0) if product else price_from_text(message) or 0
    missing_fields = detect_missing_fields(business, message, product)

    if existing_lead is None:
        lead = store.create_lead(
            {
                "business_id": business_id,
                "customer_name": customer_name,
                "customer_phone": payload.get("customer_phone") or "+2340000000000",
                "product_or_service": product_name,
                "amount": amount,
                "status": "new",
                "payment_status": "pending",
                "order_status": "new",
                "order_summary": product_name if product else "General enquiry",
                "summary": f"Customer {customer_name} reached out via WhatsApp.",
                "conclusion": "Conversation started and needs next action.",
                "last_message": message,
                "missing_fields": missing_fields,
                "required_fields": missing_fields,
            }
        )
    else:
        lead = existing_lead

    ai_message, lead_updates = build_ai_response(business, message, lead)
    lead.update(lead_updates)
    lead["last_message"] = message
    lead["product_or_service"] = product_name if product else str(lead.get("product_or_service") or "General enquiry")
    lead["amount"] = lead.get("amount") or amount
    if missing_fields:
        lead["missing_fields"] = missing_fields
        lead["required_fields"] = missing_fields
    else:
        lead["missing_fields"] = []
        lead["required_fields"] = []
    lead["order_summary"] = (
        f"{lead.get('product_or_service', 'Product')} - amount ₦{lead.get('amount', 0)} - status {lead.get('order_status', 'new')}"
    )
    lead["summary"] = (
        f"Customer {customer_name} discussed {lead.get('product_or_service', 'the offer')}. "
        f"Current status: {lead.get('status', 'new')}. "
        f"Payment status: {lead.get('payment_status', 'pending')}."
    )
    if "reminder_at" in lead_updates:
        lead["reminder_at"] = lead_updates["reminder_at"]
    store.update_lead(lead["id"], lead)

    response = {
        "success": True,
        "business": business,
        "lead": lead,
        "ai_message": ai_message,
    }
    return jsonify(response)


@app.route("/api/reports/export")
def export_report_csv():
    csv_data = store.export_leads_csv()
    response = make_response(csv_data)
    response.headers["Content-Type"] = "text/csv"
    response.headers["Content-Disposition"] = "attachment; filename=flowa_report.csv"
    return response


@app.route("/api/reports")
def export_report_json():
    summary = {
        "businesses": store.list_businesses(),
        "leads": store.list_leads(),
        "totals": {
            "businesses": len(store.list_businesses()),
            "leads": len(store.list_leads()),
            "paid": sum(1 for lead in store.list_leads() if lead["payment_status"] == "paid"),
            "pending": sum(1 for lead in store.list_leads() if lead["payment_status"] == "pending"),
        },
    }
    return jsonify(summary)


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()})


# WhatsApp Webhook Endpoints
@app.route("/api/whatsapp/webhook", methods=["GET"])
def whatsapp_webhook_verify():
    """Verify webhook with WhatsApp"""
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if token == WHATSAPP_WEBHOOK_TOKEN:
        return challenge
    return jsonify({"error": "Invalid token"}), 403


@app.route("/api/whatsapp/webhook", methods=["POST"])
def whatsapp_webhook_receive():
    """Receive messages from WhatsApp"""
    data = request.get_json()

    try:
        # Extract message details
        entry = data.get("entry", [{}])[0]
        changes = entry.get("changes", [{}])[0]
        value = changes.get("value", {})
        messages = value.get("messages", [])

        if not messages:
            return jsonify({"success": True})

        message_data = messages[0]
        from_phone = message_data.get("from")
        message_text = message_data.get("text", {}).get("body", "")
        message_id = message_data.get("id")

        if not from_phone or not message_text:
            return jsonify({"success": True})

        # Extract business from phone number (match with whatsapp_number in business)
        business = None
        for biz in store.list_businesses():
            if biz.get("whatsapp_number") and biz["whatsapp_number"].replace("+", "").endswith(from_phone.replace("+", "")[-10:]):
                business = biz
                break

        if not business:
            # Message not for any business, ignore
            return jsonify({"success": True})

        # Find or create customer
        customer_name = f"Customer_{from_phone[-10:]}"
        existing_lead = next(
            (lead for lead in store.list_leads() if lead["customer_phone"] == from_phone and lead["business_id"] == business["id"]),
            None,
        )

        # Process message through AI
        product = find_matching_product(business, message_text)
        product_name = product.get("name") if product else "General enquiry"
        amount = (product or {}).get("price", 0) if product else price_from_text(message_text) or 0
        missing_fields = detect_missing_fields(business, message_text, product)

        if existing_lead is None:
            lead = store.create_lead(
                {
                    "business_id": business["id"],
                    "customer_name": customer_name,
                    "customer_phone": from_phone,
                    "product_or_service": product_name,
                    "amount": amount,
                    "status": "new",
                    "payment_status": "pending",
                    "order_status": "new",
                    "order_summary": product_name if product else "General enquiry",
                    "summary": f"Customer reached out via WhatsApp.",
                    "conclusion": "Conversation started.",
                    "last_message": message_text,
                    "missing_fields": missing_fields,
                    "required_fields": missing_fields,
                }
            )
        else:
            lead = existing_lead

        # Generate AI response
        ai_message, lead_updates = build_ai_response(business, message_text, lead)
        lead.update(lead_updates)
        lead["last_message"] = message_text
        lead["product_or_service"] = product_name if product else str(lead.get("product_or_service") or "General enquiry")
        lead["amount"] = lead.get("amount") or amount
        lead["updated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
        store.update_lead(lead["id"], lead)

        # Send AI response back via WhatsApp
        send_whatsapp_message(from_phone, ai_message)

        return jsonify({"success": True, "message_id": message_id, "ai_response": ai_message})

    except Exception as e:
        print(f"Webhook error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/whatsapp/test", methods=["POST"])
def whatsapp_test_message():
    """Test endpoint to simulate WhatsApp messages without API setup"""
    payload = request.get_json(silent=True) or {}
    business_id = payload.get("business_id")
    customer_phone = payload.get("customer_phone", "+2348012345678")
    message_text = payload.get("message", "Hi, I want a 10-inch chocolate cake")

    business = store.get_business(business_id)
    if not business:
        return jsonify({"error": "Business not found"}), 404

    # Simulate WhatsApp flow
    customer_name = f"Customer_{customer_phone[-10:]}"
    existing_lead = next(
        (lead for lead in store.list_leads() if lead["customer_phone"] == customer_phone and lead["business_id"] == business_id),
        None,
    )

    product = find_matching_product(business, message_text)
    product_name = product.get("name") if product else "General enquiry"
    amount = (product or {}).get("price", 0) if product else price_from_text(message_text) or 0
    missing_fields = detect_missing_fields(business, message_text, product)

    if existing_lead is None:
        lead = store.create_lead(
            {
                "business_id": business_id,
                "customer_name": customer_name,
                "customer_phone": customer_phone,
                "product_or_service": product_name,
                "amount": amount,
                "status": "new",
                "payment_status": "pending",
                "order_status": "new",
                "order_summary": product_name if product else "General enquiry",
                "summary": f"Test message from {customer_name}.",
                "conclusion": "Test conversation.",
                "last_message": message_text,
                "missing_fields": missing_fields,
                "required_fields": missing_fields,
            }
        )
    else:
        lead = existing_lead

    ai_message, lead_updates = build_ai_response(business, message_text, lead)
    lead.update(lead_updates)
    lead["last_message"] = message_text
    lead["product_or_service"] = product_name if product else str(lead.get("product_or_service") or "General enquiry")
    lead["amount"] = lead.get("amount") or amount
    lead["updated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
    store.update_lead(lead["id"], lead)

    return jsonify({
        "success": True,
        "business": business,
        "lead": lead,
        "ai_message": ai_message,
        "message": "Test message processed successfully",
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
