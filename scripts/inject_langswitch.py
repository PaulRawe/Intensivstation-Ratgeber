#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
inject_langswitch.py

Baut den sichtbaren Sprachumschalter in ALLE Seiten ein, die eine
Sprachentsprechung haben – auch in die deutschen Originalseiten.

Selbstpflegend: Die Zuordnung wird NICHT fest im Skript hinterlegt, sondern
aus den vorhandenen hreflang-Angaben der Sprachseiten abgeleitet. Sobald
/ru/ oder /pl/ im Repository liegen, erscheinen sie automatisch überall im
Umschalter – auch in den bereits vorhandenen türkischen Seiten.

Idempotent: Mehrfaches Ausführen ändert nichts, solange sich die
Sprachstruktur nicht ändert. Der eingefügte Block ist durch
<!-- LANGSWITCH_START --> und <!-- LANGSWITCH_END --> markiert und jederzeit
rückstandsfrei entfernbar.

Aufruf im Repository-Wurzelverzeichnis:
    python3 scripts/inject_langswitch.py
"""

import os
import re
import sys

BASE = "https://intensivstation-ratgeber.de"
LANG_DIRS = ["tr", "ru", "pl"]

START = "<!-- LANGSWITCH_START -->"
END = "<!-- LANGSWITCH_END -->"

# Anzeigename je Sprache
LABEL = {
    "de": "Deutsch",
    "tr": "Türkçe",
    "ru": "Русский",
    "pl": "Polski",
}

# Beschriftung der Leiste, jeweils in der Sprache der Seite + Deutsch
BAR_LABEL = {
    "de": "Sprache",
    "tr": "Dil / Sprache",
    "ru": "Язык / Sprache",
    "pl": "Język / Sprache",
}

# Tooltip für noch nicht verfügbare Sprachen
SOON = {
    "de": "Diese Sprachversion ist noch in Arbeit.",
    "tr": "Bu dil sürümü henüz hazırlanmaktadır.",
    "ru": "Эта языковая версия ещё готовится.",
    "pl": "Ta wersja językowa jest w przygotowaniu.",
}

ORDER = ["de", "tr", "ru", "pl"]


def rel_to_repo(path):
    """/fragen/x.html -> fragen/x.html ; / -> index.html"""
    p = path.lstrip("/")
    if p == "" or p.endswith("/"):
        p += "index.html"
    return p


def build_map(root):
    """
    Liest alle Sprachseiten und leitet daraus ab:
      urls[<repo-pfad>] = {"de": "/fragen/x.html", "tr": "/tr/sorular/y.html", ...}

    Grundlage ist der hreflang="de"-Verweis jeder Sprachseite. Damit ist die
    deutsche Seite der Anker, an dem alle Sprachen zusammenlaufen.
    """
    groups = {}  # de_path -> {lang: path}

    for lang in LANG_DIRS:
        d = os.path.join(root, lang)
        if not os.path.isdir(d):
            continue
        for dirpath, dirnames, filenames in os.walk(d):
            for fn in filenames:
                if not fn.endswith(".html"):
                    continue
                fp = os.path.join(dirpath, fn)
                with open(fp, "r", encoding="utf-8", errors="ignore") as f:
                    html = f.read()

                m_de = re.search(
                    r'<link rel="alternate" hreflang="de" href="'
                    + re.escape(BASE) + r'([^"]+)"', html)
                m_self = re.search(
                    r'<link rel="canonical" href="' + re.escape(BASE) + r'([^"]+)"',
                    html)
                if not m_de or not m_self:
                    print(f"  ! ohne hreflang/canonical, übersprungen: "
                          f"{os.path.relpath(fp, root)}")
                    continue

                de_path = m_de.group(1)
                groups.setdefault(de_path, {"de": de_path})[lang] = m_self.group(1)

    # Auf Repo-Pfade abbilden: jede beteiligte Seite bekommt dieselbe Gruppe
    urls = {}
    for de_path, langs in groups.items():
        for lang, path in langs.items():
            urls[rel_to_repo(path)] = (lang, langs)
    return urls


def switcher(current_lang, langs, depth):
    """Baut den HTML-Block. depth wird für den CSS-Pfad gebraucht."""
    parts = []
    for code in ORDER:
        label = LABEL[code]
        if code == current_lang:
            parts.append(
                f'<span class="lang-current" lang="{code}">{label}</span>')
        elif code in langs:
            parts.append(
                f'<a href="{langs[code]}" hreflang="{code}" lang="{code}">{label}</a>')
        else:
            parts.append(
                f'<span class="lang-off" lang="{code}" '
                f'title="{SOON[current_lang]}">{label}</span>')

    inner = "".join("\n        " + p for p in parts)
    return (f'{START}\n'
            f'<div class="lang-switch">\n'
            f'    <div class="lang-switch-inner">\n'
            f'        <span class="lang-switch-label">{BAR_LABEL[current_lang]}</span>'
            f'{inner}\n'
            f'    </div>\n'
            f'</div>\n'
            f'{END}')


def ensure_css(html):
    """
    css/i18n.css laden, falls noch nicht vorhanden.

    Normalfall: Pfadpräfix von style.css übernehmen, damit relative Pfade
    konsistent bleiben. Seiten ohne style.css (z. B. impressum.html mit
    Inline-CSS) bekommen den absoluten Pfad vor </head>.
    """
    if "css/i18n.css" in html:
        return html, False

    m = re.search(r'<link rel="stylesheet" href="([^"]*)css/style\.css">', html)
    if m:
        tag = f'\n    <link rel="stylesheet" href="{m.group(1)}css/i18n.css">'
        return html[:m.end()] + tag + html[m.end():], True

    m = re.search(r"</head>", html, re.I)
    if m:
        tag = '<link rel="stylesheet" href="/css/i18n.css">\n'
        return html[:m.start()] + tag + html[m.start():], True

    return html, False


def strip_old(html):
    """Vorhandenen Block entfernen – markiert oder als roher lang-switch-Div."""
    if START in html and END in html:
        return re.sub(re.escape(START) + r".*?" + re.escape(END) + r"\n?",
                      "", html, flags=re.S)
    return re.sub(r'<div class="lang-switch">.*?</div>\s*</div>\n?',
                  "", html, flags=re.S)


def main(root="."):
    urls = build_map(root)
    if not urls:
        print("Keine Sprachseiten gefunden – nichts zu tun.")
        return 0

    changed = same = 0
    for rel, (lang, langs) in sorted(urls.items()):
        fp = os.path.join(root, rel)
        if not os.path.exists(fp):
            print(f"  ! fehlt: {rel}")
            continue

        with open(fp, "r", encoding="utf-8", errors="ignore") as f:
            original = f.read()

        html, _ = ensure_css(original)
        html = strip_old(html)

        depth = rel.count(os.sep)
        block = switcher(lang, langs, depth)

        m = re.search(r"<body[^>]*>", html)
        if not m:
            print(f"  ! kein <body>: {rel}")
            continue
        html = html[:m.end()] + "\n\n" + block + "\n" + html[m.end():].lstrip("\n")

        if html == original:
            same += 1
            continue

        with open(fp, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  ✓ {rel}  [{lang}]  {'|'.join(k for k in ORDER if k in langs)}")
        changed += 1

    print(f"\nSprachen gefunden: "
          f"{', '.join(sorted({l for _, (l, _) in urls.items()}))}")
    print(f"Geändert: {changed} | unverändert: {same}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "."))
