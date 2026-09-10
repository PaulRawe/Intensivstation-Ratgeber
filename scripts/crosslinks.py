#!/usr/bin/env python3
"""
Querverlinkung der Frageseiten – intensivstation-ratgeber.de

Liest die Reihenfolge der Fragen aus index.html (Kategorien + Links) und
schreibt in jede Seite unter fragen/ einen Navigationsblock:

  * "Nächste Frage" (bzw. "Nächstes Thema: ..." beim Kategoriewechsel)
  * "Vorherige Frage"
  * bis zu 4 weitere Fragen aus demselben Themenbereich

Der Block steht zwischen den Markern CROSSLINKS_START / CROSSLINKS_END und
wird bei jedem Lauf komplett neu erzeugt. Nicht von Hand darin editieren –
Änderungen macht man in index.html (Reihenfolge/Titel) oder hier im Skript.

Zusätzlich:
  * CSS für den Block wird in css/style.css gepflegt (eigene Marker)
  * Warnungen für Frageseiten, die nirgends verlinkt sind
  * Warnungen für kaputte interne Links in fragen/*.html

Nur Python-Standardbibliothek, keine Abhängigkeiten.
"""

import html
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "index.html")
FRAGEN_DIR = os.path.join(ROOT, "fragen")
CSS_FILE = os.path.join(ROOT, "css", "style.css")

START = "<!-- CROSSLINKS_START – automatisch erzeugt, nicht von Hand bearbeiten -->"
END = "<!-- CROSSLINKS_END -->"
BLOCK_RE = re.compile(r"[ \t]*<!-- CROSSLINKS_START.*?<!-- CROSSLINKS_END -->[ \t]*\r?\n?", re.S)

CSS_START = "/* CROSSLINKS_CSS_START – automatisch gepflegt von scripts/crosslinks.py */"
CSS_END = "/* CROSSLINKS_CSS_END */"
CSS_RE = re.compile(r"\r?\n?/\* CROSSLINKS_CSS_START.*?/\* CROSSLINKS_CSS_END \*/", re.S)

MAX_SIBLINGS = 4

# Seiten, die nicht in index.html stehen, aber in die Kette sollen.
# Format: dateiname -> (einfügen nach dateiname, Titel oder None = <h1> der Seite)
ZUSATZSEITEN = {
    "wie-geht-es-weiter.html": ("was-kommt-danach.html", None),
}

# Dateien in fragen/, die bewusst keine Frageseiten sind
IGNORIEREN = {
    "Intensivstation-Patienten-Ratgeber-LESEPROBE.html",
    "Intensivstation-Ratgeber-LESEPROBE.html",
}

CSS_BLOCK = """
/* ===================================
   QUERVERLINKUNG FRAGESEITEN
   =================================== */
.ql-nav {
    margin: var(--spacing-xl) 0 var(--spacing-lg);
    padding-top: var(--spacing-lg);
    border-top: 2px solid var(--border-color);
}

.ql-next {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: 22px 24px;
    background: var(--primary-light);
    border: 1px solid var(--primary);
    border-left: 6px solid var(--primary-dark);
    border-radius: var(--radius-md);
    color: var(--text-dark);
    text-decoration: none;
    transition: box-shadow var(--transition-fast), background var(--transition-fast);
}

.ql-next:hover {
    background: #dff1fd;
    box-shadow: var(--shadow-md);
    color: var(--text-dark);
}

.ql-next:focus-visible,
.ql-prev:focus-visible {
    outline: 3px solid var(--primary-dark);
    outline-offset: 3px;
}

.ql-next-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.ql-label {
    font-size: 0.9rem;
    line-height: 1.4;
    color: var(--text-medium);
}

.ql-title {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: var(--line-height-heading);
}

.ql-arrow {
    margin-left: auto;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: var(--radius-full);
    background: var(--primary-dark);
    color: #fff;
    font-size: 1.3rem;
    line-height: 1;
}

.ql-prev {
    display: inline-block;
    margin-top: var(--spacing-sm);
    color: var(--text-light);
    font-size: 0.95rem;
    text-decoration: none;
}

.ql-prev:hover {
    color: var(--primary-dark);
    text-decoration: underline;
}

.ql-more {
    margin-top: var(--spacing-lg);
}

.ql-more h3 {
    font-size: 1.1rem;
    margin-bottom: var(--spacing-sm);
}

@media (max-width: 600px) {
    .ql-next {
        padding: 18px;
    }
    .ql-title {
        font-size: 1.08rem;
    }
    .ql-arrow {
        width: 36px;
        height: 36px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .ql-next {
        transition: none;
    }
}
"""


class IndexParser(HTMLParser):
    """Sammelt (Kategorie, href, Titel) aus den category-sections von index.html."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.category = None
        self.in_cat_title = False
        self.cat_buf = []
        self.in_link = None
        self.link_buf = []
        self.items = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        classes = (a.get("class") or "").split()
        if tag == "h2" and "category-title" in classes:
            self.in_cat_title = True
            self.cat_buf = []
        elif tag == "a" and (a.get("href") or "").startswith("fragen/"):
            self.in_link = a["href"][len("fragen/"):].split("#")[0]
            self.link_buf = []

    def handle_endtag(self, tag):
        if tag == "h2" and self.in_cat_title:
            self.in_cat_title = False
            self.category = " ".join("".join(self.cat_buf).split())
        elif tag == "a" and self.in_link:
            title = " ".join("".join(self.link_buf).split())
            self.items.append({"file": self.in_link, "title": title,
                               "category": self.category or "Weitere Fragen"})
            self.in_link = None

    def handle_data(self, data):
        if self.in_cat_title:
            self.cat_buf.append(data)
        if self.in_link:
            self.link_buf.append(data)


def read(path):
    with open(path, "r", encoding="utf-8", newline="") as f:
        return f.read()


def write(path, text):
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(text)


def h1_of(path):
    # erstes <h1> ist der Seitenkopf, das zweite die eigentliche Frage
    all_h1 = re.findall(r"<h1[^>]*>(.*?)</h1>", read(path), re.S)
    if not all_h1:
        return os.path.basename(path)
    raw = all_h1[1] if len(all_h1) > 1 else all_h1[0]
    return " ".join(html.unescape(re.sub(r"<[^>]+>", "", raw)).split())


def load_order():
    p = IndexParser()
    p.feed(read(INDEX))
    seen, order = set(), []
    for it in p.items:
        if it["file"] in seen:
            continue
        if not os.path.exists(os.path.join(FRAGEN_DIR, it["file"])):
            print(f"⚠️  In index.html verlinkt, Datei fehlt: fragen/{it['file']}")
            continue
        seen.add(it["file"])
        order.append(it)

    for fname, (after, title) in ZUSATZSEITEN.items():
        if fname in seen or not os.path.exists(os.path.join(FRAGEN_DIR, fname)):
            continue
        pos = next((i for i, it in enumerate(order) if it["file"] == after), len(order) - 1)
        order.insert(pos + 1, {
            "file": fname,
            "title": title or h1_of(os.path.join(FRAGEN_DIR, fname)),
            "category": order[pos]["category"] if order else "Weitere Fragen",
        })
        seen.add(fname)
    return order


def build_block(order, i, indent, nl):
    cur = order[i]
    e = lambda s: html.escape(s, quote=True)

    # nächste Seite (am Ende: zurück zur ersten Frage)
    if i + 1 < len(order):
        nxt = order[i + 1]
        if nxt["category"] == cur["category"]:
            label = "Nächste Frage"
        else:
            label = f"Nächstes Thema: {nxt['category']}"
    else:
        nxt = order[0]
        label = f"Zurück zum ersten Thema: {nxt['category']}"

    prev = order[i - 1] if i > 0 else None

    # weitere Fragen aus derselben Kategorie, ab der übernächsten, mit Umlauf
    same = [it for it in order if it["category"] == cur["category"]]
    k = same.index(cur)
    rotated = same[k + 1:] + same[:k]
    siblings = [it for it in rotated if it["file"] != nxt["file"]][:MAX_SIBLINGS]

    L = [
        START,
        '<div class="ql-nav" role="navigation" aria-label="Weiterlesen">',
        f'    <a href="{e(nxt["file"])}" class="ql-next">',
        '        <span class="ql-next-text">',
        f'            <span class="ql-label">{e(label)}</span>',
        f'            <span class="ql-title">{e(nxt["title"])}</span>',
        "        </span>",
        '        <span class="ql-arrow" aria-hidden="true">›</span>',
        "    </a>",
    ]
    if prev:
        L.append(f'    <a href="{e(prev["file"])}" class="ql-prev">‹ Vorherige Frage: {e(prev["title"])}</a>')
    if siblings:
        L += [
            '    <div class="ql-more">',
            f'        <h3>Mehr zum Thema „{e(cur["category"])}“</h3>',
            '        <ul class="questions-list">',
        ]
        for s in siblings:
            L.append(f'            <li><a href="{e(s["file"])}" class="question-link">{e(s["title"])}</a></li>')
        L += ["        </ul>", "    </div>"]
    L += ["</div>", END]
    return nl.join(indent + line for line in L) + nl


def insert_block(content, block):
    content = BLOCK_RE.sub("", content)
    # vor dem letzten "Zurück zur Übersicht"-Link, sonst vor </main>
    links = list(re.finditer(r'[ \t]*<a [^>]*class="back-link"[^>]*>', content))
    if links:
        pos = links[-1].start()
    else:
        m = re.search(r"[ \t]*</main>", content)
        if not m:
            return None
        pos = m.start()
    return content[:pos] + block + content[pos:]


def indent_before(content):
    links = list(re.finditer(r'([ \t]*)<a [^>]*class="back-link"[^>]*>', content))
    if links:
        return links[-1].group(1)
    m = re.search(r"([ \t]*)</main>", content)
    return (m.group(1) + "    ") if m else ""


def update_css():
    if not os.path.exists(CSS_FILE):
        print("⚠️  css/style.css nicht gefunden – CSS übersprungen")
        return False
    css = read(CSS_FILE)
    nl = "\r\n" if "\r\n" in css else "\n"
    block = (CSS_START + CSS_BLOCK.rstrip() + "\n" + CSS_END).replace("\n", nl)
    new = CSS_RE.sub("", css).rstrip() + nl + nl + block + nl
    if new != css:
        write(CSS_FILE, new)
        print("🎨 css/style.css: Querverlinkungs-Styles aktualisiert")
        return True
    return False


def check_links(files):
    broken = 0
    for fname in files:
        content = read(os.path.join(FRAGEN_DIR, fname))
        for href in re.findall(r'href="([^"#?]+)', content):
            if re.match(r"^(https?:|mailto:|tel:|javascript:|//|/)", href):
                continue
            target = os.path.normpath(os.path.join(FRAGEN_DIR, href))
            if not os.path.exists(target):
                broken += 1
                print(f"🔗 Kaputter Link in fragen/{fname}: {href}")
    return broken


def main():
    order = load_order()
    if not order:
        print("❌ Keine Fragen in index.html gefunden – Abbruch.")
        sys.exit(1)

    changed = 0
    for i, it in enumerate(order):
        path = os.path.join(FRAGEN_DIR, it["file"])
        content = read(path)
        nl = "\r\n" if "\r\n" in content else "\n"
        stripped = BLOCK_RE.sub("", content)
        block = build_block(order, i, indent_before(stripped), nl)
        new = insert_block(content, block)
        if new is None:
            print(f"⚠️  Keine Einfügestelle gefunden: fragen/{it['file']}")
            continue
        if new != content:
            write(path, new)
            changed += 1
            print(f"✅ fragen/{it['file']}")

    css_changed = update_css()

    in_chain = {it["file"] for it in order}
    orphans = sorted(
        f for f in os.listdir(FRAGEN_DIR)
        if f.endswith(".html") and f not in in_chain and f not in IGNORIEREN
    )
    for f in orphans:
        print(f"⚠️  Nicht in der Kette (fehlt in index.html): fragen/{f}")

    broken = check_links(sorted(in_chain))

    print(f"\nFertig: {len(order)} Frageseiten in der Kette, {changed} aktualisiert"
          f"{', CSS aktualisiert' if css_changed else ''}, "
          f"{len(orphans)} nicht verlinkt, {broken} kaputte Links.")


if __name__ == "__main__":
    main()
