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

// Interactive ROT/RUT Calculator
const calcConfig = window.SITE_DATA?.calculator || { active: false };
const calcSection = document.getElementById('calcSection');
const calcSlider = document.getElementById('calcSlider');
const calcNumber = document.getElementById('calcNumber');
const calcGross = document.getElementById('calcGross');
const calcSave = document.getElementById('calcSave');
const calcNet = document.getElementById('calcNet');
const calcApplyBtn = document.getElementById('calcApplyBtn');

function formatKr(num) {
  return `${Math.round(num).toLocaleString('sv-SE')} kr`;
}

function updateCalculator(rawVal) {
  const gross = Math.max(0, Number(rawVal) || 0);
  const maxDeduction = calcConfig.maxPerPerson || 50000;
  const deduction = Math.min(gross * (calcConfig.rate || 0.3), maxDeduction);
  const net = gross - deduction;

  if (calcGross) calcGross.textContent = formatKr(gross);
  if (calcSave) calcSave.textContent = `-${formatKr(deduction)}`;
  if (calcNet) calcNet.textContent = formatKr(net);
}

if (calcSection && calcConfig.active) {
  const initialVal = calcConfig.defaultLaborCost || 40000;
  if (calcSlider) calcSlider.value = String(initialVal);
  if (calcNumber) calcNumber.value = String(initialVal);
  updateCalculator(initialVal);

  calcSlider?.addEventListener('input', () => {
    calcNumber.value = calcSlider.value;
    updateCalculator(calcSlider.value);
  });

  calcNumber?.addEventListener('input', () => {
    const v = Math.min(Math.max(Number(calcNumber.value) || 0, 0), 500000);
    if (calcSlider) calcSlider.value = String(Math.min(v, Number(calcSlider.max)));
    updateCalculator(v);
  });

  calcApplyBtn?.addEventListener('click', () => {
    const gross = Number(calcNumber.value) || 0;
    const netText = calcNet.textContent;
    const msgBox = document.getElementById('qMessage');
    if (msgBox) {
      const note = `Uppskattad arbetskostnad enl. kalkylator: ${formatKr(gross)} (${netText} efter ${calcConfig.type || 'ROT'}-avdrag).`;
      if (!msgBox.value.includes('Uppskattad arbetskostnad')) {
        msgBox.value = msgBox.value ? `${note}\n\n${msgBox.value}` : `${note}\n`;
      }
    }
    document.getElementById('offert').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('qName').focus({ preventScroll: true });
  });
} else if (calcSection) {
  calcSection.hidden = true;
}

// Sticky Mobile Action Bar visibility after Hero scroll
const mobileBar = document.querySelector('.mobile-action-bar');
if (mobileBar) {
  const toggleMobileBar = () => {
    mobileBar.classList.toggle('is-visible', window.scrollY > 320);
  };
  window.addEventListener('scroll', toggleMobileBar, { passive: true });
  toggleMobileBar();
}

// Quote Builder validation + Web3Forms direct send OR mailto/clipboard fallback
const quoteForm = document.getElementById('quoteForm');
const formError = document.getElementById('formError');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
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
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const p = collectQuotePayload();
    if (!validatePayload(p)) return;

    const { subject, body } = formatQuoteMessage(p);
    const targetEmail = window.SITE_DATA?.company?.email || 'info@tdbv.se';
    const accessKey = window.SITE_DATA?.formConfig?.web3formsAccessKey?.trim();

    if (accessKey) {
      const origLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Skickar förfrågan...';
      try {
        const resp = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            subject,
            from_name: p.name,
            replyto: p.email || targetEmail,
            message: body,
          }),
        });
        const json = await resp.json();
        if (json.success) {
          formSuccess.textContent = `Tack ${p.name}! Din förfrågan har skickats direkt till ${targetEmail}.`;
          formSuccess.hidden = false;
          quoteForm.reset();
        } else {
          throw new Error(json.message || 'Web3Forms error');
        }
      } catch {
        formError.textContent = `Kunde inte skicka direkt just nu – prova knappen "Kopiera färdig förfrågan" eller ring ${window.SITE_DATA?.company?.phoneDisplay}.`;
        formError.hidden = false;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = origLabel;
      }
      return;
    }

    // Fallback when no Web3Forms key is configured yet (demo mode)
    window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formSuccess.textContent = `Ditt e-postprogram öppnas nu med ett färdigt mejl till ${targetEmail}. (Tips: Om du använder webbmejl, tryck på "Kopiera färdig förfrågan" nedan.)`;
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
      formSuccess.textContent = `Texten är kopierad! Klistra in i ditt mejl eller SMS till ${targetEmail} / ${window.SITE_DATA?.company?.phoneDisplay || '0730-982 983'}.`;
      formSuccess.hidden = false;
    } catch {
      formError.textContent = `Kunde inte kopiera automatiskt – skicka ditt mejl direkt till ${targetEmail}.`;
      formError.hidden = false;
    }
  });
}
