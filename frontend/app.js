const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '')
  ? 'http://localhost:8000'
  : 'https://your-backend.onrender.com';

let resumeBlobUrl = null;

// ===== Scroll Animations =====
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.anim-s').forEach(el => obs.observe(el));

// ===== Scroll Progress Bar =====
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ===== Back to Top =====
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Active Nav on Scroll =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
sections.forEach(s => navObs.observe(s));

// ===== Card Hover Glow =====
document.querySelectorAll('.project-card, .exp-card, .metric').forEach(card => {
  card.classList.add('glow-card');
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left - 150) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top - 150) + 'px');
  });
});

// ===== Hamburger =====
const ham = document.getElementById('hamburger');
const links = document.getElementById('nav-links');
ham.addEventListener('click', () => {
  ham.classList.toggle('active');
  links.classList.toggle('open');
  document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('active');
  links.classList.remove('open');
  document.body.style.overflow = '';
}));

// ===== Modal =====
let currentTab = 'generate';

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.modal-tab').forEach((t, i) => t.classList.toggle('active', i === (tab === 'generate' ? 0 : 1)));
  document.getElementById('gen-actions').classList.toggle('hidden', tab !== 'generate');
  document.getElementById('ats-actions').classList.toggle('hidden', tab !== 'ats');
  document.getElementById('tab-desc').textContent = tab === 'generate'
    ? "Paste a job description. I'll tailor my resume to match — same format, optimized keywords."
    : "Paste a job description to check how well your profile matches — keywords, gaps, and tips.";
}

function openModal() {
  document.getElementById('modal-overlay').classList.add('active');
  document.getElementById('gen-done').classList.add('hidden');
  document.getElementById('gen-loading').classList.add('hidden');
  document.getElementById('gen-btn').classList.remove('hidden');
  document.getElementById('ats-result').classList.add('hidden');
  document.getElementById('ats-loading').classList.add('hidden');
  document.getElementById('ats-btn').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  if (resumeBlobUrl) { URL.revokeObjectURL(resumeBlobUrl); resumeBlobUrl = null; }
}

async function generateResume() {
  const jd = document.getElementById('jd-input').value.trim();
  if (!jd) return alert('Paste a job description first.');
  document.getElementById('gen-btn').classList.add('hidden');
  document.getElementById('gen-loading').classList.remove('hidden');
  try {
    const res = await fetch(`${API_BASE}/api/generate-resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description: jd }),
    });
    if (!res.ok) throw new Error();
    resumeBlobUrl = URL.createObjectURL(await res.blob());
    document.getElementById('gen-loading').classList.add('hidden');
    document.getElementById('gen-done').classList.remove('hidden');
  } catch {
    document.getElementById('gen-loading').classList.add('hidden');
    document.getElementById('gen-btn').classList.remove('hidden');
    alert('Error — is the backend running?');
  }
}

function downloadResume() {
  if (!resumeBlobUrl) return;
  Object.assign(document.createElement('a'), { href: resumeBlobUrl, download: 'Mritunjay_Resume.pdf' }).click();
}

async function checkATS() {
  const jd = document.getElementById('jd-input').value.trim();
  if (!jd) return alert('Paste a job description first.');
  document.getElementById('ats-btn').classList.add('hidden');
  document.getElementById('ats-loading').classList.remove('hidden');
  try {
    const res = await fetch(`${API_BASE}/api/ats-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description: jd }),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    const cls = data.score >= 75 ? 'high' : data.score >= 50 ? 'mid' : 'low';
    document.getElementById('ats-result').innerHTML = `
      <div class="ats-score-ring">
        <div class="ats-score-num ${cls}">${data.score}</div>
        <div class="ats-label">ATS Match Score</div>
      </div>
      <div class="ats-section">
        <h4>✅ Matched Keywords</h4>
        <div class="ats-chips">${data.matched_keywords.map(k => `<span class="matched">${k}</span>`).join('')}</div>
      </div>
      <div class="ats-section">
        <h4>❌ Missing Keywords</h4>
        <div class="ats-chips">${data.missing_keywords.map(k => `<span class="missing">${k}</span>`).join('')}</div>
      </div>
      <div class="ats-section">
        <h4>💡 Suggestions</h4>
        <ul class="ats-tips">${data.suggestions.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>`;
    document.getElementById('ats-loading').classList.add('hidden');
    document.getElementById('ats-result').classList.remove('hidden');
  } catch {
    document.getElementById('ats-loading').classList.add('hidden');
    document.getElementById('ats-btn').classList.remove('hidden');
    alert('Error — is the backend running?');
  }
}
