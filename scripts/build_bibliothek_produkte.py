#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bibliothek: Produktbereich aus bibliothek/produkte.json bauen
=============================================================

Die Bibliotheksseiten (DE/PL/RU/TR, je 4 Zielgruppen) bleiben wie sie sind -
nur der Kasten "Ratgeber und Materialien" wird aus der Produktliste neu
erzeugt. Ausserdem:
  - die Zaehler auf den 4 Bibliothek-Startseiten ("12 ratgeber und materialien")
  - die Produkte in der Bibliothek-Suche (bibliothek/suche-XX.json)

Aufruf im Repository-Wurzelverzeichnis:
    python3 scripts/build_bibliothek_produkte.py
"""

import html
import json
import os
import re
import sys

DATEN = "bibliothek/produkte.json"

SEITEN = {
    "de": {"start": "bibliothek/index.html", "zg": {
        "angehoerige": "bibliothek/angehoerige", "patienten": "bibliothek/patienten",
        "mitarbeiter": "bibliothek/mitarbeiter", "institutionen": "bibliothek/einrichtungen"}},
    "pl": {"start": "pl/biblioteka/index.html", "zg": {
        "angehoerige": "pl/biblioteka/bliscy", "patienten": "pl/biblioteka/pacjenci",
        "mitarbeiter": "pl/biblioteka/personel", "institutionen": "pl/biblioteka/instytucje"}},
    "ru": {"start": "ru/biblioteka/index.html", "zg": {
        "angehoerige": "ru/biblioteka/blizkie", "patienten": "ru/biblioteka/pacienty",
        "mitarbeiter": "ru/biblioteka/personal", "institutionen": "ru/biblioteka/uchrezhdeniya"}},
    "tr": {"start": "tr/kutuphane/index.html", "zg": {
        "angehoerige": "tr/kutuphane/yakinlar", "patienten": "tr/kutuphane/hastalar",
        "mitarbeiter": "tr/kutuphane/calisanlar", "institutionen": "tr/kutuphane/kurumlar"}},
}

START, ENDE = "<!-- PRODUKTE_START -->", "<!-- PRODUKTE_END -->"


def e(s):
    return html.escape(s or "", quote=True)


def lesen(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def schreiben(p, t):
    with open(p, "w", encoding="utf-8", newline="") as f:
        f.write(t)


def produkte_fuer(daten, lang, zg):
    liste = [p for p in daten["produkte"] if lang in p["seiten"] and zg in p["zg"]]
    vorn = [p for p in liste if lang in p.get("vorn", [])]
    rest = [p for p in liste if lang not in p.get("vorn", [])]
    return vorn + rest


def karte(p, lang, T, S):
    """T = Texte aus der Suche (Knopfbeschriftungen), S = Texte aus produkte.json"""
    tags = '<span class="bib-tag bib-tag-%s">%s</span>' % (
        "buch" if p["art"] == "buch" else "pdf", e(T["buch"] if p["art"] == "buch" else T["pdf"]))
    if p.get("tag"):
        tags += '<span class="bib-tag bib-tag-info">%s</span>' % e(p["tag"])
    elif lang != "de":
        tags += '<span class="bib-tag bib-tag-hinweis">%s</span>' % e(T["nur_de"])
    knoepfe = ""
    if p.get("amazon"):
        knoepfe += ('<a class="bib-btn bib-btn-amazon" href="%s" target="_blank" '
                    'rel="noopener sponsored">%s</a>' % (e(p["amazon"]), e(T["bei_amazon"])))
    if p.get("gumroad"):
        knoepfe += ('<a class="bib-btn bib-btn-gumroad" href="%s" target="_blank" '
                    'rel="noopener sponsored">%s</a>' % (e(p["gumroad"]), e(T["bei_gumroad"])))
    if p.get("leseprobe"):
        knoepfe += '<a class="bib-btn bib-btn-frei" href="%s">%s</a>' % (e(p["leseprobe"]), e(T["leseprobe"]))
    bild = ""
    if p.get("cover"):
        bild = ('<div class="bib-cover"><img src="%s" alt="%s" loading="lazy" width="220" height="300"></div>'
                % (e(p["cover"]), e(p["titel"])))
    ausgaben = ""
    if p.get("ausgaben"):
        links = " · ".join('<a href="%s" target="_blank" rel="noopener sponsored"><bdi>%s</bdi></a>'
                           % (e(a["amazon"]), e(a["sprache"])) for a in p["ausgaben"])
        ausgaben = '<p class="bib-ausgaben">%s %s</p>' % (e(S["ausgaben"]), links)
    return ('<article class="bib-karte" data-art="%s" data-id="%s">%s<div class="bib-tags">%s</div>'
            '<h3>%s</h3><p class="bib-kurz">%s</p>%s<div class="bib-btns">%s</div></article>'
            % (p["art"], e(p["id"]), bild, tags, e(p["titel"]), e(p["kurz"]), ausgaben, knoepfe))


def abschnitt_ersetzen(text, h2, neu):
    """Ersetzt den Abschnitt mit der Ueberschrift h2 (oder den markierten Bereich)."""
    if START in text:
        a = text.index(START)
        b = text.index(ENDE) + len(ENDE)
        return text[:a] + neu + text[b:]
    m = re.search(r'<section class="bib-block"><h2>%s</h2>' % re.escape(h2), text)
    if not m:
        return None
    b = text.index("</section>", m.end()) + len("</section>")
    return text[:m.start()] + neu + text[b:]


DL_START, DL_ENDE = "<!-- DOWNLOAD_BUECHER_START -->", "<!-- DOWNLOAD_BUECHER_END -->"
DL_AUSLASSEN = {"angehoerige-ratgeber", "patienten-ratgeber"}   # stehen dort schon als grosse Karten


def element_ende(text, start, tag="div"):
    tiefe = 0
    for m in re.finditer(r"<(/?)%s\b[^>]*>" % tag, text[start:]):
        tiefe += -1 if m.group(1) else 1
        if tiefe == 0:
            return start + m.end()
    return -1


def download_seite(daten):
    """Ergaenzt auf download.html die weiteren Buecher fuer Angehoerige und Patienten."""
    pfad = "download.html"
    if not os.path.exists(pfad):
        return False
    t = lesen(pfad)
    buecher = [p for p in daten["produkte"] if p["art"] == "buch" and "de" in p["seiten"]
               and p["id"] not in DL_AUSLASSEN and set(p["zg"]) & {"angehoerige", "patienten"}]
    karten = []
    for p in buecher:
        bild = ('<img src="%s" alt="%s" loading="lazy" width="150" height="205" '
                'style="width:150px;height:auto;border-radius:3px;box-shadow:0 3px 10px rgba(0,0,0,.18);margin:0 auto .8rem;display:block">'
                % (e(p["cover"]), e(p["titel"]))) if p.get("cover") else ""
        ausgaben = ""
        if p.get("ausgaben"):
            ausgaben = ('<p class="secure">Auch auf: %s</p>' % " · ".join(
                '<a href="%s" target="_blank" rel="noopener sponsored"><bdi>%s</bdi></a>' % (e(a["amazon"]), e(a["sprache"]))
                for a in p["ausgaben"]))
        karten.append(
            '<div class="card"><div class="card-body" style="text-align:center">%s<h3>%s</h3>'
            '<p class="sub" style="margin-top:.35rem">%s</p>'
            '<a href="%s" target="_blank" rel="noopener sponsored" class="btn btn-amazon">Bei Amazon ansehen →</a>%s</div></div>'
            % (bild, e(p["titel"]), e(p["kurz"]), e(p["amazon"]), ausgaben))
    block = (DL_START + '\n      <div class="section-title" style="margin-top:2.2rem">Weitere Bücher für diese Zeit</div>\n'
             '      <div class="section-sub">Zum Ausfüllen, Nachschlagen und Mitnehmen – für die Station und für zu Hause.</div>\n'
             '      <div class="grid2">%s</div>\n      ' % "".join(karten) + DL_ENDE)
    if DL_START in t:
        a = t.index(DL_START)
        b = t.index(DL_ENDE) + len(DL_ENDE)
        t2 = t[:a] + block + t[b:]
    else:
        m = re.search(r'<div class="amazon-section">', t)
        g = re.search(r'<div class="grid2">', t[m.end():]) if m else None
        if not g:
            print("WARNUNG: Amazon-Bereich auf download.html nicht gefunden")
            return False
        ende = element_ende(t, m.end() + g.start())
        t2 = t[:ende] + "\n\n      " + block + t[ende:]
    if t2 != t:
        schreiben(pfad, t2)
        return True
    return False


def main():
    daten = json.load(open(DATEN, encoding="utf-8"))
    geaendert = []

    for lang, cfg in SEITEN.items():
        suche_pfad = "bibliothek/suche-%s.json" % lang
        suche = json.load(open(suche_pfad, encoding="utf-8"))
        T = suche["texte"]
        S = daten["texte"][lang]

        # Ueberschrift des Produktkastens aus der Startseiten-Kachel ableiten
        zaehler = {}
        for zg, ordner in cfg["zg"].items():
            pfad = os.path.join(ordner, "index.html")
            if not os.path.exists(pfad):
                continue
            t = lesen(pfad)
            h2 = re.search(r'<section class="bib-block"><h2>([^<]+)</h2><p class="bib-werbung">', t)
            h2 = h2.group(1) if h2 else re.search(r"<h2>([^<]+)</h2>",
                                                  t[t.index(START):]).group(1) if START in t else None
            liste = produkte_fuer(daten, lang, zg)
            zaehler[ordner] = len(liste)
            if h2 is None:
                print("WARNUNG: kein Produktkasten in", pfad)
                continue
            neu = (START + '<section class="bib-block"><h2>%s</h2><p class="bib-werbung">%s</p>'
                   '<div class="bib-gitter">%s</div></section>' % (
                       e(h2), S["werbung"], "".join(karte(p, lang, T, S) for p in liste)) + ENDE)
            t2 = abschnitt_ersetzen(t, h2, neu)
            if t2 and t2 != t:
                schreiben(pfad, t2)
                geaendert.append(pfad)

        # Zaehler auf der Startseite
        start = cfg["start"]
        t = lesen(start)
        t2 = t
        for ordner, n in zaehler.items():
            href = "/" + ordner + "/"
            m = re.search(r'<a class="bib-zg-kachel" href="%s">.*?</a>' % re.escape(href), t2, re.S)
            if not m:
                continue
            kachel = re.sub(r"(\d+)( %s)" % re.escape(S["zaehler"]), lambda x: "%d%s" % (n, x.group(2)), m.group(0))
            t2 = t2[:m.start()] + kachel + t2[m.end():]
        if t2 != t:
            schreiben(start, t2)
            geaendert.append(start)

        # Suche: kostenlose Antworten behalten, Produkte neu
        frei = [x for x in suche["eintraege"] if x.get("art") == "frei"]
        prod = []
        for p in daten["produkte"]:
            if lang not in p["seiten"]:
                continue
            prod.append({
                "art": p["art"], "titel": p["titel"], "kurz": p["kurz"],
                "amazon": p.get("amazon"), "etsy": None, "gumroad": p.get("gumroad"),
                "leseprobe": p.get("leseprobe"), "cover": p.get("cover") or None,
                "zg": p["zg"], "nur_de": lang != "de" and not p.get("tag"), "en": False,
            })
        neu = dict(suche, eintraege=frei + prod)
        s_alt = lesen(suche_pfad)
        s_neu = json.dumps(neu, ensure_ascii=False, separators=(",", ":"))
        if json.loads(s_alt) != neu:
            schreiben(suche_pfad, s_neu)
            geaendert.append(suche_pfad)

    if download_seite(daten):
        geaendert.append("download.html")

    print("Geaendert: %d Dateien" % len(geaendert))
    for g in geaendert:
        print("  -", g)
    return 0


if __name__ == "__main__":
    sys.exit(main())
