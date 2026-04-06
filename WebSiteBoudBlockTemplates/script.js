
/* == Navbar scroll == */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* == Mobile burger == */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* == Reveal on scroll == */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));

// Trigger hero immediately
requestAnimationFrame(() => {
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
});

/* == Animated counters == */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function runCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const val = Math.round(easeOutCubic(progress) * target);
    el.textContent = val.toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(tick);
}

const statNums = document.querySelectorAll('.stat-num[data-target]');
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { runCounter(e.target); statObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObs.observe(el));

/* == FAQ accordion == */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* == Pricing toggle (Monthly / Anual) == */
const billingToggle = document.getElementById('billingToggle');
const monthlyPrices = { starter: 0, pro: 49, };
const annualPrices  = { starter: 0, pro: 39, };

if (billingToggle) {
  billingToggle.addEventListener('change', () => {
    const annual = billingToggle.checked;
    document.querySelectorAll('.monthly-price').forEach((el, i) => {
      const prices = [
        annual ? annualPrices.starter : monthlyPrices.starter,
        annual ? annualPrices.pro     : monthlyPrices.pro,
      ];
      if (i < prices.length) {
        el.textContent = prices[i] === 0 ? '0' : prices[i];
      }
    });
  });
}

/* == Smooth scroll == */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* == Card subtle tilt == */
document.querySelectorAll('.bento-card, .testi-card, .step, .price-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 5;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 5;
    card.style.transform = `translateY(-4px) rotateX(${-y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform 0.08s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
  });
});

/* == Active nav link on scroll == */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--white)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => activeObs.observe(s));

/* == Chat input easter egg == */
const chatInput = document.querySelector('.chat-input-bar input');
const sendBtn   = document.querySelector('.send-btn');
const messagesEl = document.querySelector('.chat-messages');
const typingMsg  = document.querySelector('.typing-msg');

const botReplies = [
  "Great question! Let me look that up for you… 🔍",
  "Of course! I can help with that right away.",
  "I've got all the details you need — here's what I found ✨",
  "Absolutely! Our team typically responds in under 1 minute.",
  "Thanks for reaching out! I'll connect you with the right info.",
];

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;
  const time = document.createElement('span');
  time.className = 'msg-time';
  time.textContent = 'just now';
  msg.appendChild(bubble);
  msg.appendChild(time);
  messagesEl.insertBefore(msg, typingMsg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function sendMessage() {
  const val = chatInput.value.trim();
  if (!val) return;
  addMessage(val, 'user');
  chatInput.value = '';
  typingMsg.style.display = 'flex';
  messagesEl.scrollTop = messagesEl.scrollHeight;
  setTimeout(() => {
    typingMsg.style.display = 'none';
    const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
    addMessage(reply, 'bot');
  }, 1400);
}

if (sendBtn) sendBtn.addEventListener('click', sendMessage);
if (chatInput) {
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
  chatInput.removeAttribute('readonly');
}
