# Intensivstation Ratgeber - Fertige Website

## ✅ Was ist enthalten?
- **Vollständige Website** mit 51 Frageseiten
- **Optimierte Index** mit korrigiertem Header
- **Kompakte Sidebar-Boxen** (Bundle sofort sichtbar!)
- **Cookie-Consent** funktionsfähig
- **15 Jahre Erfahrung** durchgehend korrekt
- **Ready for Upload & Ads**

## 📁 Dateistruktur
```
/
├── index.html (Startseite - OPTIMIERT)
├── css/
│   └── style.css (OPTIMIERT - kompakte Boxen)
├── js/
│   ├── cookie-consent.js
│   ├── goatcounter-init.js
│   └── disclaimer-loader.js
├── fragen/ (51 Seiten - ALLE vorhanden!)
├── head.png (Profilbild - 5% größer)
├── impressum.html
├── datenschutz.html
├── widerruf.html
├── agb.html
├── fuer-mitarbeiter.html
├── ueber-mich.html
├── send-email.php
└── Leseproben

## 📚 Bücher und PDFs pflegen (seit November 2026)

Alle eigenen Bücher und PDFs stehen an **einer** Stelle: `bibliothek/produkte.json`.

- **Neues Buch:** einen Eintrag in `"produkte"` anlegen (Vorlage: ein bestehender Eintrag), Cover als JPG nach `bilder/buecher/` legen.
- **Welches Buch in welchem Artikel:** unter `"artikel"` den Dateinamen der Frageseite und bis zu 2 Produkt-IDs eintragen.
- **Sprachausgaben:** unter `"ausgaben"` beim deutschen Buch (kleine Zeile „Auch erhältlich auf“). Eine eigene Karte auf der TR/PL/RU-Seite bekommt ein Buch mit `"seiten": ["tr"]`, `"vorn": ["tr"]` und `"ausgabe_von"`.

Nach dem Speichern baut die Action **„Bibliothek-Produkte und Buchtipps“** alles neu:
Bibliothek (DE/PL/RU/TR), Bibliothek-Suche, die Bücher auf `download.html` und den Kasten „Passend zu diesem Thema“ in allen Frageseiten.
Skripte: `scripts/build_bibliothek_produkte.py` und `scripts/build_buchtipps.py`.
