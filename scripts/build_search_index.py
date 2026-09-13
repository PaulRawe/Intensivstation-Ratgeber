#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_search_index.py

Erzeugt für jede vorhandene Sprache einen Suchindex und bindet die Suche ein.

Sprachneutral: Die Sprachen werden nicht fest im Skript hinterlegt, sondern
am Dateisystem erkannt. Das Wurzelverzeichnis ist immer Deutsch; jedes
Verzeichnis aus LANG_DIRS, das existiert, kommt automatisch dazu. Sobald
/ru/ oder /pl/ im Repository liegen, bekommen sie ohne Anpassung ihren
eigenen Index und ihre eigene Suchmaske.

Erzeugt:
    search/index-de.json, search/index-tr.json, ...

Bindet ein (idempotent, per Marker):
    <link rel="stylesheet" href=".../css/search.css">
    <script src=".../js/search.js" defer></script>

Aufruf im Repository-Wurzelverzeichnis:
    python3 scripts/build_search_index.py
"""

import html as htmlmod
import json
import os
import re
import sys

LANG_DIRS = ["tr", "ru", "pl"]

START = "<!-- SEARCH_START -->"
END = "<!-- SEARCH_END -->"

# Nicht indexieren: Produkt-, Rechts- und Hilfsseiten
SKIP_NAMES = {
    "download.html", "impressum.html", "datenschutz.html", "agb.html",
    "widerruf.html", "404.html", "danke.html",
    "ueber-mich.html", "fuer-mitarbeiter.html",
}
SKIP_PATTERNS = [
    re.compile(r"LESEPROBE", re.I),
    re.compile(r"^leseproben/"),
    re.compile(r"^geschichten/"),
    re.compile(r"^(pinterest|google|yandex|bing)[-0-9a-f]*\.html$", re.I),
    re.compile(r"leon-und-opas"),
]


def strip_tags(s):
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", htmlmod.unescape(s)).strip()


def page_lang(rel):
    """Erste Pfadkomponente bestimmt die Sprache; sonst Deutsch."""
    head = rel.split("/", 1)[0]
    return head if head in LANG_DIRS else "de"


def should_skip(rel):
    name = os.path.basename(rel)
    if name in SKIP_NAMES or name == "index.html":
        return True
    for p in SKIP_PATTERNS:
        if p.search(rel) or p.search(name):
            return True
    return False


def collect(root):
    """Liest alle Frageseiten ein und gruppiert sie nach Sprache."""
    index = {}

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames
                       if d not in (".git", ".github", "node_modules", "scripts", "search")]
        for fn in sorted(filenames):
            if not fn.endswith(".html"):
                continue
            fp = os.path.join(dirpath, fn)
            rel = os.path.relpath(fp, root).replace(os.sep, "/")
            if should_skip(rel):
                continue

            with open(fp, "r", encoding="utf-8", errors="ignore") as f:
                raw = f.read()

            # Sprachseiten, deren deutsches Gegenstück eine Rechts- oder
            # Hilfsseite ist, gehören nicht in die Suche. Das greift
            # automatisch auch für /ru/ und /pl/, ohne neue Dateinamen
            # im Skript zu pflegen.
            m_de = re.search(r'<link rel="alternate" hreflang="de" href="[^"]*?/([^/"]+\.html)"', raw)
            if m_de and m_de.group(1) in SKIP_NAMES:
                continue

            # Artikelüberschrift: das <h1>, das NICHT der Kopfzeilen-Titel ist
            h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", raw, re.S)
            h1s = [strip_tags(h) for h in h1s]
            h1s = [h for h in h1s if h and "Intensivstation Ratgeber" not in h]
            if not h1s:
                continue
            title = h1s[0]

            lang = page_lang(rel)

            # Zwischenüberschriften und Zusammenfassung als Suchtext
            h2s = [strip_tags(h) for h in re.findall(r"<h2[^>]*>(.*?)</h2>", raw, re.S)]
            h3s = [strip_tags(h) for h in re.findall(r"<h3[^>]*>(.*?)</h3>", raw, re.S)]
            summary = re.search(r'<div class="summary-box">(.*?)</div>', raw, re.S)
            bullets = []
            if summary:
                bullets = [strip_tags(li) for li
                           in re.findall(r"<li[^>]*>(.*?)</li>", summary.group(1), re.S)]

            desc = ""
            m = re.search(r'name="description" content="([^"]*)"', raw)
            if m:
                desc = htmlmod.unescape(m.group(1))

            # Deutsche Fachbegriffe aus den Sprachseiten mit aufnehmen.
            # Angehörige suchen oft mit dem Wort, das sie auf Station gehört
            # haben – „koma“ soll auch „künstliches Koma“ finden.
            de_terms = []
            if lang != "de":
                de_terms = [strip_tags(t) for t in
                            re.findall(r'<[^>]*lang="de"[^>]*>(.*?)</[a-z]+>', raw, re.S)]
                de_terms = sorted({t for t in de_terms if 2 < len(t) < 60})

            keywords = " ".join(filter(None, [desc] + h2s + h3s + bullets + de_terms))

            index.setdefault(lang, []).append({
                "t": title,
                "u": "/" + rel,
                "k": keywords[:1200],
            })

    return index


def write_indexes(root, index):
    outdir = os.path.join(root, "search")
    os.makedirs(outdir, exist_ok=True)
    written = []
    for lang, items in sorted(index.items()):
        items.sort(key=lambda x: x["t"])
        path = os.path.join(outdir, f"index-{lang}.json")
        payload = {"lang": lang, "count": len(items), "items": items}
        new = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        old = None
        if os.path.exists(path):
            old = open(path, encoding="utf-8").read()
        if old != new:
            with open(path, "w", encoding="utf-8", newline="\n") as f:
                f.write(new)
            print(f"  ✓ search/index-{lang}.json  ({len(items)} Einträge)")
            written.append(lang)
        else:
            print(f"  = search/index-{lang}.json  ({len(items)} Einträge, unverändert)")
    return written


def inject_assets(root, langs):
    """Bindet search.css und search.js in die Startseiten der Sprachen ein."""
    targets = ["index.html"] + [f"{l}/index.html" for l in langs if l != "de"]
    changed = 0

    for rel in targets:
        fp = os.path.join(root, rel)
        if not os.path.exists(fp):
            continue
        with open(fp, "r", encoding="utf-8", errors="ignore") as f:
            original = f.read()

        prefix = "../" * rel.count("/")
        block = (f"{START}\n"
                 f'<link rel="stylesheet" href="{prefix}css/search.css">\n'
                 f'<script src="{prefix}js/search.js" defer></script>\n'
                 f"{END}")

        html = re.sub(re.escape(START) + r".*?" + re.escape(END) + r"\n?",
                      "", original, flags=re.S)

        m = re.search(r"</head>", html, re.I)
        if not m:
            print(f"  ! kein </head>: {rel}")
            continue
        html = html[:m.start()] + block + "\n" + html[m.start():]

        if html != original:
            with open(fp, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"  ✓ Suche eingebunden: {rel}")
            changed += 1

    return changed


def main(root="."):
    print("Seiten einlesen …")
    index = collect(root)
    if not index:
        print("Keine indexierbaren Seiten gefunden.")
        return 0

    print("\nIndizes schreiben …")
    write_indexes(root, index)

    print("\nSuche einbinden …")
    n = inject_assets(root, sorted(index.keys()))

    print(f"\nSprachen: {', '.join(f'{k} ({len(v)})' for k, v in sorted(index.items()))}")
    print(f"Startseiten angepasst: {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "."))
