# TRANSLATION-QA.md

Interne technische Dokumentation zur mehrsprachigen Erweiterung von
intensivstation-ratgeber.de.

**Diese Datei ist nicht für die Öffentlichkeit bestimmt und wird nirgends
auf der Website verlinkt.**

Stand: **alle drei geplanten Sprachen vollständig.**
Türkisch 68/68 · Polnisch 68/68 · **Russisch 68/68**
Quell-Repository: `PaulRawe/Intensivstation-Ratgeber` (Branch `main`)

Dieser Eintrag beschreibt den **Russisch-Batch**. Die Angaben zu Türkisch und
Polnisch sind unverändert gültig und stehen in der Git-Historie dieser Datei.

---

## 1. Seitenbilanz

| Sprache | Frageseiten | Startseite | Rechtsseite | Gesamt |
|---|---|---|---|---|
| Deutsch (Original) | 68 in `index.html` verlinkt (71 Dateien in `fragen/`) | 1 | 4 | – |
| Türkisch (`tr`) | 68 | 1 | 1 | 70 |
| Polnisch (`pl`) | 68 | 1 | 1 | 70 |
| **Russisch (`ru`)** | **68** | **1** | **1** | **70** |

Verzeichnis: `ru/` mit `ru/voprosy/` (Entsprechung zu `tr/sorular/`
und `pl/pytania/`).
Rechtsseite: `ru/pravovaya-informaciya.html`.

Seitenbestand der Website insgesamt: 72 deutsche + 210 übersetzte URLs.

---

## 2. Übersetzte Seiten (Russisch)

Kategorie „Erste Orientierung auf der Intensivstation“ → „Первые шаги в отделении интенсивной терапии“

| Deutsche Quelle | Russische Zielseite |
|---|---|
| `fragen/was-bedeutet-intensivstation.html` | `ru/voprosy/chto-takoe-otdelenie-intensivnoy-terapii.html` |
| `fragen/wann-darf-ich-besuchen.html` | `ru/voprosy/kogda-mozhno-navestit-blizkogo.html` |
| `fragen/besuchszeiten.html` | `ru/voprosy/chasy-poseshcheniy.html` |
| `fragen/wieviele-besucher.html` | `ru/voprosy/skolko-posetiteley-odnovremenno.html` |
| `fragen/was-anziehen.html` | `ru/voprosy/v-chem-prihodit-na-poseshchenie.html` |
| `fragen/blumen-mitbringen.html` | `ru/voprosy/mozhno-li-prinesti-cvety.html` |
| `fragen/uebernachten.html` | `ru/voprosy/mozhno-li-ostatsya-na-noch.html` |
| `fragen/wie-lange-intensivstation.html` | `ru/voprosy/skolko-dlitsya-prebyvanie-v-orit.html` |
| `fragen/wie-bereite-ich-mich-vor.html` | `ru/voprosy/kak-podgotovitsya-k-pervomu-vizitu.html` |
| `fragen/handy-auf-intensivstation.html` | `ru/voprosy/mobilnyy-telefon-v-orit.html` |
| `fragen/was-ist-imc.html` | `ru/voprosy/chto-oznachaet-imc.html` |
| `fragen/intensivstation-finden.html` | `ru/voprosy/kak-nayti-nuzhnoe-otdelenie.html` |

Kategorie „Künstliches Koma verstehen“ → „Понять медикаментозную кому“

| Deutsche Quelle | Russische Zielseite |
|---|---|
| `fragen/was-ist-kuenstliches-koma.html` | `ru/voprosy/chto-takoe-medikamentoznaya-koma.html` |
| `fragen/wie-lange-kuenstliches-koma.html` | `ru/voprosy/skolko-dlitsya-medikamentoznaya-koma.html` |
| `fragen/wie-gefaehrlich.html` | `ru/voprosy/opasna-li-medikamentoznaya-koma.html` |
| `fragen/wann-aufwachen.html` | `ru/voprosy/kogda-blizkiy-prosnetsya.html` |
| `fragen/aufwachphase-dauer.html` | `ru/voprosy/skolko-dlitsya-probuzhdenie.html` |
| `fragen/was-passiert-beim-aufwachen.html` | `ru/voprosy/chto-proishodit-pri-probuzhdenii.html` |
| `fragen/alles-mitbekommen.html` | `ru/voprosy/slyshit-li-pacient-v-kome.html` |
| `fragen/kann-man-sterben.html` | `ru/voprosy/mozhno-li-umeret-v-medikamentoznoy-kome.html` |
| `fragen/warum-kuenstliches-koma.html` | `ru/voprosy/pochemu-vvodyat-v-komu.html` |
| `fragen/traeumt-man-im-koma.html` | `ru/voprosy/snyatsya-li-sny-v-kome.html` |
| `fragen/koma-beenden.html` | `ru/voprosy/kak-zavershayut-medikamentoznuyu-komu.html` |

Kategorie „Beatmung – Was Sie wissen sollten“ → „Искусственная вентиляция лёгких — что нужно знать“

| Deutsche Quelle | Russische Zielseite |
|---|---|
| `fragen/was-bedeutet-kuenstliche-beatmung.html` | `ru/voprosy/chto-takoe-iskusstvennaya-ventilyaciya-legkih.html` |
| `fragen/wann-braucht-man-beatmung.html` | `ru/voprosy/kogda-nuzhna-ivl.html` |
| `fragen/wie-lange-beatmet.html` | `ru/voprosy/kak-dolgo-mozhno-byt-na-ivl.html` |
| `fragen/beatmungsschlauch.html` | `ru/voprosy/chto-takoe-intubacionnaya-trubka.html` |
| `fragen/luftroehrenschnitt.html` | `ru/voprosy/chto-takoe-traheotomiya.html` |
| `fragen/sprechen-waehrend-beatmung.html` | `ru/voprosy/mozhet-li-pacient-na-ivl-govorit.html` |
| `fragen/invasive-nicht-invasive-beatmung.html` | `ru/voprosy/invazivnaya-i-neinvazivnaya-ivl.html` |
| `fragen/mit-beatmung-essen.html` | `ru/voprosy/mozhno-li-est-pri-ivl.html` |

Kategorie „Kommunikation mit dem Behandlungsteam“ → „Общение с лечащей командой“

| Deutsche Quelle | Russische Zielseite |
|---|---|
| `fragen/arztgespraech.html` | `ru/voprosy/kak-prohodit-razgovor-s-vrachom.html` |
| `fragen/welche-fragen-stellen.html` | `ru/voprosy/kakie-voprosy-zadat-vrachu.html` |
| `fragen/wer-gibt-auskunft.html` | `ru/voprosy/kto-daet-informaciyu.html` |
| `fragen/telefonisch-auskunft.html` | `ru/voprosy/mozhno-li-uznat-po-telefonu.html` |
| `fragen/zweite-meinung.html` | `ru/voprosy/mozhno-li-poluchit-vtoroe-mnenie.html` |

Kategorie „Kommunikation mit dem Patienten“ → „Контакт с пациентом“

| Deutsche Quelle | Russische Zielseite |
|---|---|
| `fragen/kann-mich-hoeren.html` | `ru/voprosy/slyshit-li-menya-blizkiy.html` |
| `fragen/kommunikation-beatmeter-patient.html` | `ru/voprosy/kak-obshchatsya-s-pacientom-na-ivl.html` |
| `fragen/erkennt-mich-nicht.html` | `ru/voprosy/pochemu-blizkiy-menya-ne-uznaet.html` |

Kategorie „Medizinische Begriffe und Geräte verstehen“ → „Медицинские термины и аппаратура“

| Deutsche Quelle | Russische Zielseite |
|---|---|
| `fragen/was-ist-sepsis.html` | `ru/voprosy/chto-takoe-sepsis.html` |
| `fragen/was-ist-delir.html` | `ru/voprosy/chto-takoe-deliriy.html` |
| `fragen/was-sind-katecholamine.html` | `ru/voprosy/chto-takoe-kateholaminy.html` |
| `fragen/dialyse-wann-noetig.html` | `ru/voprosy/kogda-nuzhen-dializ.html` |
| `fragen/monitor-werte-bedeutung.html` | `ru/voprosy/chto-oznachayut-pokazateli-na-monitore.html` |
| `fragen/warum-viele-schlaeuche.html` | `ru/voprosy/pochemu-tak-mnogo-trubok-i-katetrov.html` |
| `fragen/warum-keine-reaktion.html` | `ru/voprosy/pochemu-blizkiy-ne-reagiruet.html` |
| `fragen/warum-dauert-lange.html` | `ru/voprosy/pochemu-vse-dlitsya-tak-dolgo.html` |

Kategorie „Verlauf und Prognose“ → „Течение болезни и прогноз“

| Deutsche Quelle | Russische Zielseite |
|---|---|
| `fragen/ueberlebenschancen.html` | `ru/voprosy/kakovy-shansy-na-vyzhivanie.html` |
| `fragen/wird-wieder-gesund.html` | `ru/voprosy/vyzdoroveet-li-blizkiy.html` |
| `fragen/wann-verlegung.html` | `ru/voprosy/kogda-perevedut-iz-orit.html` |
| `fragen/was-kommt-danach.html` | `ru/voprosy/chto-budet-posle-orit.html` |

Kategorie „Emotionale Belastung bewältigen“ → „Как справиться с эмоциональной нагрузкой“

| Deutsche Quelle | Russische Zielseite |
|---|---|
| `fragen/wie-aushalten.html` | `ru/voprosy/kak-perezhit-etu-situaciyu.html` |
| `fragen/darf-ich-weinen.html` | `ru/voprosy/mozhno-li-plakat-ryadom-s-blizkim.html` |
| `fragen/schuldgefuehle.html` | `ru/voprosy/kak-spravitsya-s-chuvstvom-viny.html` |
| `fragen/hilfe-fuer-angehoerige.html` | `ru/voprosy/gde-poluchit-podderzhku-blizkim.html` |
| `fragen/selbstfuersorge.html` | `ru/voprosy/kak-pozabotitsya-o-sebe.html` |
| `fragen/kinder-informieren.html` | `ru/voprosy/kak-obyasnit-situaciyu-detyam.html` |
| `fragen/hoffnung-behalten.html` | `ru/voprosy/kak-sohranit-nadezhdu.html` |

Kategorie „Organisatorische und rechtliche Fragen“ → „Организационные и правовые вопросы“

| Deutsche Quelle | Russische Zielseite |
|---|---|
| `fragen/kosten-intensivstation.html` | `ru/voprosy/kto-platit-za-orit.html` |
| `fragen/was-kostet-intensivstation.html` | `ru/voprosy/skolko-stoit-den-v-orit.html` |
| `fragen/vollmacht-betreuung.html` | `ru/voprosy/nuzhna-li-doverennost.html` |
| `fragen/patientenverfuegung.html` | `ru/voprosy/chto-takoe-patientenverfuegung.html` |
| `fragen/arbeitgeber-informieren.html` | `ru/voprosy/nuzhno-li-soobshchat-rabotodatelyu.html` |
| `fragen/pflegezeit.html` | `ru/voprosy/est-li-otpusk-po-uhodu.html` |
| `fragen/krankschreibung-angehoerige.html` | `ru/voprosy/mogu-li-ya-poluchit-bolnichnyy.html` |
| `fragen/langzeitbesuche-organisieren.html` | `ru/voprosy/kak-organizovat-poseshcheniya-izdaleka.html` |
| `fragen/arbeit-des-angehoerigen.html` | `ru/voprosy/chto-delat-s-rabotoy-blizkogo.html` |
| `fragen/familie-informieren.html` | `ru/voprosy/kak-soobshchit-rodstvennikam.html` |

**Damit ist der gesamte Frage-Antwort-Bereich der deutschen Website in allen
drei Sprachen verfügbar.**

---

## 3. Bewusst NICHT übersetzte Seiten

Identisch zu Türkisch und Polnisch. `impressum.html`, `datenschutz.html`,
`agb.html` und `widerruf.html` bleiben rechtsverbindlich deutsch; ersetzt
durch `ru/pravovaya-informaciya.html` mit Verweis auf die Originale.
`ueber-mich.html`, `fuer-mitarbeiter.html`, `download.html`, `leseproben/`
und `geschichten/` bleiben ebenfalls unübersetzt (Phase-1-Vorgabe).

---

## 4. Sprachregister und Anrede

Gewählt wurde durchgängig die **höfliche Anrede „вы“** (klein geschrieben, wie
bei einem an ein allgemeines Publikum gerichteten Text üblich). Das ist im
Russischen der natürliche Standard für einen Ratgeber dieser Art und
funktioniert ohne die Geschlechtsformen-Probleme, die eine förmliche Anrede
im Polnischen mit sich bringen würde.

**Wichtiger Unterschied zur polnischen Fassung:** Polnisch verwendet die
Du-Form (siehe Abschnitt 4 der polnischen QA-Notizen), Russisch die
Sie-Form. Das ist bewusst so und entspricht dem jeweils üblichen Register –
es ist kein Übersetzungsfehler und sollte beim Lektorat nicht
„vereinheitlicht“ werden.

---

## 5. Bewusst im Deutschen erhaltene Fachbegriffe

Jeweils mit russischer Erklärung und `lang="de"`-Auszeichnung, damit
Angehörige den Begriff auf Station wiedererkennen:

| Deutscher Begriff | Umsetzung im russischen Text |
|---|---|
| Intensivstation | „отделение интенсивной терапии (Intensivstation)“, Kürzel `ITS`, `ICU`, russ. ОРИТ |
| Normalstation | „обычное отделение (Normalstation)“ |
| Beatmungsgerät | „аппарат ИВЛ (Beatmungsgerät)“ |
| künstliche Beatmung | „искусственная вентиляция лёгких (künstliche Beatmung)“, russ. Kürzel ИВЛ |
| künstliches Koma / Sedierung | „медикаментозная кома (künstliches Koma)“, „седация (Sedierung)“ |
| Beatmungsschlauch / Tubus | „интубационная трубка (Beatmungsschlauch / Tubus)“ |
| Intubation / Extubation | im Deutschen mitgeführt |
| Tracheotomie / Luftröhrenschnitt | „трахеотомия (Luftröhrenschnitt)“ |
| Sprechkanüle | „речевая канюля (Sprechkanüle)“ |
| Weaning | im Deutschen belassen, russ. erklärt |
| Magensonde | „желудочный зонд (Magensonde)“ |
| Delir | „делирий (Delir)“, eigene Hinweisbox |
| Fixierung | „фиксация рук (Fixierung)“, eigene Hinweisbox |
| Sepsis | „сепсис (Sepsis)“, umgangssprachlich „заражение крови“ mitgeführt |
| Visite | „врачебный обход (Visite)“ |
| Schutzkleidung | „защитная одежда (Schutzkleidung)“ |
| Angehörigenzimmer | „комнаты для родственников (Angehörigenzimmer)“ |
| Sozialdienst | „социальная служба (Sozialdienst)“ |
| Patientenverwaltung | „бюро по работе с пациентами (Patientenverwaltung)“ |
| Schweigepflicht | „врачебная тайна (Schweigepflicht)“ |
| Konsil | „консультация (Konsil)“ |
| ZVK / Zentraler Venenkatheter | im Deutschen mitgeführt |
| Personalausweis / Versichertenkarte | in Klammern im Deutschen belassen |
| Pförtner / Information | in Klammern im Deutschen belassen |
| IMC / Intermediate Care | international identisch, unverändert |
| Vorsorgevollmacht | durchgehend im Deutschen, eigene Hinweisbox |
| Patientenverfügung | durchgehend im Deutschen, eigene Hinweisbox |
| Betreuungsgericht / gesetzlicher Betreuer | im Deutschen belassen |
| mutmaßlicher Wille | „предполагаемая воля (mutmaßlicher Wille)“ |
| Pflegezeit / Familienpflegezeit | im Deutschen belassen, russ. erklärt |
| kurzfristige Arbeitsverhinderung | im Deutschen belassen |
| Pflegeunterstützungsgeld / Pflegekasse | im Deutschen belassen |
| Kündigungsschutz | „защита от увольнения (Kündigungsschutz)“ |
| Arbeitsunfähigkeitsbescheinigung / AU | im Deutschen belassen |
| Sonderurlaub | im Deutschen belassen |
| Krankengeld | im Deutschen belassen |
| Pflegegrad | im Deutschen belassen |
| Zuzahlung / Belastungsgrenze | im Deutschen belassen |
| Wahlleistungen / Chefarztbehandlung | im Deutschen belassen |
| Seelsorge | „духовное сопровождение (Seelsorge)“ |
| Impressum, Datenschutzerklärung, AGB, Widerrufsbelehrung | durchgängig im Deutschen |

Wie in der polnischen Fassung gibt es auf fünf Seiten `term-note`-Boxen mit
**fertigen deutschen Sätzen zum Vorlesen oder Zeigen** auf Station (Anruf auf
der Station, Bitte um Wiederholung, Hinweis auf fehlende Deutschkenntnisse,
drei vorbereitete Fragen, Mitteilung an den Arbeitgeber). Das ist keine neue
medizinische Aussage, sondern eine reine Kommunikationshilfe.

---

## 6. Medizinische Qualitätssicherung

- Es wurden **keine** neuen medizinischen Aussagen ergänzt.
- Es wurden **keine** Diagnosen, Dosierungen, Therapieempfehlungen oder
  Handlungsanweisungen hinzugefügt.
- Zahlenangaben wurden unverändert übernommen, inklusive der deutschen
  Vorbehalte („keine festen Zeitvorgaben, sondern grobe Erfahrungswerte“,
  „Statistiken sind Durchschnittswerte“).
- Prognoseaussagen behalten ihre Abstufung, z. B. „Die Dauer des Aufenthalts
  sagt für sich allein nichts über die Prognose aus“ → „Сама по себе
  длительность пребывания ничего не говорит о прогнозе.“
- Der medizinische Disclaimer steht auf **jeder** russischen Seite, statisch
  im HTML, nicht per JavaScript.

### Aus den Übersetzungen entfernte Inhalte

Gemäß Phase-1-Vorgabe (keine Produktintegration) wurden dieselben Blöcke
weggelassen wie in den beiden anderen Sprachen:

| Quelle | Entfernter Block |
|---|---|
| `fragen/was-bedeutet-intensivstation.html` | Gumroad-Produktbox „Mini-Ratgeber: Arztgespräch“ |
| `fragen/uebernachten.html` | HRS-Affiliate-Block (awin1.com) inkl. Preisangabe |
| `fragen/arztgespraech.html` | Gumroad-Link, Buchhinweis, Leseproben-Verweis |
| `fragen/welche-fragen-stellen.html` | Buchhinweis mit Fragenliste, Leseproben-Verweis |
| `fragen/was-ist-delir.html` | Gumroad-Produktbox „Delir verstehen“ (3,99 €) |
| `fragen/kinder-informieren.html` | Verweis auf die deutschsprachige Vorlesegeschichte und die externe Kindergeschichten-Seite |
| `fragen/langzeitbesuche-organisieren.html` | HRS-Affiliate-Block (awin1.com) |

Der medizinische Fließtext wurde dadurch nicht verändert.

---

## 7. Technische SEO-Maßnahmen

- **Canonical:** jede russische Seite verweist auf ihre eigene URL unter `/ru/`.
- **hreflang:** vollständig wechselseitig zwischen `de`, `tr`, `pl` und `ru`,
  `x-default` → `de`. Jede der 280 Seiten führt alle vier Sprachcodes plus
  `x-default`.
- **Sprachumschalter:** in allen türkischen und polnischen Seiten ist
  `Русский` jetzt ein Link auf die jeweils entsprechende russische Seite.
  Damit gibt es auf der ganzen Website **keinen `lang-off`-Eintrag mehr** –
  alle vier Sprachen sind von überall erreichbar.
- **Titles und Descriptions:** eigenständig auf Russisch formuliert, an der
  Suchintention russischsprachiger Angehöriger in Deutschland orientiert.
  Alle 70 seitenweit eindeutig.
- **Open Graph:** `og:type`, `og:locale=ru_RU`, `og:locale:alternate=de_DE`,
  `og:site_name`, `og:title`, `og:description`, `og:url`.
- **Alt-Texte:** `head.png` hat einen russischen Alt-Text.
- **Sitemap:** um 70 russische URLs erweitert, 212 bestehende Einträge
  unverändert. Neu: **282 URLs** (72 deutsch, 70 türkisch, 70 polnisch,
  70 russisch).
- **URLs:** ausschließlich ASCII-Kleinbuchstaben und Bindestriche, keine
  kyrillischen Zeichen in Dateinamen. Transliteration nach einem einheitlichen
  Schema (щ → shch, ж → zh, ч → ch, ш → sh, ы → y, я → ya, ю → yu).
- **robots.txt:** unverändert, `/ru/` ist crawlbar.
- **css/i18n.css:** unverändert – die Datei deckte `html[lang="ru"]` bereits ab,
  inklusive der erhöhten Zeilenhöhe für kyrillischen Fließtext.
- **js/consent-i18n.js:** unverändert, wird von den russischen Seiten genutzt.

---

## 8. Durchgeführte automatische Prüfungen

| Prüfung | Ergebnis |
|---|---|
| Tag-Balance / Wohlgeformtheit (70 Dateien) | 70/70 fehlerfrei |
| UTF-8-Decodierung | 70/70 fehlerfrei |
| Tote interne Links und Pfade (ru + pl + tr, 210 Dateien) | 0 |
| Doppelte HTML-IDs | 0 |
| Titles und Descriptions seitenweit eindeutig | 0 Duplikate |
| `<html lang="ru">` gesetzt | 70/70 |
| Genau ein Canonical pro Seite, zeigt auf `/ru/` | 70/70 |
| hreflang `de` + `tr` + `pl` + `ru` + `x-default` vorhanden | 70/70 |
| hreflang `ru` identisch mit Canonical | 70/70 |
| Title ≥ 20 Zeichen, Description ≥ 70 Zeichen | 70/70 |
| Keine Gumroad-/Amazon-/Awin-/Etsy-Links | 70/70 sauber |
| Kein Laden von `cookie-consent.js`, `sticky-sales.js`, `goatcounter-init.js`, `sales-banner.html`, `sidebar-downloads.html` | 70/70 sauber |
| Deutsche Textreste außerhalb bewusster `lang="de"`-Auszeichnung | keine gefunden |
| Reziprozität DE → PL/RU/TR (Ziel existiert) | 70/70 |
| Reziprozität TR → DE/PL/RU (hreflang + Umschalter) | 70/70 |
| Reziprozität PL → DE/RU/TR (hreflang + Umschalter) | 70/70 |
| Reziprozität RU → DE/PL/TR (hreflang + Umschalter) | 70/70 |
| Sitemap XML-valide, keine Duplikate | bestanden (282 URLs) |
| Deutsche Dateien: Änderungen außerhalb hreflang | 0 |
| Längste ununterbrochene Zeichenkette (Mobil-Risiko) | 26 Zeichen – unkritisch |

---

## 9. Vor Veröffentlichung manuell zu prüfen

**Hohe Priorität**

1. **Muttersprachliches Lektorat Russisch.** Die Übersetzung ist fachlich
   sorgfältig erstellt, sollte bei medizinisch sensiblen Texten für Menschen
   in Ausnahmesituationen aber von einem russischen Muttersprachler
   gegengelesen werden – idealerweise mit Bezug zum deutschen
   Gesundheitswesen. Besonders zu prüfen:
   - `mozhno-li-umeret-v-medikamentoznoy-kome.html` (Sterben,
     Therapiezieländerung, palliative Begleitung),
   - `chto-proishodit-pri-probuzhdenii.html` und
     `skolko-dlitsya-probuzhdenie.html` (Fixierung der Hände),
   - `skolko-posetiteley-odnovremenno.html` und
     `mozhno-li-ostatsya-na-noch.html` (Abschiedssituationen),
   - die Fachterminologie in Kategorie 6 (сепсис, делирий, катехоламины,
     диализ) gegen gängigen russischen Klinikgebrauch,
   - Zielgruppenfrage: das Publikum sind russischsprachige Menschen in
     Deutschland, darunter viele Spätaussiedler und Zugewanderte aus
     verschiedenen postsowjetischen Ländern. Der Text ist bewusst neutral
     gehalten und vermeidet landesspezifische Bezüge außerhalb Deutschlands.
2. **`ru/pravovaya-informaciya.html` juristisch prüfen lassen.** Gleiches
   Modell wie bei den anderen Sprachen: deutsche Fassung allein verbindlich.
3. **Sichtprüfung auf echten Geräten**, mindestens iPhone SE (375 px) und ein
   Android-Gerät. Kyrillisch wirkt bei gleicher Punktgröße etwas gedrängter;
   `css/i18n.css` setzt dafür bereits `line-height: 1.8` für
   `html[lang="ru"]`. Das sollte einmal in echt angesehen werden.

**Mittlere Priorität**

4. **Die eingefügten deutschen Beispielsätze** (Abschnitt 5) von jemandem
   gegenlesen lassen, der im Klinikalltag steht.
5. **Inhaltliche Lücke, bewusst nicht geschlossen:** ein Hinweis auf das Recht
   auf Sprachmittlung/Dolmetscher im Krankenhaus fehlt im deutschen Original
   und wurde deshalb auch hier nicht ergänzt. Für russischsprachige
   Angehörige wäre er auf `kak-prohodit-razgovor-s-vrachom.html` und
   `kto-daet-informaciyu.html` besonders wertvoll. Empfehlung unverändert:
   zuerst im deutschen Original ergänzen, dann in alle drei Sprachen
   übertragen.
6. **Kindergeschichte fehlt auf Russisch** – wie auf Türkisch und Polnisch.
7. **`inject-kdp-books.yml` prüfen:** falls dieser Workflow über die
   Sprachordner läuft, würde er Produktlinks in `/ru/` schreiben. Vor dem
   nächsten Lauf auf `fragen/` beschränken. Das gilt jetzt für drei
   Sprachordner statt für einen.

**Niedrige Priorität**

8. Den deutschen Seiten fehlen weiterhin Open-Graph-Tags. Die drei
   Sprachversionen sind hier vollständiger als das Original.
9. Zwei `<h1>` pro Seite – bewusst wie in der deutschen Vorlage beibehalten.
10. Die Suchfunktion in `js/cookie-consent.js` enthält weiterhin nur 9 von 68
    Fragen. Betrifft nur die deutsche Version.

---

## 10. Offene Arbeit

| Batch | Inhalt | Status |
|---|---|---|
| 1–5 | Türkisch `/tr/sorular/` (68 Seiten) | **abgeschlossen** |
| 6 | Polnisch `/pl/pytania/` (68 Seiten) | **abgeschlossen** |
| 7 | **Russisch `/ru/voprosy/` (68 Seiten)** | **abgeschlossen** |

**Der ursprünglich geplante Sprachausbau ist damit vollständig.**

Falls später eine weitere Sprache dazukommt, sind zu aktualisieren:
`scripts/inject_hreflang_de.py` (MAP um den neuen Code erweitern und erneut
ausführen), `sitemap.xml`, sowie der Sprachumschalter in allen bestehenden
türkischen, polnischen und russischen Seiten. Die Slug-Zuordnungen
DE→TR, DE→PL und DE→RU stehen vollständig in Abschnitt 2 der jeweiligen
Fassung dieser Datei (Git-Historie).
