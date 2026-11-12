#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
"Passend zu diesem Thema": Buchtipps in den Frageseiten
=======================================================

Schreibt in jede Frageseite (DE, PL, RU, TR) einen kleinen Kasten mit den
passenden eigenen Buechern/PDFs - direkt unter die Zusammenfassung.

Welche Seite welches Buch bekommt, steht in  bibliothek/produkte.json
unter "artikel" (deutscher Dateiname -> Liste von Produkt-IDs). Seiten ohne
Eintrag bekommen "artikel_standard". Die uebersetzten Seiten finden ihre
deutsche Vorlage ueber den hreflang-Eintrag und nehmen dieselben Produkte -
gibt es ein Buch in der Sprache der Seite (z.B. das tuerkische Intensiv-
tagebuch), wird automatisch diese Ausgabe gezeigt.

Der Kasten steht zwischen BUCHTIPP_START / BUCHTIPP_END und wird bei jedem
Lauf neu geschrieben. Nicht von Hand darin editieren.

Zusaetzlich: entfernt das Gumroad-Skript (gumroad.js) aus allen Seiten - die
Kauf-Links funktionieren ohne, und es laedt keine Fremdskripte mehr.

Aufruf im Repository-Wurzelverzeichnis:
    python3 scripts/build_buchtipps.py
"""

import glob
import html
import json
import os
import re
import sys

DATEN = "bibliothek/produkte.json"
START, ENDE = "<!-- BUCHTIPP_START -->", "<!-- BUCHTIPP_END -->"
BLOCK_RE = re.compile(r"[ \t]*<!-- BUCHTIPP_START -->.*?<!-- BUCHTIPP_END -->[ \t]*\r?\n?", re.S)
GUMROAD_RE = re.compile(r'[ \t]*<script src="https://gumroad\.com/js/gumroad\.js"></script>[ \t]*\r?\n?')

ORDNER = {"de": "fragen", "pl": "pl/pytania", "ru": "ru/voprosy", "tr": "tr/sorular"}
ZUSATZ_DE = {"fuer-mitarbeiter.html": "fuer-mitarbeiter.html"}   # Seiten ausserhalb von fragen/

TEXTE = {
    "de": {"titel": "Passend zu diesem Thema", "hinweis": "Anzeige · eigene Bücher und Materialien des Autors",
           "amazon": "Bei Amazon ansehen", "gumroad": "Als PDF laden", "leseprobe": "Leseprobe",
           "nur_de": "", "mehr": "Alle Bücher und Materialien", "mehr_link": "/bibliothek/"},
    "pl": {"titel": "Pasujące do tematu", "hinweis": "Reklama · własne książki i materiały autora",
           "amazon": "Zobacz na Amazon", "gumroad": "Pobierz PDF", "leseprobe": "Fragment",
           "nur_de": "Tylko po niemiecku", "mehr": "Wszystkie książki i materiały", "mehr_link": "/pl/biblioteka/"},
    "ru": {"titel": "По этой теме", "hinweis": "Реклама · собственные книги и материалы автора",
           "amazon": "Посмотреть на Amazon", "gumroad": "Скачать PDF", "leseprobe": "Отрывок",
           "nur_de": "Только на немецком", "mehr": "Все книги и материалы", "mehr_link": "/ru/biblioteka/"},
    "tr": {"titel": "Bu konuyla ilgili", "hinweis": "Reklam · yazarın kendi kitapları ve materyalleri",
           "amazon": "Amazon'da görüntüle", "gumroad": "PDF olarak indir", "leseprobe": "Örnek bölüm",
           "nur_de": "Yalnızca Almanca", "mehr": "Tüm kitaplar ve materyaller", "mehr_link": "/tr/kutuphane/"},
}


def e(s):
    return html.escape(s or "", quote=True)


def lesen(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def schreiben(p, t):
    with open(p, "w", encoding="utf-8", newline="") as f:
        f.write(t)


def element_ende(text, start, tag="div"):
    tiefe = 0
    for m in re.finditer(r"<(/?)%s\b[^>]*>" % tag, text[start:]):
        tiefe += -1 if m.group(1) else 1
        if tiefe == 0:
            return start + m.end()
    return -1


def kasten(produkte, lang):
    T = TEXTE[lang]
    karten = []
    for p in produkte:
        bild = ('<img class="bt-cover" src="%s" alt="" loading="lazy" width="84" height="116">' % e(p["cover"])
                if p.get("cover") else '<div class="bt-cover bt-cover-leer" aria-hidden="true">PDF</div>')
        hinweis = ""
        if p.get("tag") and lang in (p.get("vorn") or []):
            hinweis = '<span class="bt-sprache">%s</span>' % e(p["tag"])
        elif lang != "de" and lang not in (p.get("sprache_von") or []) and T["nur_de"]:
            hinweis = '<span class="bt-sprache">%s</span>' % e(T["nur_de"])
        knoepfe = ""
        if p.get("amazon"):
            knoepfe += ('<a class="bt-btn" href="%s" target="_blank" rel="noopener sponsored">%s</a>'
                        % (e(p["amazon"]), e(T["amazon"])))
        if p.get("gumroad"):
            knoepfe += ('<a class="bt-btn bt-btn-pdf" href="%s" target="_blank" rel="noopener sponsored">%s</a>'
                        % (e(p["gumroad"]), e(T["gumroad"])))
        if p.get("leseprobe"):
            knoepfe += '<a class="bt-link" href="%s">%s</a>' % (e(p["leseprobe"]), e(T["leseprobe"]))
        karten.append(
            '<div class="bt-karte">%s<div class="bt-text"><p class="bt-name">%s %s</p>'
            '<p class="bt-kurz">%s</p><div class="bt-knoepfe">%s</div></div></div>'
            % (bild, e(p["titel"]), hinweis, e(p["kurz"]), knoepfe))
    return (START + '\n<aside class="buchtipp" aria-label="%s"><p class="bt-titel">%s</p>'
            '<p class="bt-hinweis">%s</p>%s<p class="bt-mehr"><a href="%s">%s →</a></p></aside>\n'
            % (e(T["titel"]), e(T["titel"]), e(T["hinweis"]), "".join(karten), T["mehr_link"], e(T["mehr"]))
            + ENDE + "\n")


def einsetzen(text, block):
    text = BLOCK_RE.sub("", text)
    m = re.search(r'<div class="summary-box"', text)
    if m:
        pos = element_ende(text, m.start())
    else:
        m = re.search(r"<!-- CROSSLINKS_START|<div class=\"ql-nav\"", text)
        pos = m.start() if m else text.rfind("</main>")
    if pos <= 0:
        return None
    return text[:pos].rstrip() + "\n\n                " + block + text[pos:].lstrip("\n")


def de_vorlage(text):
    m = re.search(r'<link rel="alternate" hreflang="de" href="https://intensivstation-ratgeber\.de/([^"]+)"', text)
    return m.group(1) if m else None


def main():
    daten = json.load(open(DATEN, encoding="utf-8"))
    nach_id = {p["id"]: p for p in daten["produkte"]}
    zuordnung = daten.get("artikel", {})
    standard = daten.get("artikel_standard", [])

    # Sprachausgaben: Produkt-ID -> {sprache: ID der eigenen Ausgabe}
    ersatz = {}
    for p in daten["produkte"]:
        for lang in p.get("vorn", []):
            if p.get("ausgabe_von"):
                ersatz.setdefault(p["ausgabe_von"], {})[lang] = p["id"]

    def produkte_fuer(de_datei, lang):
        ids = zuordnung.get(de_datei, standard)
        liste = []
        for i in ids:
            i = ersatz.get(i, {}).get(lang, i)
            p = nach_id.get(i)
            if p is None:
                print("WARNUNG: unbekannte Produkt-ID", i, "fuer", de_datei)
                continue
            p = dict(p)
            if p["id"] != i or lang in p.get("vorn", []):
                p["sprache_von"] = p.get("vorn", [])
            liste.append(p)
        return liste[:2]

    geaendert, ohne = [], []
    for lang, ordner in ORDNER.items():
        dateien = sorted(glob.glob(os.path.join(ordner, "*.html")))
        if lang == "de":
            dateien += list(ZUSATZ_DE)
        for pfad in dateien:
            if "LESEPROBE" in pfad.upper():
                continue
            t = lesen(pfad)
            t2 = GUMROAD_RE.sub("", t)
            if lang == "de":
                de_datei = pfad.replace(os.sep, "/")
            else:
                de_datei = de_vorlage(t)
            liste = produkte_fuer(de_datei, lang) if de_datei else []
            if liste:
                neu = einsetzen(t2, kasten(liste, lang))
                if neu is None:
                    ohne.append(pfad)
                else:
                    t2 = neu
            if t2 != t:
                schreiben(pfad, t2)
                geaendert.append(pfad)

    # Gumroad-Skript auch aus allen uebrigen Seiten entfernen
    for pfad in glob.glob("**/*.html", recursive=True):
        if pfad.startswith((".git", "node_modules")):
            continue
        t = lesen(pfad)
        t2 = GUMROAD_RE.sub("", t)
        if t2 != t:
            schreiben(pfad, t2)
            if pfad not in geaendert:
                geaendert.append(pfad)

    print("Geaendert: %d Seiten" % len(geaendert))
    for p in ohne:
        print("WARNUNG: keine Einfuegestelle gefunden in", p)
    return 0


if __name__ == "__main__":
    sys.exit(main())
