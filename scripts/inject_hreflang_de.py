#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fügt in die deutschen Originalseiten die reziproken hreflang-Angaben ein.

Das ist die EINZIGE Änderung an deutschen Dateien. Eingefügt werden
ausschließlich <link rel="alternate" hreflang="..."> Zeilen direkt nach
dem vorhandenen Canonical-Tag. Es wird kein Text, keine Struktur und
kein Script verändert.

Hintergrund: Google wertet hreflang nur aus, wenn die Angaben
wechselseitig sind. Ohne diesen Schritt bleibt die gesamte
Sprachstruktur für Suchmaschinen wirkungslos.

Idempotent: mehrfaches Ausführen ändert nichts.

Aufruf im Repository-Wurzelverzeichnis:
    python3 scripts/inject_hreflang_de.py
"""

import os
import re
import sys

BASE = "https://intensivstation-ratgeber.de"

MARK_START = "<!-- HREFLANG_START -->"
MARK_END = "<!-- HREFLANG_END -->"

# deutsche Datei  ->  { sprachcode: pfad }
# Stand: Tuerkisch (tr) und Polnisch (pl) vollstaendig.
# Fuer Russisch spaeter analog "ru" ergaenzen und das Skript erneut ausfuehren.
MAP = {
    "index.html": {"tr": "/tr/", "pl": "/pl/"},
    "fragen/was-bedeutet-intensivstation.html": {"tr": "/tr/sorular/yogun-bakim-nedir.html", "pl": "/pl/pytania/czym-jest-oddzial-intensywnej-terapii.html"},
    "fragen/wann-darf-ich-besuchen.html": {"tr": "/tr/sorular/ne-zaman-ziyaret-edebilirim.html", "pl": "/pl/pytania/kiedy-moge-odwiedzic-bliskiego.html"},
    "fragen/besuchszeiten.html": {"tr": "/tr/sorular/ziyaret-saatleri.html", "pl": "/pl/pytania/godziny-odwiedzin.html"},
    "fragen/wieviele-besucher.html": {"tr": "/tr/sorular/kac-ziyaretci-girebilir.html", "pl": "/pl/pytania/ilu-odwiedzajacych-naraz.html"},
    "fragen/was-anziehen.html": {"tr": "/tr/sorular/ziyarette-ne-giyilir.html", "pl": "/pl/pytania/w-czym-przyjsc-na-odwiedziny.html"},
    "fragen/blumen-mitbringen.html": {"tr": "/tr/sorular/cicek-getirilebilir-mi.html", "pl": "/pl/pytania/czy-moge-przyniesc-kwiaty.html"},
    "fragen/uebernachten.html": {"tr": "/tr/sorular/yogun-bakimda-gece-kalmak.html", "pl": "/pl/pytania/czy-moge-zostac-na-noc.html"},
    "fragen/wie-lange-intensivstation.html": {"tr": "/tr/sorular/yogun-bakimda-ne-kadar-kalinir.html", "pl": "/pl/pytania/jak-dlugo-trwa-pobyt-na-oit.html"},
    "fragen/wie-bereite-ich-mich-vor.html": {"tr": "/tr/sorular/ilk-ziyarete-hazirlik.html", "pl": "/pl/pytania/jak-przygotowac-sie-do-pierwszej-wizyty.html"},
    "fragen/handy-auf-intensivstation.html": {"tr": "/tr/sorular/yogun-bakimda-cep-telefonu.html", "pl": "/pl/pytania/telefon-komorkowy-na-oit.html"},
    "fragen/was-ist-imc.html": {"tr": "/tr/sorular/imc-nedir.html", "pl": "/pl/pytania/co-oznacza-imc.html"},
    "fragen/intensivstation-finden.html": {"tr": "/tr/sorular/yogun-bakim-bolumunu-bulmak.html", "pl": "/pl/pytania/jak-znalezc-wlasciwy-oddzial.html"},
    "fragen/was-ist-kuenstliches-koma.html": {"tr": "/tr/sorular/yapay-koma-nedir.html", "pl": "/pl/pytania/czym-jest-spiaczka-farmakologiczna.html"},
    "fragen/wie-lange-kuenstliches-koma.html": {"tr": "/tr/sorular/yapay-koma-ne-kadar-surer.html", "pl": "/pl/pytania/jak-dlugo-trwa-spiaczka-farmakologiczna.html"},
    "fragen/wie-gefaehrlich.html": {"tr": "/tr/sorular/yapay-koma-tehlikeli-mi.html", "pl": "/pl/pytania/czy-spiaczka-farmakologiczna-jest-niebezpieczna.html"},
    "fragen/wann-aufwachen.html": {"tr": "/tr/sorular/ne-zaman-uyanir.html", "pl": "/pl/pytania/kiedy-bliski-sie-obudzi.html"},
    "fragen/aufwachphase-dauer.html": {"tr": "/tr/sorular/uyanma-sureci-ne-kadar-surer.html", "pl": "/pl/pytania/jak-dlugo-trwa-wybudzanie.html"},
    "fragen/was-passiert-beim-aufwachen.html": {"tr": "/tr/sorular/uyanirken-neler-olur.html", "pl": "/pl/pytania/co-dzieje-sie-podczas-wybudzania.html"},
    "fragen/alles-mitbekommen.html": {"tr": "/tr/sorular/yapay-komada-duyar-mi.html", "pl": "/pl/pytania/czy-bliski-w-spiaczce-cos-slyszy.html"},
    "fragen/kann-man-sterben.html": {"tr": "/tr/sorular/yapay-komada-olum-riski.html", "pl": "/pl/pytania/czy-mozna-umrzec-w-spiaczce-farmakologicznej.html"},
    "fragen/warum-kuenstliches-koma.html": {"tr": "/tr/sorular/neden-yapay-koma-uygulanir.html", "pl": "/pl/pytania/dlaczego-wprowadza-sie-w-spiaczke.html"},
    "fragen/traeumt-man-im-koma.html": {"tr": "/tr/sorular/yapay-komada-ruya-gorulur-mu.html", "pl": "/pl/pytania/czy-w-spiaczce-sie-sni.html"},
    "fragen/koma-beenden.html": {"tr": "/tr/sorular/yapay-koma-nasil-sonlandirilir.html", "pl": "/pl/pytania/jak-konczy-sie-spiaczka-farmakologiczna.html"},
    "fragen/was-bedeutet-kuenstliche-beatmung.html": {"tr": "/tr/sorular/yapay-solunum-nedir.html", "pl": "/pl/pytania/czym-jest-wentylacja-mechaniczna.html"},
    "fragen/wann-braucht-man-beatmung.html": {"tr": "/tr/sorular/ne-zaman-solunum-cihazi-gerekir.html", "pl": "/pl/pytania/kiedy-potrzebna-jest-wentylacja.html"},
    "fragen/wie-lange-beatmet.html": {"tr": "/tr/sorular/ne-kadar-sure-solunum-cihazina-baglanir.html", "pl": "/pl/pytania/jak-dlugo-mozna-byc-wentylowanym.html"},
    "fragen/beatmungsschlauch.html": {"tr": "/tr/sorular/solunum-hortumu-tup-nedir.html", "pl": "/pl/pytania/czym-jest-rurka-intubacyjna.html"},
    "fragen/luftroehrenschnitt.html": {"tr": "/tr/sorular/trakeotomi-nedir.html", "pl": "/pl/pytania/czym-jest-tracheotomia.html"},
    "fragen/sprechen-waehrend-beatmung.html": {"tr": "/tr/sorular/solunum-cihazindayken-konusabilir-mi.html", "pl": "/pl/pytania/czy-pacjent-wentylowany-moze-mowic.html"},
    "fragen/invasive-nicht-invasive-beatmung.html": {"tr": "/tr/sorular/invaziv-ve-noninvaziv-solunum-destegi.html", "pl": "/pl/pytania/wentylacja-inwazyjna-i-nieinwazyjna.html"},
    "fragen/mit-beatmung-essen.html": {"tr": "/tr/sorular/solunum-cihazindayken-yemek.html", "pl": "/pl/pytania/czy-mozna-jesc-przy-wentylacji.html"},
    "fragen/arztgespraech.html": {"tr": "/tr/sorular/doktor-gorusmesi-nasil-gecer.html", "pl": "/pl/pytania/jak-przebiega-rozmowa-z-lekarzem.html"},
    "fragen/welche-fragen-stellen.html": {"tr": "/tr/sorular/doktora-hangi-sorular-sorulmali.html", "pl": "/pl/pytania/jakie-pytania-zadac-lekarzowi.html"},
    "fragen/wer-gibt-auskunft.html": {"tr": "/tr/sorular/kim-bilgi-verir.html", "pl": "/pl/pytania/kto-udziela-informacji.html"},
    "fragen/telefonisch-auskunft.html": {"tr": "/tr/sorular/telefonla-bilgi-alinabilir-mi.html", "pl": "/pl/pytania/czy-moge-uzyskac-informacje-telefonicznie.html"},
    "fragen/zweite-meinung.html": {"tr": "/tr/sorular/ikinci-tibbi-gorus.html", "pl": "/pl/pytania/czy-moge-zasiegnac-drugiej-opinii.html"},
    "fragen/kann-mich-hoeren.html": {"tr": "/tr/sorular/yakinim-beni-duyabilir-mi.html", "pl": "/pl/pytania/czy-bliski-mnie-slyszy.html"},
    "fragen/kommunikation-beatmeter-patient.html": {"tr": "/tr/sorular/solunum-cihazina-bagli-hastayla-iletisim.html", "pl": "/pl/pytania/jak-rozmawiac-z-pacjentem-wentylowanym.html"},
    "fragen/erkennt-mich-nicht.html": {"tr": "/tr/sorular/yakinim-beni-neden-tanimiyor.html", "pl": "/pl/pytania/dlaczego-bliski-mnie-nie-poznaje.html"},
    "fragen/was-ist-sepsis.html": {"tr": "/tr/sorular/sepsis-nedir.html", "pl": "/pl/pytania/czym-jest-sepsa.html"},
    "fragen/was-ist-delir.html": {"tr": "/tr/sorular/deliryum-nedir.html", "pl": "/pl/pytania/czym-jest-majaczenie.html"},
    "fragen/was-sind-katecholamine.html": {"tr": "/tr/sorular/katekolaminler-nedir.html", "pl": "/pl/pytania/czym-sa-katecholaminy.html"},
    "fragen/dialyse-wann-noetig.html": {"tr": "/tr/sorular/diyaliz-ne-zaman-gerekir.html", "pl": "/pl/pytania/kiedy-potrzebna-jest-dializa.html"},
    "fragen/monitor-werte-bedeutung.html": {"tr": "/tr/sorular/monitordeki-degerler-ne-anlama-gelir.html", "pl": "/pl/pytania/co-oznaczaja-wartosci-na-monitorze.html"},
    "fragen/warum-viele-schlaeuche.html": {"tr": "/tr/sorular/neden-bu-kadar-cok-hortum-var.html", "pl": "/pl/pytania/dlaczego-jest-tyle-drenow-i-cewnikow.html"},
    "fragen/warum-keine-reaktion.html": {"tr": "/tr/sorular/neden-tepki-vermiyor.html", "pl": "/pl/pytania/dlaczego-bliski-nie-reaguje.html"},
    "fragen/warum-dauert-lange.html": {"tr": "/tr/sorular/neden-her-sey-bu-kadar-uzun-suruyor.html", "pl": "/pl/pytania/dlaczego-wszystko-trwa-tak-dlugo.html"},
    "fragen/ueberlebenschancen.html": {"tr": "/tr/sorular/yasama-sansi-nedir.html", "pl": "/pl/pytania/jakie-sa-szanse-przezycia.html"},
    "fragen/wird-wieder-gesund.html": {"tr": "/tr/sorular/yeniden-saglina-kavusur-mu.html", "pl": "/pl/pytania/czy-bliski-wyzdrowieje.html"},
    "fragen/wann-verlegung.html": {"tr": "/tr/sorular/yogun-bakimdan-ne-zaman-cikar.html", "pl": "/pl/pytania/kiedy-nastapi-przeniesienie-z-oit.html"},
    "fragen/was-kommt-danach.html": {"tr": "/tr/sorular/yogun-bakimdan-sonra-ne-olur.html", "pl": "/pl/pytania/co-dzieje-sie-po-oit.html"},
    "fragen/wie-aushalten.html": {"tr": "/tr/sorular/bu-duruma-nasil-dayanirim.html", "pl": "/pl/pytania/jak-wytrzymac-te-sytuacje.html"},
    "fragen/darf-ich-weinen.html": {"tr": "/tr/sorular/hastanin-yaninda-aglayabilir-miyim.html", "pl": "/pl/pytania/czy-moge-plakac-przy-bliskim.html"},
    "fragen/schuldgefuehle.html": {"tr": "/tr/sorular/sucluluk-duygusu.html", "pl": "/pl/pytania/jak-radzic-sobie-z-poczuciem-winy.html"},
    "fragen/hilfe-fuer-angehoerige.html": {"tr": "/tr/sorular/hasta-yakinlari-icin-destek.html", "pl": "/pl/pytania/gdzie-szukac-wsparcia-dla-bliskich.html"},
    "fragen/selbstfuersorge.html": {"tr": "/tr/sorular/kendinize-nasil-bakarsiniz.html", "pl": "/pl/pytania/jak-zadbac-o-siebie.html"},
    "fragen/kinder-informieren.html": {"tr": "/tr/sorular/cocuklara-nasil-anlatilir.html", "pl": "/pl/pytania/jak-wytlumaczyc-sytuacje-dzieciom.html"},
    "fragen/hoffnung-behalten.html": {"tr": "/tr/sorular/umudu-korumak.html", "pl": "/pl/pytania/jak-zachowac-nadzieje.html"},
    "fragen/kosten-intensivstation.html": {"tr": "/tr/sorular/yogun-bakim-masraflarini-kim-oder.html", "pl": "/pl/pytania/kto-placi-za-oddzial-intensywnej-terapii.html"},
    "fragen/was-kostet-intensivstation.html": {"tr": "/tr/sorular/yogun-bakimda-bir-gun-ne-kadar-tutar.html", "pl": "/pl/pytania/ile-kosztuje-dzien-na-oit.html"},
    "fragen/vollmacht-betreuung.html": {"tr": "/tr/sorular/vekaletname-ve-vesayet.html", "pl": "/pl/pytania/czy-potrzebne-jest-pelnomocnictwo.html"},
    "fragen/patientenverfuegung.html": {"tr": "/tr/sorular/hasta-vasiyeti-nedir.html", "pl": "/pl/pytania/czym-jest-oswiadczenie-woli-pacjenta.html"},
    "fragen/arbeitgeber-informieren.html": {"tr": "/tr/sorular/isverenimi-bilgilendirmeli-miyim.html", "pl": "/pl/pytania/czy-musze-poinformowac-pracodawce.html"},
    "fragen/pflegezeit.html": {"tr": "/tr/sorular/bakim-izni-var-mi.html", "pl": "/pl/pytania/czy-przysluguje-urlop-opiekunczy.html"},
    "fragen/krankschreibung-angehoerige.html": {"tr": "/tr/sorular/hasta-yakini-olarak-rapor-alabilir-miyim.html", "pl": "/pl/pytania/czy-moge-dostac-zwolnienie-lekarskie.html"},
    "fragen/langzeitbesuche-organisieren.html": {"tr": "/tr/sorular/uzaktan-gelenler-icin-konaklama.html", "pl": "/pl/pytania/jak-zorganizowac-odwiedziny-z-daleka.html"},
    "fragen/arbeit-des-angehoerigen.html": {"tr": "/tr/sorular/yakinimin-isi-ne-olacak.html", "pl": "/pl/pytania/co-z-praca-mojego-bliskiego.html"},
    "fragen/familie-informieren.html": {"tr": "/tr/sorular/aileyi-nasil-bilgilendiririm.html", "pl": "/pl/pytania/jak-poinformowac-rodzine.html"},
    "impressum.html": {"tr": "/tr/yasal-bilgiler.html", "pl": "/pl/informacje-prawne.html"},
}


def de_url(rel):
    return f"{BASE}/" if rel == "index.html" else f"{BASE}/{rel}"


def block(rel, alts):
    lines = [MARK_START,
             f'<link rel="alternate" hreflang="de" href="{de_url(rel)}">']
    for code, path in sorted(alts.items()):
        lines.append(f'<link rel="alternate" hreflang="{code}" href="{BASE}{path}">')
    lines.append(f'<link rel="alternate" hreflang="x-default" href="{de_url(rel)}">')
    lines.append(MARK_END)
    return "\n".join(lines)


def main(root="."):
    changed = skipped = missing = 0

    for rel, alts in MAP.items():
        path = os.path.join(root, rel)
        if not os.path.exists(path):
            print(f"⚠️  fehlt: {rel}")
            missing += 1
            continue

        with open(path, "r", encoding="utf-8", newline="") as f:
            html = f.read()

        new_block = block(rel, alts)

        if MARK_START in html:
            # bereits vorhanden -> nur aktualisieren
            updated = re.sub(
                re.escape(MARK_START) + r".*?" + re.escape(MARK_END),
                new_block.replace("\\", "\\\\"),
                html,
                flags=re.S,
            )
            if updated == html:
                print(f"⏭️  unverändert: {rel}")
                skipped += 1
                continue
            html = updated
        else:
            m = re.search(r'<link rel="canonical"[^>]*>', html)
            if m:
                html = html[:m.end()] + "\n" + new_block + html[m.end():]
            else:
                m = re.search(r"</head>", html, re.I)
                if not m:
                    print(f"❌ kein </head>: {rel}")
                    missing += 1
                    continue
                html = html[:m.start()] + new_block + "\n" + html[m.start():]

        with open(path, "w", encoding="utf-8", newline="") as f:
            f.write(html)
        print(f"✅ hreflang gesetzt: {rel}")
        changed += 1

    print(f"\nGeändert: {changed} | unverändert: {skipped} | Probleme: {missing}")
    return 0 if missing == 0 else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "."))
