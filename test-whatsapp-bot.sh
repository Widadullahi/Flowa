#!/bin/bash

# FLOWA WhatsApp Bot Test Script
# Simulate customer messages without Meta API setup

API_URL="http://localhost:5000"
BUSINESS_ID="biz_1001"

echo "🤖 FLOWA WhatsApp Bot Simulator"
echo "================================"
echo ""
echo "Testing with 5 different messages..."
echo ""

# Test 1: Asking for a cake
echo "📱 Test 1: Customer asking for cake"
curl -s -X POST "$API_URL/api/whatsapp/test" \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "customer_phone": "+2348012345678",
    "message": "Hi, I want a 10-inch chocolate cake for Saturday. Navy and gold colors please"
  }' | python3 -m json.tool
echo ""

# Test 2: Asking about missing details
echo "📱 Test 2: Customer providing more details"
curl -s -X POST "$API_URL/api/whatsapp/test" \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "customer_phone": "+2348012345678",
    "message": "Delivery should be at 2pm in Lekki"
  }' | python3 -m json.tool
echo ""

# Test 3: Payment confirmation
echo "📱 Test 3: Customer sends payment"
curl -s -X POST "$API_URL/api/whatsapp/test" \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "'$BUSINESS_ID'",
    "customer_phone": "+2348012345678",
    "message": "I have sent the money. Please proceed"
  }' | python3 -m json.tool
echo ""

# Test 4: Different business
echo "📱 Test 4: Customer from tailor business"
curl -s -X POST "$API_URL/api/whatsapp/test" \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "biz_1002",
    "customer_phone": "+2349012345678",
    "message": "How much for a 3-piece suit? I need it for wedding in December"
  }' | python3 -m json.tool
echo ""

# Test 5: New customer
echo "📱 Test 5: New customer inquiry"
curl -s -X POST "$API_URL/api/whatsapp/test" \
  -H "Content-Type: application/json" \
  -d '{
    "business_id": "biz_1003",
    "customer_phone": "+2347054321098",
    "message": "Do you have availability for engagement shoot next month?"
  }' | python3 -m json.tool
echo ""

echo "✅ Tests complete!"
echo ""
echo "Check your dashboard at: http://localhost:5000"
echo "All conversations are logged and visible there"
