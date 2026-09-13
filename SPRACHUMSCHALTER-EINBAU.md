# Sprachumschalter – Einbau

Zwei Dateien, beide neu. Nichts wird überschrieben.

```
scripts/inject_langswitch.py
.github/workflows/inject-langswitch.yml
```

## Einbau

ZIP entpacken, beide Dateien an die oben genannten Pfade kopieren,
committen, pushen. Die Action läuft danach automatisch und setzt den
Umschalter in einem eigenen Folge-Commit.

```bash
cd /pfad/zu/Intensivstation-Ratgeber
cp -r /pfad/zum/entpackten/zip/. .
git add -A
git commit -m "feat: Sprachumschalter als GitHub Action"
git push
```

Rund eine Minute später erscheint ein zweiter Commit vom Bot:
`chore: Sprachumschalter aktualisiert [skip ci]`. Danach steht die Leiste
auf allen 140 Seiten.

## Voraussetzung prüfen

Unter Settings → Actions → General → Workflow permissions muss
**Read and write permissions** aktiv sein. Sonst scheitert der Push-Schritt.
Deine bestehenden Actions committen bereits, also ist das vermutlich
schon gesetzt.

## Was die Action macht

Auf jeder Seite mit Sprachentsprechung wird direkt nach `<body>` eingefügt:

```
Sprache: Deutsch · Türkçe · Русский · Polski
```

Die aktuelle Sprache ist hervorgehoben, vorhandene Sprachen sind verlinkt,
fehlende bleiben grau und sind bewusst kein Link. Auf den türkischen Seiten
steht die Beschriftung als `Dil / Sprache`, später auf russischen als
`Язык / Sprache` und auf polnischen als `Język / Sprache`.

Zusätzlich wird `css/i18n.css` eingebunden, falls noch nicht vorhanden.
Ohne diese Datei wäre die Leiste unformatiert.

## Warum keine Flaggen

Flaggen stehen für Länder, nicht für Sprachen. Die Zielgruppe sind
türkisch-, russisch- und polnischsprachige Menschen **in Deutschland**,
viele mit deutschem Pass. Eine türkische Flagge legt nahe, es ginge um das
Gesundheitssystem der Türkei – genau das Missverständnis, das die
Sprachversion vermeiden soll. Beim Russischen wiegt es schwerer:
Russischsprachige in Deutschland sind zu großen Teilen Russlanddeutsche,
Kasachstandeutsche oder Ukrainer. Der Schriftzug in der eigenen Sprache
wird zuverlässig erkannt und trifft niemanden falsch.

## Selbstpflegend

Die Zuordnung steht nicht im Skript, sondern wird aus den vorhandenen
hreflang-Angaben der Sprachseiten abgeleitet. Sobald `/ru/` oder `/pl/` im
Repository liegen, erscheinen sie automatisch im Umschalter – auch in den
bereits vorhandenen deutschen und türkischen Seiten. Du musst dafür nichts
anpassen.

## Auslöser

Die Action läuft bei Push auf `main`, wenn sich etwas in `tr/`, `ru/`,
`pl/`, `fragen/`, `index.html`, `impressum.html` oder am Skript selbst
ändert. Zusätzlich manuell über den Reiter Actions → Inject Language
Switcher → Run workflow.

Der Lauf ist idempotent. Ändert sich nichts, entsteht kein Commit.

## Prüfung vor dem Commit

Die Action bricht ab, bevor sie committet, wenn sie findet:

- eine Seite mit zwei Umschalter-Blöcken
- einen Link im Umschalter, der auf keine existierende Datei zeigt
- eine Seite mit Umschalter, aber ohne geladenes `css/i18n.css`

## Rückbau

Der Block ist durch `<!-- LANGSWITCH_START -->` und
`<!-- LANGSWITCH_END -->` markiert und lässt sich sauber herausschneiden:

```bash
python3 - << 'PY'
import glob, re
for f in glob.glob("**/*.html", recursive=True):
    if f.startswith(".git"): continue
    h = open(f, encoding="utf-8").read()
    n = re.sub(r"<!-- LANGSWITCH_START -->.*?<!-- LANGSWITCH_END -->\n?", "", h, flags=re.S)
    if n != h: open(f, "w", encoding="utf-8").write(n)
PY
```

Workflow-Datei danach löschen oder umbenennen, sonst baut die Action den
Block beim nächsten Push wieder ein.

## Lokal testen

```bash
python3 scripts/inject_langswitch.py
git diff --stat
```
