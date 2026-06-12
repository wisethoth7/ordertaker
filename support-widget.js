// ═══════════════════════════════════════════════════
// OrderTaker — Customer & Tech Support Chat Widget
// Nile Dreams Digital
// ═══════════════════════════════════════════════════
(function () {
  const css = `
  .ot-support-fab {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    width: 56px; height: 56px; border-radius: 50%;
    background: #FF6B35; color: #1a0a00;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; cursor: pointer; border: none;
    box-shadow: 0 6px 20px rgba(255,107,53,0.4);
    transition: transform .2s;
  }
  .ot-support-fab:hover { transform: scale(1.08); }
  .ot-support-panel {
    position: fixed; bottom: 92px; right: 24px; z-index: 9999;
    width: 340px; max-width: calc(100vw - 32px); max-height: 480px;
    background: #1A0E08; border: 1px solid rgba(255,107,53,0.2);
    border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    display: none; flex-direction: column; overflow: hidden;
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
  }
  .ot-support-panel.open { display: flex; }
  .ot-support-header {
    background: linear-gradient(90deg,#E0541F,#FF6B35); color: #1a0a00;
    padding: 14px 16px; font-weight: 800; font-size: 14px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .ot-support-header .ot-close { cursor: pointer; font-size: 18px; opacity: .7; }
  .ot-support-header .ot-close:hover { opacity: 1; }
  .ot-support-body { flex: 1; overflow-y: auto; padding: 14px 16px; color: #FFF5EE; font-size: 13px; }
  .ot-msg { margin-bottom: 12px; line-height: 1.5; }
  .ot-msg.bot { background: #220F08; border: 1px solid rgba(255,107,53,0.15); border-radius: 10px; padding: 10px 12px; }
  .ot-msg.bot .ot-label { color: #FF6B35; font-weight: 800; font-size: 10px; letter-spacing: .5px; margin-bottom: 4px; display:block }
  .ot-quick-replies { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .ot-quick-reply {
    background: #220F08; border: 1px solid rgba(255,107,53,0.25); color: #FF6B35;
    border-radius: 16px; padding: 6px 12px; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all .15s;
  }
  .ot-quick-reply:hover { background: #FF6B35; color: #1a0a00; }
  .ot-support-footer {
    border-top: 1px solid rgba(255,107,53,0.15); padding: 12px 16px;
    font-size: 11px; color: #A8897A; text-align: center;
  }
  .ot-support-footer a { color: #FF6B35; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const RESPONSES = {
    'pricing': "OrderTaker is <strong>$199/month per restaurant</strong> — unlimited simultaneous calls, orders, reservations, after-hours pre-orders, owner/staff alerts, and the kitchen dashboard included. Have multiple locations? Each additional one is 15% off ($169.15/month).",
    'signup': "Great! Tap the \"Get OrderTaker — $199/month\" button on this page and our team will reach out to get your restaurant set up within 24 hours.",
    'setup': "Setup takes about 24 hours: sign up online, we train the AI on your menu and policies, then you forward your existing phone number to us. No new hardware needed.",
    'pos': "OrderTaker works with <strong>any restaurant out of the box</strong> — no POS integration required. Orders show up on your tablet dashboard instantly. Direct Toast & Square integration is coming soon at no extra charge.",
    'languages': "OrderTaker currently answers in <strong>English, Spanish, and Arabic</strong>, automatically detecting the caller's language. More languages available on request.",
    'human': "No problem — leave a quick reply here describing what you need, or use the \"Get OrderTaker\" button on this page and a real person from our team will follow up with you directly.",
    'default': "Thanks for your message! Our team typically responds within one business day. In the meantime, here are some common topics:"
  };

  function buildWidget() {
    const fab = document.createElement('button');
    fab.className = 'ot-support-fab';
    fab.setAttribute('aria-label', 'Customer support');
    fab.innerHTML = '💬';

    const panel = document.createElement('div');
    panel.className = 'ot-support-panel';
    panel.innerHTML = `
      <div class="ot-support-header">
        <span>OrderTaker Support</span>
        <span class="ot-close">✕</span>
      </div>
      <div class="ot-support-body" id="ot-support-body">
        <div class="ot-msg bot">
          <span class="ot-label">SUPPORT AGENT</span>
          👋 Hi! I'm the OrderTaker support assistant. Ask me about pricing, setup, POS compatibility, languages, or anything else — and I'll get a human involved if needed.
          <div class="ot-quick-replies">
            <span class="ot-quick-reply" data-q="pricing">Pricing</span>
            <span class="ot-quick-reply" data-q="setup">Setup process</span>
            <span class="ot-quick-reply" data-q="pos">POS compatibility</span>
            <span class="ot-quick-reply" data-q="languages">Languages</span>
            <span class="ot-quick-reply" data-q="signup">Get started</span>
            <span class="ot-quick-reply" data-q="human">Talk to a human</span>
          </div>
        </div>
      </div>
      <div class="ot-support-footer">
        We typically respond within one business day.
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    fab.addEventListener('click', () => panel.classList.toggle('open'));
    panel.querySelector('.ot-close').addEventListener('click', () => panel.classList.remove('open'));

    panel.addEventListener('click', (e) => {
      const qr = e.target.closest('.ot-quick-reply');
      if (!qr) return;
      const key = qr.dataset.q;
      const body = document.getElementById('ot-support-body');

      // Add user message
      const userMsg = document.createElement('div');
      userMsg.className = 'ot-msg';
      userMsg.style.textAlign = 'right';
      userMsg.style.color = '#FF6B35';
      userMsg.style.fontWeight = '700';
      userMsg.textContent = qr.textContent;
      body.appendChild(userMsg);

      // Add bot response
      const botMsg = document.createElement('div');
      botMsg.className = 'ot-msg bot';
      botMsg.innerHTML = `<span class="ot-label">SUPPORT AGENT</span>${RESPONSES[key] || RESPONSES.default}`;
      body.appendChild(botMsg);

      body.scrollTop = body.scrollHeight;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
