// Theme Toggle
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;

function initTheme() {
  if (isDarkMode) {
    document.documentElement.classList.add('dark-mode');
    document.getElementById('themeToggle').textContent = '☀️';
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
}

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
initTheme();

// Utility: Show loading state on button
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

// Utility: Show toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#0d8d59' : '#1ea95f'};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    max-width: 320px;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

const onboardingForm = document.getElementById('onboardingForm');
const businessSelect = document.getElementById('businessSelect');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatResponse = document.getElementById('chatResponse');

function serializeForm(form) {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  payload.accepts_deposit = formData.get('accepts_deposit') === 'on';
  return payload;
}

async function refreshBusinesses() {
  try {
    const response = await fetch('/api/businesses');
    const result = await response.json();
    const select = document.getElementById('businessSelect');
    if (!select || !result.businesses) return;

    select.innerHTML = result.businesses
      .map((business) => `<option value="${business.id}">${business.business_name}</option>`)
      .join('');
  } catch (error) {
    console.error('Error refreshing businesses:', error);
    showToast('Failed to refresh businesses', 'error');
  }
}

onboardingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitBtn = onboardingForm.querySelector('button[type="submit"]');
  
  try {
    setButtonLoading(submitBtn, true);
    const payload = serializeForm(onboardingForm);

    const response = await fetch('/api/businesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.success) {
      showToast(`Business "${payload.business_name}" created successfully!`, 'success');
      onboardingForm.reset();
      await refreshBusinesses();
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showToast('Failed to create business', 'error');
    }
  } catch (error) {
    console.error('Error creating business:', error);
    showToast('Error creating business', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
});

sendChatBtn?.addEventListener('click', async () => {
  const businessId = document.getElementById('businessSelect')?.value;
  const customerName = document.getElementById('customerName')?.value || 'Customer';
  const customerPhone = document.getElementById('customerPhone')?.value || '+2340000000000';
  const message = document.getElementById('customerMessage')?.value || '';

  if (!message.trim()) {
    showToast('Please enter a message', 'error');
    return;
  }

  try {
    setButtonLoading(sendChatBtn, true);
    chatResponse.classList.add('empty');
    chatResponse.textContent = 'Processing message...';

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
        <div class="chat-bubble">
          <strong>🤖 AI Response:</strong>
          <p>${result.ai_message}</p>
        </div>
        <div class="chat-bubble" style="font-size: 0.85rem; margin-top: 12px;">
          <strong>📊 Status:</strong> ${result.lead.status}<br />
          <strong>💳 Payment:</strong> ${result.lead.payment_status}<br />
          <strong>⏰ Reminder:</strong> ${result.lead.reminder_at || 'Not scheduled'}
        </div>
      `;
      showToast('Message processed successfully!', 'success');
    } else {
      chatResponse.classList.add('empty');
      chatResponse.textContent = 'No response from AI. Please try again.';
    }
  } catch (error) {
    console.error('Error sending chat:', error);
    chatResponse.classList.add('empty');
    chatResponse.textContent = 'Error: Failed to process message';
    showToast('Error processing message', 'error');
  } finally {
    setButtonLoading(sendChatBtn, false);
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  await refreshBusinesses();
});
