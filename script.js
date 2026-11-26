// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');

if (menuBtn && mainNav) {
  menuBtn.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Render interactive service tabs from window.SITE_DATA
const tabsData = window.SITE_DATA?.serviceTabs || {};
const tabKeys = Object.keys(tabsData);
const routerTabs = document.getElementById('routerTabs');
const rpTitle = document.getElementById('rpTitle');
const rpBadge = document.getElementById('rpBadge');
const rpDesc = document.getElementById('rpDesc');
const rpBullets = document.getElementById('rpBullets');
const rpQuoteBtn = document.getElementById('rpQuoteBtn');

let activeTabKey = tabKeys[0] || '';

function setActiveTab(key) {
  const item = tabsData[key];
  if (!item) return;
  activeTabKey = key;

  routerTabs.querySelectorAll('.router-tab').forEach((btn) => {
    const selected = btn.dataset.key === key;
    btn.classList.toggle('is-active', selected);
    btn.setAttribute('aria-selected', String(selected));
  });

  rpTitle.textContent = item.title;
  rpBadge.textContent = item.badge;
  rpDesc.textContent = item.desc;
  rpBullets.innerHTML = item.bullets.map((b) => `<li>${b}</li>`).join('');
  if (rpQuoteBtn) {
    rpQuoteBtn.dataset.quoteOption = item.quoteOption;
  }
}

if (routerTabs && tabKeys.length > 0) {
  routerTabs.innerHTML = tabKeys
    .map((key, idx) => {
      const item = tabsData[key];
      return `<button type="button" class="router-tab${idx === 0 ? ' is-active' : ''}" role="tab" aria-selected="${idx === 0}" data-key="${key}">${item.label}</button>`;
    })
    .join('');

  routerTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.router-tab');
    if (btn) setActiveTab(btn.dataset.key);
  });

  setActiveTab(activeTabKey);
}

// Pre-select topic in quote builder
function preselectTopicAndScroll(topicValue) {
  const quoteForm = document.getElementById('quoteForm');
  if (!quoteForm) return;
  const checkbox = quoteForm.querySelector(`input[name="topics"][value="${topicValue}"]`);
  if (checkbox) checkbox.checked = true;
  document.getElementById('offert').scrollIntoView({ behavior: 'smooth' });
  document.getElementById('qName').focus({ preventScroll: true });
}

if (rpQuoteBtn) {
  rpQuoteBtn.addEventListener('click', () => {
    preselectTopicAndScroll(rpQuoteBtn.dataset.quoteOption);
  });
}

document.querySelectorAll('[data-preset]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    preselectTopicAndScroll(el.dataset.preset);
  });
});

// Quote Builder validation + mailto/clipboard export
const quoteForm = document.getElementById('quoteForm');
const formError = document.getElementById('formError');
const formSuccess = document.getElementById('formSuccess');
const copyQuoteBtn = document.getElementById('copyQuoteBtn');

function collectQuotePayload() {
  const name = document.getElementById('qName').value.trim();
  const phone = document.getElementById('qPhone').value.trim();
  const email = document.getElementById('qEmail').value.trim();
  const address = document.getElementById('qAddress').value.trim();
  const date = document.getElementById('qDate').value.trim();
  const message = document.getElementById('qMessage').value.trim();
  const checked = Array.from(quoteForm.querySelectorAll('input[name="topics"]:checked')).map((el) => el.value);

  return { name, phone, email, address, date, message, checked };
}

function formatQuoteMessage(p) {
  const topicsText = p.checked.length ? p.checked.join(', ') : 'Bygg & VVS-förfrågan';
  return {
    subject: `Förfrågan: ${topicsText} (${p.name})`,
    body: [
      `Namn: ${p.name}`,
      `Telefon: ${p.phone}`,
      p.email ? `E-post: ${p.email}` : null,
      p.address ? `Adress ärendet gäller: ${p.address}` : null,
      p.date ? `Önskat datum: ${p.date}` : null,
      `Valda tjänster: ${topicsText}`,
      '',
      'Beskrivning:',
      p.message,
    ]
      .filter((line) => line !== null)
      .join('\n'),
  };
}

function validatePayload(p) {
  if (!p.name || !p.phone || !p.message) {
    formSuccess.hidden = true;
    formError.textContent = 'Fyll i namn, telefonnummer och en kort beskrivning av ärendet innan du skickar.';
    formError.hidden = false;
    return false;
  }
  formError.hidden = true;
  return true;
}

if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const p = collectQuotePayload();
    if (!validatePayload(p)) return;

    const { subject, body } = formatQuoteMessage(p);
    const targetEmail = window.SITE_DATA?.company?.email || 'info@tdbv.se';
    window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formSuccess.textContent = `Ditt e-postprogram öppnas nu med ett färdigt mejl till ${targetEmail}. Om inget händer kan du trycka på "Kopiera färdig förfrågan" nedan.`;
    formSuccess.hidden = false;
  });
}

if (copyQuoteBtn && quoteForm) {
  copyQuoteBtn.addEventListener('click', async () => {
    const p = collectQuotePayload();
    if (!validatePayload(p)) return;

    const { subject, body } = formatQuoteMessage(p);
    const targetEmail = window.SITE_DATA?.company?.email || 'info@tdbv.se';
    const fullText = `Till: ${targetEmail}\nÄmne: ${subject}\n\n${body}`;

    try {
      await navigator.clipboard.writeText(fullText);
      formSuccess.textContent = `Texten är kopierad! Klistra in i ditt mejl eller SMS till ${targetEmail} / 0730-982 983.`;
      formSuccess.hidden = false;
    } catch {
      formError.textContent = `Kunde inte kopiera automatiskt – skicka ditt mejl direkt till ${targetEmail}.`;
      formError.hidden = false;
    }
  });
}
