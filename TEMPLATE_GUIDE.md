# Återanvändbar Mallguide (Uppdaterad 100/100-version)

Den här mallen innehåller alla konverteringsfunktioner:
- **Layout-växling (`data-layout` i `<body>`):**
  - `data-layout="split"`: Text vänster, foto höger i Hero + tjänsteväljare högt upp.
  - `data-layout="showcase"`: Foto vänster, text höger i Hero + projektgalleri direkt under Hero (perfekt så grannföretag inte ser identiska ut).
- **Interaktiv ROT-/RUT-kalkylator:** Styrs via `window.SITE_DATA.calculator` (`active`, `type: "ROT"|"RUT"`, `rate: 0.30|0.50`).
- **Fast mobil-bar längst ner:** `.mobile-action-bar` syns bara på mobiler (`<= 760px`) med direkt ringknapp + offertknapp.
- **Direktutskick via Web3Forms + `mailto:`/kopiering:** Fyll bara i kundens gratis nyckel från `web3forms.com` under `formConfig.web3formsAccessKey` i `site-data.js` när kunden köper sidan, så går förfrågningar direkt till deras inkorg utan att besökarens mejlprogram behöver öppnas.
- **Äkta bilder (0 % AI):** Hämta alltid kundens riktiga logotyp, certifieringar (t.ex. BKR/GVK), projektfoton och partnerloggor från deras nuvarande sajt, och komplettera vid behov med verifierade CC0/CC-BY-kamerafoton från Wikimedia Commons.

## Steg för att skapa nästa kundsajt på 5 minuter
1. Kopiera hela denna mapp till `C:\Users\oskar\.gemini\antigravity\scratch\<kundnamn>`.
2. Ändra färgvariablerna (`--brand-dark`, `--brand-accent`, `--brand-paper`, `--brand-tint`) överst i `styles.css` så de matchar kundens riktiga logotyp.
3. Byt `data-layout="split"` eller `"showcase"` på `<body>` i `index.html`.
4. Uppdatera `site-data.js` (`company`, `calculator`, `serviceTabs`) och lägg kundens riktiga foton i `assets/`.
5. Kör `impeccable detect` + `first-viewport` och publicera till GitHub Pages.
