// ── Theme Toggle ──
const toggle = document.getElementById('themeToggle');
const html = document.documentElement;
const saved = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saved);
if (toggle) toggle.textContent = saved === 'dark' ? '☀️' : '🌙';

toggle?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  toggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ── Home: Category Filter ──
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ── Tags: Tag Filter ──
const tagBtns = document.querySelectorAll('.tag-cloud-btn');
const tagPosts = document.querySelectorAll('#tagPosts .post-card');

tagBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tagBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const selected = btn.dataset.tag;
    tagPosts.forEach(card => {
      const tags = card.dataset.tags || '';
      const visible = selected === 'all' || tags.includes(selected);
      card.style.display = visible ? '' : 'none';
    });
  });
});

// ── Login: Tab Switch ──
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

loginTab?.addEventListener('click', () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
});

signupTab?.addEventListener('click', () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
});

// ── Login: Password Toggle ──
document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁' : '🙈';
  });
});

// ── Signup: Password Strength ──
const signupPw = document.getElementById('signupPw');
const pwStrength = document.getElementById('pwStrength');

signupPw?.addEventListener('input', () => {
  const val = signupPw.value;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { width: '0%',   color: '#e3e6ea' },
    { width: '25%',  color: '#EA5B5B' },
    { width: '50%',  color: '#f59e0b' },
    { width: '75%',  color: '#6891f8' },
    { width: '100%', color: '#2ED573' },
  ];
  const level = levels[score];
  pwStrength.style.setProperty('--strength', level.width);
  pwStrength.style.setProperty('--strength-color', level.color);
});

// ── Login Form Submit ──
loginForm?.addEventListener('submit', e => {
  e.preventDefault();
  alert('로그인 기능은 준비 중입니다.');
});

signupForm?.addEventListener('submit', e => {
  e.preventDefault();
  const pw = document.getElementById('signupPw')?.value;
  const confirm = document.getElementById('signupPwConfirm')?.value;
  if (pw !== confirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  alert('회원가입이 완료되었습니다!');
});

// ── About: Contact Form (Formspree) ──
document.querySelector('.contact-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const notice = document.getElementById('formNotice');
  const btn = form.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.textContent = '전송 중...';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      notice.textContent = '✅ 메시지가 전송되었습니다. 감사합니다!';
      notice.style.color = '#2ED573';
      notice.style.display = 'block';
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    notice.textContent = '❌ 전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
    notice.style.color = '#EA5B5B';
    notice.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = '보내기';
  }
});
