const conversationInput = document.getElementById('conversationInput');
const parseBtn = document.getElementById('parseBtn');
const confirmBtn = document.getElementById('confirmBtn');
const parseResult = document.getElementById('parseResult');
const onboardingForm = document.getElementById('onboardingForm');
const businessSelect = document.getElementById('businessSelect');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatResponse = document.getElementById('chatResponse');

function renderParsedResult(data) {
  if (!data || !data.items || data.items.length === 0) {
    parseResult.classList.add('empty');
    parseResult.textContent = 'No order details detected yet.';
    return;
  }

  parseResult.classList.remove('empty');
  const missing = data.missing_fields && data.missing_fields.length ? data.missing_fields : ['none'];
  const summary = [
    `Customer: ${data.customer}`,
    `Items: ${data.items.map(item => item.name).join(', ')}`,
    `Delivery: ${data.delivery.location} / ${data.delivery.date} / ${data.delivery.time || 'Time missing'}`,
    `Estimated amount: ₦${Number(data.amount || 0).toLocaleString()}`,
    `Missing fields: ${missing.join(', ')}`,
  ].join('\n');

  parseResult.textContent = summary;
}

parseBtn.addEventListener('click', async () => {
  const message = conversationInput.value.trim();
  if (!message) {
    parseResult.classList.remove('empty');
    parseResult.textContent = 'Paste a WhatsApp conversation to extract the order.';
    return;
  }

  const response = await fetch('/api/parse-conversation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  const result = await response.json();
  renderParsedResult(result.data);
  window.latestParsedOrder = result.data;
});

confirmBtn.addEventListener('click', async () => {
  const payload = window.latestParsedOrder || {
    customer: 'New customer',
    items: [{ name: 'Custom order' }],
    delivery: { location: 'N/A', date: 'N/A', time: null },
    amount: 0,
    missing_fields: ['delivery_time'],
  };

  const response = await fetch('/api/confirm-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  parseResult.classList.remove('empty');
  parseResult.textContent = `Order ${result.order.id} created successfully.\nStatus: ${result.order.status}\nPayment: ${result.order.payment_status}`;
  window.location.reload();
});

function serializeForm(form) {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  payload.accepts_deposit = formData.get('accepts_deposit') === 'on';
  return payload;
}

async function refreshBusinesses() {
  const response = await fetch('/api/businesses');
  const result = await response.json();
  const select = document.getElementById('businessSelect');
  if (!select || !result.businesses) return;

  select.innerHTML = result.businesses
    .map((business) => `<option value="${business.id}">${business.business_name}</option>`)
    .join('');
}

onboardingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = serializeForm(onboardingForm);

  const response = await fetch('/api/businesses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (result.success) {
    onboardingForm.reset();
    await refreshBusinesses();
    window.location.reload();
  }
});

sendChatBtn?.addEventListener('click', async () => {
  const businessId = document.getElementById('businessSelect')?.value;
  const customerName = document.getElementById('customerName')?.value || 'Customer';
  const customerPhone = document.getElementById('customerPhone')?.value || '+2340000000000';
  const message = document.getElementById('customerMessage')?.value || '';

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      business_id: businessId,
      customer_name: customerName,
      customer_phone: customerPhone,
      message,
    }),
  });

  const result = await response.json();
  if (result.ai_message) {
    chatResponse.classList.remove('empty');
    chatResponse.innerHTML = `
      <div class="chat-bubble ai">
        <strong>AI response:</strong>
        <p>${result.ai_message}</p>
      </div>
      <div class="chat-bubble meta">
        <strong>Status:</strong> ${result.lead.status}<br />
        <strong>Payment:</strong> ${result.lead.payment_status}<br />
        <strong>Reminder:</strong> ${result.lead.reminder_at || 'Not scheduled'}
      </div>
    `;
  }

  window.location.reload();
});
