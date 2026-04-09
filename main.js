// ── Cookie Consent ──
(function () {
  if (localStorage.getItem('cookie_consent')) return;

  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.innerHTML = `
    <div style="
      position:fixed;bottom:0;left:0;right:0;z-index:9999;
      background:#1c1c24;color:#e8eaf0;
      padding:1rem 2rem;display:flex;align-items:center;
      justify-content:space-between;gap:1rem;flex-wrap:wrap;
      border-top:2px solid #6891f8;font-family:inherit;font-size:0.9rem;
      box-shadow:0 -4px 20px rgba(0,0,0,0.3);
    ">
      <p style="margin:0;flex:1;min-width:200px;">
        이 사이트는 서비스 개선 및 맞춤형 광고 제공을 위해 쿠키를 사용합니다.
        <a href="/privacy.html" style="color:#6891f8;text-decoration:underline;">개인정보처리방침</a>
      </p>
      <div style="display:flex;gap:0.5rem;flex-shrink:0;">
        <button id="cookieAccept" style="
          background:#6891f8;color:#fff;border:none;
          padding:0.5rem 1.25rem;border-radius:0.4rem;
          cursor:pointer;font-weight:700;font-size:0.875rem;font-family:inherit;
        ">동의</button>
        <button id="cookieDecline" style="
          background:transparent;color:#9ca3af;border:1px solid #4b5563;
          padding:0.5rem 1.25rem;border-radius:0.4rem;
          cursor:pointer;font-size:0.875rem;font-family:inherit;
        ">거부</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookieAccept').addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    banner.remove();
  });
  document.getElementById('cookieDecline').addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'declined');
    banner.remove();
  });
})();

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

// ── Auth Helpers ──
const Auth = {
  USERS_KEY: 'devlog_users',
  SESSION_KEY: 'devlog_session',

  getUsers() {
    try { return JSON.parse(localStorage.getItem(this.USERS_KEY)) || []; }
    catch { return []; }
  },
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },
  getSession() {
    try { return JSON.parse(sessionStorage.getItem(this.SESSION_KEY)); }
    catch { return null; }
  },
  setSession(user) {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
  },
  clearSession() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },
  // 단방향 해시 (간단 demo — 실서비스엔 bcrypt 등 사용)
  hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    return h.toString(16);
  },
};

// ── Header: 로그인 상태 반영 ──
function updateHeaderAuth() {
  const session = Auth.getSession();
  const loginBtn = document.querySelector('.btn-login');
  if (!loginBtn) return;

  if (session) {
    const chip = document.createElement('div');
    chip.className = 'user-chip';
    chip.innerHTML = `
      <span class="user-chip-avatar">${session.name.charAt(0)}</span>
      <span class="user-chip-name">${session.name}</span>
      <button class="btn-logout" id="logoutBtn">로그아웃</button>
    `;
    loginBtn.replaceWith(chip);
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      Auth.clearSession();
      location.reload();
    });
  }
}
updateHeaderAuth();

// ── 폼 알림 헬퍼 ──
function showFormMsg(el, msg, isError = false) {
  if (!el) return;
  el.textContent = msg;
  el.style.cssText = `display:block;margin-top:0.75rem;padding:0.65rem 1rem;border-radius:0.4rem;
    font-size:0.875rem;font-weight:600;
    background:${isError ? '#fef2f2' : '#f0fdf4'};
    color:${isError ? '#dc2626' : '#16a34a'};
    border:1px solid ${isError ? '#fecaca' : '#bbf7d0'};`;
}

// ── Login Form Submit ──
loginForm?.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail')?.value.trim();
  const pw    = document.getElementById('loginPw')?.value;
  const msg   = document.getElementById('loginMsg');

  const users = Auth.getUsers();
  const user  = users.find(u => u.email === email && u.password === Auth.hash(pw));

  if (!user) {
    showFormMsg(msg, '이메일 또는 비밀번호가 올바르지 않습니다.', true);
    return;
  }

  Auth.setSession(user);
  showFormMsg(msg, `${user.name}님, 환영합니다! 잠시 후 이동합니다.`);
  setTimeout(() => location.href = '/index.html', 1200);
});

// ── Signup Form Submit ──
signupForm?.addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('signupName')?.value.trim();
  const email   = document.getElementById('signupEmail')?.value.trim();
  const pw      = document.getElementById('signupPw')?.value;
  const confirm = document.getElementById('signupPwConfirm')?.value;
  const msg     = document.getElementById('signupMsg');

  if (pw !== confirm) {
    showFormMsg(msg, '비밀번호가 일치하지 않습니다.', true);
    return;
  }
  if (pw.length < 8) {
    showFormMsg(msg, '비밀번호는 8자 이상이어야 합니다.', true);
    return;
  }

  const users = Auth.getUsers();
  if (users.find(u => u.email === email)) {
    showFormMsg(msg, '이미 사용 중인 이메일입니다.', true);
    return;
  }

  const newUser = { name, email, password: Auth.hash(pw), createdAt: new Date().toISOString() };
  users.push(newUser);
  Auth.saveUsers(users);
  Auth.setSession(newUser);

  showFormMsg(msg, `${name}님, 가입을 환영합니다! 잠시 후 이동합니다.`);
  setTimeout(() => location.href = '/index.html', 1200);
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
