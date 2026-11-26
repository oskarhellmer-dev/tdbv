/**
 * Konfigurationsdata för TD Bygg & VS (tdbv.se) — även utformad som komplett mall.
 */
window.SITE_DATA = {
  company: {
    name: "TD Bygg & VS",
    shortName: "TDBV",
    founded: "2009",
    email: "info@tdbv.se",
    phoneDisplay: "0730-982 983",
    phoneHref: "tel:+46730982983",
    city: "661 32 Säffle"
  },
  // Sätt in kundens gratis Web3Forms-nyckel vid köp för direktutskick utan e-postklient:
  formConfig: {
    web3formsAccessKey: ""
  },
  // Interaktiv skattereduktions-kalkylator (ROT = 0.30, RUT = 0.50, active = false för att dölja)
  calculator: {
    active: true,
    type: "ROT",
    rate: 0.30,
    maxPerPerson: 50000,
    defaultLaborCost: 40000
  },
  serviceTabs: {
    nybygge: {
      label: "Nybygge & Tillbygg",
      title: "Nybyggnation, tillbyggnader, altan & snickeri",
      badge: "Helhetslösning från start till mål",
      desc: "Vi arbetar med helhetslösningar och har bred kompetens inom både stora och små byggprojekt – från takstolar och stomresning till altaner, pergolor, fasader och finsnickeri.",
      bullets: [
        "Nybyggnation och tillbyggen anpassade efter dina önskemål",
        "Altanbygge, pergola, uterum, förråd och staket",
        "Fasadrenovering, fönsterbyten och utvändigt snickeri",
        "Inget är för stort, smått eller omöjligt"
      ],
      quoteOption: "Nybyggnation / Tillbyggnad"
    },
    badrum: {
      label: "Badrum (BKR)",
      title: "Badrumsrenovering & plattsättning med BKR-behörighet",
      badge: "Behörig Våtrum · Byggkeramikrådet",
      desc: "Vi är behöriga enligt Byggkeramikrådet (BKR) och utför kompletta badrumsrenoveringar, tätskikt och plattsättning av kakel och klinker enligt branschreglerna.",
      bullets: [
        "Behörig våtrumsentreprenör enligt Byggkeramikrådet (BKR)",
        "Plattsättning av kakel, klinker och natursten",
        "Golvvärme och helhetsansvar för badrumsrenoveringen",
        "Tryggt fackmannamässigt utförande från rivning till fog"
      ],
      quoteOption: "Badrum / Plattsättning (BKR)"
    },
    vvs: {
      label: "VVS & Värme",
      title: "Värmesystem & VVS-installationer",
      badge: "Helhetslösningar inom Bygg & VVS",
      desc: "Med både bygg- och VS-kompetens samt nära samarbete med Smart VVS AB löser vi allt som rör värme, vatten och rördragningar smidigt i samma projekt.",
      bullets: [
        "Installation och uppgradering av värmesystem",
        "VVS-arbeten vid nybygge, köks- och badrumsrenovering",
        "Nära samarbete med Smart VVS AB",
        "Smidig samordning så du slipper jaga flera firmor"
      ],
      quoteOption: "VVS / Värme"
    },
    koktak: {
      label: "Kök, Tak & Renovering",
      title: "Köksmontering, takläggning & invändig renovering",
      badge: "Din personliga hantverkare",
      desc: "Dags att byta tak, renovera köket eller fräscha upp invändigt? Vi tar hand om allt från råspont och takomläggning till köksmontering och ytskikt.",
      bullets: [
        "Takomläggning, råspont, papp, läkt och takpannor/plåt",
        "Köksrenovering och montering av nytt kök",
        "Invändig ombyggnad, golv, väggar och snickerier",
        "Kvalitetsmaterial från bl.a. Optimera och Ahlsell"
      ],
      quoteOption: "Kök / Tak / Renovering"
    },
    referenser: {
      label: "Referensobjekt",
      title: "Företaget startade 2009 och har gott om referensobjekt",
      badge: "Säffle med omnejd",
      desc: "Vi låter våra färdiga jobb tala för sig själva. Här på sidan ser du ett axplock av våra tidigare projekt – och vill ni ha fler referenser innan ni bestämmer er så ordnar vi det självklart.",
      bullets: [
        "Över 15 års erfarenhet i Säffle med omnejd (sedan 2009)",
        "Referensbilder från takstolsresning, takläggning, altan & fasad",
        "Personlig kontakt direkt med din hantverkare",
        "Fler referenser lämnas på förfrågan"
      ],
      quoteOption: "Annan förfrågan / Rådgivning"
    }
  }
};
