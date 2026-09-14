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
# Stand: Tuerkisch (tr), Polnisch (pl) und Russisch (ru) vollstaendig.
# Weitere Sprachen spaeter analog ergaenzen und das Skript erneut ausfuehren.
MAP = {
    "index.html": {"tr": "/tr/", "pl": "/pl/", "ru": "/ru/"},
    "fragen/was-bedeutet-intensivstation.html": {"tr": "/tr/sorular/yogun-bakim-nedir.html", "pl": "/pl/pytania/czym-jest-oddzial-intensywnej-terapii.html", "ru": "/ru/voprosy/chto-takoe-otdelenie-intensivnoy-terapii.html"},
    "fragen/wann-darf-ich-besuchen.html": {"tr": "/tr/sorular/ne-zaman-ziyaret-edebilirim.html", "pl": "/pl/pytania/kiedy-moge-odwiedzic-bliskiego.html", "ru": "/ru/voprosy/kogda-mozhno-navestit-blizkogo.html"},
    "fragen/besuchszeiten.html": {"tr": "/tr/sorular/ziyaret-saatleri.html", "pl": "/pl/pytania/godziny-odwiedzin.html", "ru": "/ru/voprosy/chasy-poseshcheniy.html"},
    "fragen/wieviele-besucher.html": {"tr": "/tr/sorular/kac-ziyaretci-girebilir.html", "pl": "/pl/pytania/ilu-odwiedzajacych-naraz.html", "ru": "/ru/voprosy/skolko-posetiteley-odnovremenno.html"},
    "fragen/was-anziehen.html": {"tr": "/tr/sorular/ziyarette-ne-giyilir.html", "pl": "/pl/pytania/w-czym-przyjsc-na-odwiedziny.html", "ru": "/ru/voprosy/v-chem-prihodit-na-poseshchenie.html"},
    "fragen/blumen-mitbringen.html": {"tr": "/tr/sorular/cicek-getirilebilir-mi.html", "pl": "/pl/pytania/czy-moge-przyniesc-kwiaty.html", "ru": "/ru/voprosy/mozhno-li-prinesti-cvety.html"},
    "fragen/uebernachten.html": {"tr": "/tr/sorular/yogun-bakimda-gece-kalmak.html", "pl": "/pl/pytania/czy-moge-zostac-na-noc.html", "ru": "/ru/voprosy/mozhno-li-ostatsya-na-noch.html"},
    "fragen/wie-lange-intensivstation.html": {"tr": "/tr/sorular/yogun-bakimda-ne-kadar-kalinir.html", "pl": "/pl/pytania/jak-dlugo-trwa-pobyt-na-oit.html", "ru": "/ru/voprosy/skolko-dlitsya-prebyvanie-v-orit.html"},
    "fragen/wie-bereite-ich-mich-vor.html": {"tr": "/tr/sorular/ilk-ziyarete-hazirlik.html", "pl": "/pl/pytania/jak-przygotowac-sie-do-pierwszej-wizyty.html", "ru": "/ru/voprosy/kak-podgotovitsya-k-pervomu-vizitu.html"},
    "fragen/handy-auf-intensivstation.html": {"tr": "/tr/sorular/yogun-bakimda-cep-telefonu.html", "pl": "/pl/pytania/telefon-komorkowy-na-oit.html", "ru": "/ru/voprosy/mobilnyy-telefon-v-orit.html"},
    "fragen/was-ist-imc.html": {"tr": "/tr/sorular/imc-nedir.html", "pl": "/pl/pytania/co-oznacza-imc.html", "ru": "/ru/voprosy/chto-oznachaet-imc.html"},
    "fragen/intensivstation-finden.html": {"tr": "/tr/sorular/yogun-bakim-bolumunu-bulmak.html", "pl": "/pl/pytania/jak-znalezc-wlasciwy-oddzial.html", "ru": "/ru/voprosy/kak-nayti-nuzhnoe-otdelenie.html"},
    "fragen/was-ist-kuenstliches-koma.html": {"tr": "/tr/sorular/yapay-koma-nedir.html", "pl": "/pl/pytania/czym-jest-spiaczka-farmakologiczna.html", "ru": "/ru/voprosy/chto-takoe-medikamentoznaya-koma.html"},
    "fragen/wie-lange-kuenstliches-koma.html": {"tr": "/tr/sorular/yapay-koma-ne-kadar-surer.html", "pl": "/pl/pytania/jak-dlugo-trwa-spiaczka-farmakologiczna.html", "ru": "/ru/voprosy/skolko-dlitsya-medikamentoznaya-koma.html"},
    "fragen/wie-gefaehrlich.html": {"tr": "/tr/sorular/yapay-koma-tehlikeli-mi.html", "pl": "/pl/pytania/czy-spiaczka-farmakologiczna-jest-niebezpieczna.html", "ru": "/ru/voprosy/opasna-li-medikamentoznaya-koma.html"},
    "fragen/wann-aufwachen.html": {"tr": "/tr/sorular/ne-zaman-uyanir.html", "pl": "/pl/pytania/kiedy-bliski-sie-obudzi.html", "ru": "/ru/voprosy/kogda-blizkiy-prosnetsya.html"},
    "fragen/aufwachphase-dauer.html": {"tr": "/tr/sorular/uyanma-sureci-ne-kadar-surer.html", "pl": "/pl/pytania/jak-dlugo-trwa-wybudzanie.html", "ru": "/ru/voprosy/skolko-dlitsya-probuzhdenie.html"},
    "fragen/was-passiert-beim-aufwachen.html": {"tr": "/tr/sorular/uyanirken-neler-olur.html", "pl": "/pl/pytania/co-dzieje-sie-podczas-wybudzania.html", "ru": "/ru/voprosy/chto-proishodit-pri-probuzhdenii.html"},
    "fragen/alles-mitbekommen.html": {"tr": "/tr/sorular/yapay-komada-duyar-mi.html", "pl": "/pl/pytania/czy-bliski-w-spiaczce-cos-slyszy.html", "ru": "/ru/voprosy/slyshit-li-pacient-v-kome.html"},
    "fragen/kann-man-sterben.html": {"tr": "/tr/sorular/yapay-komada-olum-riski.html", "pl": "/pl/pytania/czy-mozna-umrzec-w-spiaczce-farmakologicznej.html", "ru": "/ru/voprosy/mozhno-li-umeret-v-medikamentoznoy-kome.html"},
    "fragen/warum-kuenstliches-koma.html": {"tr": "/tr/sorular/neden-yapay-koma-uygulanir.html", "pl": "/pl/pytania/dlaczego-wprowadza-sie-w-spiaczke.html", "ru": "/ru/voprosy/pochemu-vvodyat-v-komu.html"},
    "fragen/traeumt-man-im-koma.html": {"tr": "/tr/sorular/yapay-komada-ruya-gorulur-mu.html", "pl": "/pl/pytania/czy-w-spiaczce-sie-sni.html", "ru": "/ru/voprosy/snyatsya-li-sny-v-kome.html"},
    "fragen/koma-beenden.html": {"tr": "/tr/sorular/yapay-koma-nasil-sonlandirilir.html", "pl": "/pl/pytania/jak-konczy-sie-spiaczka-farmakologiczna.html", "ru": "/ru/voprosy/kak-zavershayut-medikamentoznuyu-komu.html"},
    "fragen/was-bedeutet-kuenstliche-beatmung.html": {"tr": "/tr/sorular/yapay-solunum-nedir.html", "pl": "/pl/pytania/czym-jest-wentylacja-mechaniczna.html", "ru": "/ru/voprosy/chto-takoe-iskusstvennaya-ventilyaciya-legkih.html"},
    "fragen/wann-braucht-man-beatmung.html": {"tr": "/tr/sorular/ne-zaman-solunum-cihazi-gerekir.html", "pl": "/pl/pytania/kiedy-potrzebna-jest-wentylacja.html", "ru": "/ru/voprosy/kogda-nuzhna-ivl.html"},
    "fragen/wie-lange-beatmet.html": {"tr": "/tr/sorular/ne-kadar-sure-solunum-cihazina-baglanir.html", "pl": "/pl/pytania/jak-dlugo-mozna-byc-wentylowanym.html", "ru": "/ru/voprosy/kak-dolgo-mozhno-byt-na-ivl.html"},
    "fragen/beatmungsschlauch.html": {"tr": "/tr/sorular/solunum-hortumu-tup-nedir.html", "pl": "/pl/pytania/czym-jest-rurka-intubacyjna.html", "ru": "/ru/voprosy/chto-takoe-intubacionnaya-trubka.html"},
    "fragen/luftroehrenschnitt.html": {"tr": "/tr/sorular/trakeotomi-nedir.html", "pl": "/pl/pytania/czym-jest-tracheotomia.html", "ru": "/ru/voprosy/chto-takoe-traheotomiya.html"},
    "fragen/sprechen-waehrend-beatmung.html": {"tr": "/tr/sorular/solunum-cihazindayken-konusabilir-mi.html", "pl": "/pl/pytania/czy-pacjent-wentylowany-moze-mowic.html", "ru": "/ru/voprosy/mozhet-li-pacient-na-ivl-govorit.html"},
    "fragen/invasive-nicht-invasive-beatmung.html": {"tr": "/tr/sorular/invaziv-ve-noninvaziv-solunum-destegi.html", "pl": "/pl/pytania/wentylacja-inwazyjna-i-nieinwazyjna.html", "ru": "/ru/voprosy/invazivnaya-i-neinvazivnaya-ivl.html"},
    "fragen/mit-beatmung-essen.html": {"tr": "/tr/sorular/solunum-cihazindayken-yemek.html", "pl": "/pl/pytania/czy-mozna-jesc-przy-wentylacji.html", "ru": "/ru/voprosy/mozhno-li-est-pri-ivl.html"},
    "fragen/arztgespraech.html": {"tr": "/tr/sorular/doktor-gorusmesi-nasil-gecer.html", "pl": "/pl/pytania/jak-przebiega-rozmowa-z-lekarzem.html", "ru": "/ru/voprosy/kak-prohodit-razgovor-s-vrachom.html"},
    "fragen/welche-fragen-stellen.html": {"tr": "/tr/sorular/doktora-hangi-sorular-sorulmali.html", "pl": "/pl/pytania/jakie-pytania-zadac-lekarzowi.html", "ru": "/ru/voprosy/kakie-voprosy-zadat-vrachu.html"},
    "fragen/wer-gibt-auskunft.html": {"tr": "/tr/sorular/kim-bilgi-verir.html", "pl": "/pl/pytania/kto-udziela-informacji.html", "ru": "/ru/voprosy/kto-daet-informaciyu.html"},
    "fragen/telefonisch-auskunft.html": {"tr": "/tr/sorular/telefonla-bilgi-alinabilir-mi.html", "pl": "/pl/pytania/czy-moge-uzyskac-informacje-telefonicznie.html", "ru": "/ru/voprosy/mozhno-li-uznat-po-telefonu.html"},
    "fragen/zweite-meinung.html": {"tr": "/tr/sorular/ikinci-tibbi-gorus.html", "pl": "/pl/pytania/czy-moge-zasiegnac-drugiej-opinii.html", "ru": "/ru/voprosy/mozhno-li-poluchit-vtoroe-mnenie.html"},
    "fragen/kann-mich-hoeren.html": {"tr": "/tr/sorular/yakinim-beni-duyabilir-mi.html", "pl": "/pl/pytania/czy-bliski-mnie-slyszy.html", "ru": "/ru/voprosy/slyshit-li-menya-blizkiy.html"},
    "fragen/kommunikation-beatmeter-patient.html": {"tr": "/tr/sorular/solunum-cihazina-bagli-hastayla-iletisim.html", "pl": "/pl/pytania/jak-rozmawiac-z-pacjentem-wentylowanym.html", "ru": "/ru/voprosy/kak-obshchatsya-s-pacientom-na-ivl.html"},
    "fragen/erkennt-mich-nicht.html": {"tr": "/tr/sorular/yakinim-beni-neden-tanimiyor.html", "pl": "/pl/pytania/dlaczego-bliski-mnie-nie-poznaje.html", "ru": "/ru/voprosy/pochemu-blizkiy-menya-ne-uznaet.html"},
    "fragen/was-ist-sepsis.html": {"tr": "/tr/sorular/sepsis-nedir.html", "pl": "/pl/pytania/czym-jest-sepsa.html", "ru": "/ru/voprosy/chto-takoe-sepsis.html"},
    "fragen/was-ist-delir.html": {"tr": "/tr/sorular/deliryum-nedir.html", "pl": "/pl/pytania/czym-jest-majaczenie.html", "ru": "/ru/voprosy/chto-takoe-deliriy.html"},
    "fragen/was-sind-katecholamine.html": {"tr": "/tr/sorular/katekolaminler-nedir.html", "pl": "/pl/pytania/czym-sa-katecholaminy.html", "ru": "/ru/voprosy/chto-takoe-kateholaminy.html"},
    "fragen/dialyse-wann-noetig.html": {"tr": "/tr/sorular/diyaliz-ne-zaman-gerekir.html", "pl": "/pl/pytania/kiedy-potrzebna-jest-dializa.html", "ru": "/ru/voprosy/kogda-nuzhen-dializ.html"},
    "fragen/monitor-werte-bedeutung.html": {"tr": "/tr/sorular/monitordeki-degerler-ne-anlama-gelir.html", "pl": "/pl/pytania/co-oznaczaja-wartosci-na-monitorze.html", "ru": "/ru/voprosy/chto-oznachayut-pokazateli-na-monitore.html"},
    "fragen/warum-viele-schlaeuche.html": {"tr": "/tr/sorular/neden-bu-kadar-cok-hortum-var.html", "pl": "/pl/pytania/dlaczego-jest-tyle-drenow-i-cewnikow.html", "ru": "/ru/voprosy/pochemu-tak-mnogo-trubok-i-katetrov.html"},
    "fragen/warum-keine-reaktion.html": {"tr": "/tr/sorular/neden-tepki-vermiyor.html", "pl": "/pl/pytania/dlaczego-bliski-nie-reaguje.html", "ru": "/ru/voprosy/pochemu-blizkiy-ne-reagiruet.html"},
    "fragen/warum-dauert-lange.html": {"tr": "/tr/sorular/neden-her-sey-bu-kadar-uzun-suruyor.html", "pl": "/pl/pytania/dlaczego-wszystko-trwa-tak-dlugo.html", "ru": "/ru/voprosy/pochemu-vse-dlitsya-tak-dolgo.html"},
    "fragen/ueberlebenschancen.html": {"tr": "/tr/sorular/yasama-sansi-nedir.html", "pl": "/pl/pytania/jakie-sa-szanse-przezycia.html", "ru": "/ru/voprosy/kakovy-shansy-na-vyzhivanie.html"},
    "fragen/wird-wieder-gesund.html": {"tr": "/tr/sorular/yeniden-saglina-kavusur-mu.html", "pl": "/pl/pytania/czy-bliski-wyzdrowieje.html", "ru": "/ru/voprosy/vyzdoroveet-li-blizkiy.html"},
    "fragen/wann-verlegung.html": {"tr": "/tr/sorular/yogun-bakimdan-ne-zaman-cikar.html", "pl": "/pl/pytania/kiedy-nastapi-przeniesienie-z-oit.html", "ru": "/ru/voprosy/kogda-perevedut-iz-orit.html"},
    "fragen/was-kommt-danach.html": {"tr": "/tr/sorular/yogun-bakimdan-sonra-ne-olur.html", "pl": "/pl/pytania/co-dzieje-sie-po-oit.html", "ru": "/ru/voprosy/chto-budet-posle-orit.html"},
    "fragen/wie-aushalten.html": {"tr": "/tr/sorular/bu-duruma-nasil-dayanirim.html", "pl": "/pl/pytania/jak-wytrzymac-te-sytuacje.html", "ru": "/ru/voprosy/kak-perezhit-etu-situaciyu.html"},
    "fragen/darf-ich-weinen.html": {"tr": "/tr/sorular/hastanin-yaninda-aglayabilir-miyim.html", "pl": "/pl/pytania/czy-moge-plakac-przy-bliskim.html", "ru": "/ru/voprosy/mozhno-li-plakat-ryadom-s-blizkim.html"},
    "fragen/schuldgefuehle.html": {"tr": "/tr/sorular/sucluluk-duygusu.html", "pl": "/pl/pytania/jak-radzic-sobie-z-poczuciem-winy.html", "ru": "/ru/voprosy/kak-spravitsya-s-chuvstvom-viny.html"},
    "fragen/hilfe-fuer-angehoerige.html": {"tr": "/tr/sorular/hasta-yakinlari-icin-destek.html", "pl": "/pl/pytania/gdzie-szukac-wsparcia-dla-bliskich.html", "ru": "/ru/voprosy/gde-poluchit-podderzhku-blizkim.html"},
    "fragen/selbstfuersorge.html": {"tr": "/tr/sorular/kendinize-nasil-bakarsiniz.html", "pl": "/pl/pytania/jak-zadbac-o-siebie.html", "ru": "/ru/voprosy/kak-pozabotitsya-o-sebe.html"},
    "fragen/kinder-informieren.html": {"tr": "/tr/sorular/cocuklara-nasil-anlatilir.html", "pl": "/pl/pytania/jak-wytlumaczyc-sytuacje-dzieciom.html", "ru": "/ru/voprosy/kak-obyasnit-situaciyu-detyam.html"},
    "fragen/hoffnung-behalten.html": {"tr": "/tr/sorular/umudu-korumak.html", "pl": "/pl/pytania/jak-zachowac-nadzieje.html", "ru": "/ru/voprosy/kak-sohranit-nadezhdu.html"},
    "fragen/kosten-intensivstation.html": {"tr": "/tr/sorular/yogun-bakim-masraflarini-kim-oder.html", "pl": "/pl/pytania/kto-placi-za-oddzial-intensywnej-terapii.html", "ru": "/ru/voprosy/kto-platit-za-orit.html"},
    "fragen/was-kostet-intensivstation.html": {"tr": "/tr/sorular/yogun-bakimda-bir-gun-ne-kadar-tutar.html", "pl": "/pl/pytania/ile-kosztuje-dzien-na-oit.html", "ru": "/ru/voprosy/skolko-stoit-den-v-orit.html"},
    "fragen/vollmacht-betreuung.html": {"tr": "/tr/sorular/vekaletname-ve-vesayet.html", "pl": "/pl/pytania/czy-potrzebne-jest-pelnomocnictwo.html", "ru": "/ru/voprosy/nuzhna-li-doverennost.html"},
    "fragen/patientenverfuegung.html": {"tr": "/tr/sorular/hasta-vasiyeti-nedir.html", "pl": "/pl/pytania/czym-jest-oswiadczenie-woli-pacjenta.html", "ru": "/ru/voprosy/chto-takoe-patientenverfuegung.html"},
    "fragen/arbeitgeber-informieren.html": {"tr": "/tr/sorular/isverenimi-bilgilendirmeli-miyim.html", "pl": "/pl/pytania/czy-musze-poinformowac-pracodawce.html", "ru": "/ru/voprosy/nuzhno-li-soobshchat-rabotodatelyu.html"},
    "fragen/pflegezeit.html": {"tr": "/tr/sorular/bakim-izni-var-mi.html", "pl": "/pl/pytania/czy-przysluguje-urlop-opiekunczy.html", "ru": "/ru/voprosy/est-li-otpusk-po-uhodu.html"},
    "fragen/krankschreibung-angehoerige.html": {"tr": "/tr/sorular/hasta-yakini-olarak-rapor-alabilir-miyim.html", "pl": "/pl/pytania/czy-moge-dostac-zwolnienie-lekarskie.html", "ru": "/ru/voprosy/mogu-li-ya-poluchit-bolnichnyy.html"},
    "fragen/langzeitbesuche-organisieren.html": {"tr": "/tr/sorular/uzaktan-gelenler-icin-konaklama.html", "pl": "/pl/pytania/jak-zorganizowac-odwiedziny-z-daleka.html", "ru": "/ru/voprosy/kak-organizovat-poseshcheniya-izdaleka.html"},
    "fragen/arbeit-des-angehoerigen.html": {"tr": "/tr/sorular/yakinimin-isi-ne-olacak.html", "pl": "/pl/pytania/co-z-praca-mojego-bliskiego.html", "ru": "/ru/voprosy/chto-delat-s-rabotoy-blizkogo.html"},
    "fragen/familie-informieren.html": {"tr": "/tr/sorular/aileyi-nasil-bilgilendiririm.html", "pl": "/pl/pytania/jak-poinformowac-rodzine.html", "ru": "/ru/voprosy/kak-soobshchit-rodstvennikam.html"},
    "impressum.html": {"tr": "/tr/yasal-bilgiler.html", "pl": "/pl/informacje-prawne.html", "ru": "/ru/pravovaya-informaciya.html"},
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
