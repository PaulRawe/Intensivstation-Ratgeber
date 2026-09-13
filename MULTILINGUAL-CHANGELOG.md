# MULTILINGUAL-CHANGELOG.md

Änderungsprotokoll der mehrsprachigen Erweiterung von
intensivstation-ratgeber.de.

**Stand: Türkisch vollständig (68/68) · Polnisch vollständig (68/68) · Russisch offen.**

Dieser Eintrag beschreibt den **Polnisch-Batch**. Der Türkisch-Batch ist
bereits im Repository und wird hier nur dort erwähnt, wo er mit angefasst wurde.

---

## Neu erstellte Verzeichnisse

```
pl/
pl/pytania/
```

## Neu erstellte Dateien (70)

**Polnischer Sprachbereich**

```
pl/index.html
pl/informacje-prawne.html
pl/pytania/co-dzieje-sie-po-oit.html
pl/pytania/co-dzieje-sie-podczas-wybudzania.html
pl/pytania/co-oznacza-imc.html
pl/pytania/co-oznaczaja-wartosci-na-monitorze.html
pl/pytania/co-z-praca-mojego-bliskiego.html
pl/pytania/czy-bliski-mnie-slyszy.html
pl/pytania/czy-bliski-w-spiaczce-cos-slyszy.html
pl/pytania/czy-bliski-wyzdrowieje.html
pl/pytania/czy-moge-dostac-zwolnienie-lekarskie.html
pl/pytania/czy-moge-plakac-przy-bliskim.html
pl/pytania/czy-moge-przyniesc-kwiaty.html
pl/pytania/czy-moge-uzyskac-informacje-telefonicznie.html
pl/pytania/czy-moge-zasiegnac-drugiej-opinii.html
pl/pytania/czy-moge-zostac-na-noc.html
pl/pytania/czy-mozna-jesc-przy-wentylacji.html
pl/pytania/czy-mozna-umrzec-w-spiaczce-farmakologicznej.html
pl/pytania/czy-musze-poinformowac-pracodawce.html
pl/pytania/czy-pacjent-wentylowany-moze-mowic.html
pl/pytania/czy-potrzebne-jest-pelnomocnictwo.html
pl/pytania/czy-przysluguje-urlop-opiekunczy.html
pl/pytania/czy-spiaczka-farmakologiczna-jest-niebezpieczna.html
pl/pytania/czy-w-spiaczce-sie-sni.html
pl/pytania/czym-jest-majaczenie.html
pl/pytania/czym-jest-oddzial-intensywnej-terapii.html
pl/pytania/czym-jest-oswiadczenie-woli-pacjenta.html
pl/pytania/czym-jest-rurka-intubacyjna.html
pl/pytania/czym-jest-sepsa.html
pl/pytania/czym-jest-spiaczka-farmakologiczna.html
pl/pytania/czym-jest-tracheotomia.html
pl/pytania/czym-jest-wentylacja-mechaniczna.html
pl/pytania/czym-sa-katecholaminy.html
pl/pytania/dlaczego-bliski-mnie-nie-poznaje.html
pl/pytania/dlaczego-bliski-nie-reaguje.html
pl/pytania/dlaczego-jest-tyle-drenow-i-cewnikow.html
pl/pytania/dlaczego-wprowadza-sie-w-spiaczke.html
pl/pytania/dlaczego-wszystko-trwa-tak-dlugo.html
pl/pytania/gdzie-szukac-wsparcia-dla-bliskich.html
pl/pytania/godziny-odwiedzin.html
pl/pytania/ile-kosztuje-dzien-na-oit.html
pl/pytania/ilu-odwiedzajacych-naraz.html
pl/pytania/jak-dlugo-mozna-byc-wentylowanym.html
pl/pytania/jak-dlugo-trwa-pobyt-na-oit.html
pl/pytania/jak-dlugo-trwa-spiaczka-farmakologiczna.html
pl/pytania/jak-dlugo-trwa-wybudzanie.html
pl/pytania/jak-konczy-sie-spiaczka-farmakologiczna.html
pl/pytania/jak-poinformowac-rodzine.html
pl/pytania/jak-przebiega-rozmowa-z-lekarzem.html
pl/pytania/jak-przygotowac-sie-do-pierwszej-wizyty.html
pl/pytania/jak-radzic-sobie-z-poczuciem-winy.html
pl/pytania/jak-rozmawiac-z-pacjentem-wentylowanym.html
pl/pytania/jak-wytlumaczyc-sytuacje-dzieciom.html
pl/pytania/jak-wytrzymac-te-sytuacje.html
pl/pytania/jak-zachowac-nadzieje.html
pl/pytania/jak-zadbac-o-siebie.html
pl/pytania/jak-znalezc-wlasciwy-oddzial.html
pl/pytania/jak-zorganizowac-odwiedziny-z-daleka.html
pl/pytania/jakie-pytania-zadac-lekarzowi.html
pl/pytania/jakie-sa-szanse-przezycia.html
pl/pytania/kiedy-bliski-sie-obudzi.html
pl/pytania/kiedy-moge-odwiedzic-bliskiego.html
pl/pytania/kiedy-nastapi-przeniesienie-z-oit.html
pl/pytania/kiedy-potrzebna-jest-dializa.html
pl/pytania/kiedy-potrzebna-jest-wentylacja.html
pl/pytania/kto-placi-za-oddzial-intensywnej-terapii.html
pl/pytania/kto-udziela-informacji.html
pl/pytania/telefon-komorkowy-na-oit.html
pl/pytania/w-czym-przyjsc-na-odwiedziny.html
pl/pytania/wentylacja-inwazyjna-i-nieinwazyjna.html
```

Keine neuen CSS- oder JS-Dateien nötig: `css/i18n.css` deckte
`html[lang="pl"]` bereits ab, `js/consent-i18n.js` wird unverändert
mitbenutzt. Beide Dateien sind im Paket nur zur Vollständigkeit enthalten
und **inhaltlich identisch** mit der Fassung im Repository.

---

## Technisch angepasste bestehende Dateien (141)

**`sitemap.xml`** – 70 polnische URLs am Ende ergänzt. Alle 142 bestehenden
Einträge (72 deutsch, 70 türkisch) unverändert, keine Löschung, keine
Umsortierung. Neu: **212 URLs**.

**`scripts/inject_hreflang_de.py`** – die `MAP` enthält jetzt zu jedem der
70 Einträge zusätzlich den `pl`-Pfad. Das Skript bleibt idempotent.

**70 deutsche HTML-Dateien** (`index.html`, `impressum.html`, 68 Dateien in
`fragen/`) – ausschließlich eine zusätzliche Zeile im vorhandenen
hreflang-Block:

```html
<link rel="alternate" hreflang="pl" href="…">
```

Kein deutscher Text, keine Struktur, kein Script und kein Canonical wurde
angefasst. Der Block ist weiterhin durch `<!-- HREFLANG_START -->` und
`<!-- HREFLANG_END -->` eindeutig markiert.

**70 türkische HTML-Dateien** (`tr/index.html`, `tr/yasal-bilgiler.html`,
68 Dateien in `tr/sorular/`) – zwei Änderungen pro Datei:

1. im `<head>` eine zusätzliche Zeile
   `<link rel="alternate" hreflang="pl" href="…">`
2. im Sprachumschalter wird aus

   ```html
   <span class="lang-off" lang="pl" title="…">Polski</span>
   ```

   ein echter Link auf die entsprechende polnische Seite.

Am türkischen Text selbst wurde nichts geändert.

---

## Hinzugefügte SEO-Strukturen

- Self-Canonical auf allen 70 polnischen Seiten
- vollständig wechselseitige hreflang-Auszeichnung `de` ↔ `tr` ↔ `pl`
  mit `x-default` → `de`; alle Verweise gegen das Dateisystem geprüft
- eigenständige polnische Titles, Meta Descriptions, H1 und H2 –
  seitenweit eindeutig, keine Duplikate
- Open-Graph-Tags (`og:type`, `og:locale=pl_PL`, `og:locale:alternate`,
  `og:site_name`, `og:title`, `og:description`, `og:url`)
- polnische Alt-Texte
- durchgehende Prev/Next-Kette über alle neun Kategorien
- „Więcej na temat …“-Blöcke innerhalb der jeweiligen Kategorie
- Sprachumschalter auf jeder Seite; Russisch bleibt als noch nicht verfügbar
  markiert und ist **nicht** verlinkt
- 70 neue Sitemap-Einträge

---

## Ausdrücklich unverändert gebliebene Dateien

```
css/style.css, css/1style.css, css/style12.01backup.css
css/i18n.css            (inhaltlich unverändert)
js/cookie-consent.js, js/disclaimer-loader.js,
js/goatcounter-init.js, js/sticky-sales.js
js/consent-i18n.js      (inhaltlich unverändert)
includes/               (alle)
robots.txt, .htaccess, CNAME
.github/workflows/      (alle)
scripts/crosslinks.py
die drei Nicht-Frageseiten in fragen/ (2 Leseproben, create_pages.py)
datenschutz.html, agb.html, widerruf.html,
ueber-mich.html, fuer-mitarbeiter.html, download.html,
leseproben/, geschichten/, alle Bilddateien
sämtlicher türkischer Fließtext
```

Es wurde **keine** Datei gelöscht, umbenannt oder verschoben. Keine
bestehende deutsche oder türkische URL hat sich geändert.

---

## Bewusste Abweichungen von der deutschen Vorlage

Identisch zur türkischen Fassung:

| Punkt | Deutsche Version | Polnische Version | Grund |
|---|---|---|---|
| Medizinischer Disclaimer | per `js/disclaimer-loader.js` nachgeladen | statisch im HTML | bleibt auch ohne JavaScript sichtbar |
| Cookie-Banner | per `fetch()` aus `includes/` | statisch im HTML | robuster, keine Pfadabhängigkeit |
| Consent-Skript | `js/cookie-consent.js` | `js/consent-i18n.js` | die deutsche Datei aktiviert über `path.includes('/fragen/')` einen Produkt-Funnel |
| Analytics | lädt beim Seitenaufruf | nur nach Zustimmung | Consent-Konformität |
| Sales-Banner, Sidebar-Downloads | eingebunden | nicht eingebunden | Phase-1-Vorgabe |
| Produktblöcke im Artikeltext | in 6 Seiten vorhanden | entfernt | Phase-1-Vorgabe |
| Verweis auf Kindergeschichte | vorhanden | entfernt | Geschichte existiert nur auf Deutsch |
| Suchfunktion | in `js/cookie-consent.js` | nicht übernommen | Suchindex ist deutschsprachig |
| Open Graph | nicht vorhanden | vorhanden | Verbesserung ohne Eingriff ins Deutsche |

Zusätzlich nur in der polnischen Fassung:

| Punkt | Umsetzung | Grund |
|---|---|---|
| Deutsche Beispielsätze | fünf `term-note`-Boxen mit fertigen Sätzen für Station, Arztgespräch und Arbeitgeber | Kommunikationshilfe für die Zielgruppe; keine neue medizinische Aussage |

---

## Noch offen

| Sprache | Seiten | Status |
|---|---|---|
| Russisch `/ru/voprosy/` | 68 | offen |

Die Slug-Zuordnung Deutsch → Polnisch liegt vollständig in Abschnitt 2 von
`TRANSLATION-QA.md` und ist zusammen mit der türkischen Zuordnung die
Vorlage für Russisch.
