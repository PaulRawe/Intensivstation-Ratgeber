#!/usr/bin/env python3
import os

# Kurzversion - nur die Daten
pages = {
    "arztgespraech.html": ("Wie läuft ein Arztgespräch ab?", "Ein Arztgespräch auf der Intensivstation läuft meist anders ab als auf Normalstation...", ["Gespräche finden am Bett oder im Besprechungsraum statt", "Bereiten Sie Ihre Fragen vorher vor"]),
    "welche-fragen-stellen.html": ("Welche Fragen sollte ich im Arztgespräch stellen?", "Die wichtigsten Fragen im Arztgespräch drehen sich um den aktuellen Zustand...", ["Fragen Sie nach dem aktuellen Zustand", "Lassen Sie sich Medikamente erklären"]),
    "wer-gibt-auskunft.html": ("Wer gibt mir Auskunft über meinen Angehörigen?", "Auskunft über Ihren Angehörigen gibt in erster Linie das Ärzteteam...", ["Ärzte geben medizinische Auskünfte", "Pflegekräfte informieren über Tagesverlauf"]),
    "telefonisch-auskunft.html": ("Kann ich telefonisch Auskunft bekommen?", "Ja, die meisten Intensivstationen geben telefonisch Auskunft...", ["Telefonische Auskunft ist meist möglich", "Beste Zeit: nachmittags 14-16 Uhr"]),
    "zweite-meinung.html": ("Kann ich eine zweite Meinung einholen?", "Ja, Sie haben jederzeit das Recht auf eine zweite Meinung...", ["Sie haben immer das Recht auf eine zweite Meinung", "Zweite Meinung ist legitim"]),
    "wie-aushalten.html": ("Wie halte ich diese Situation aus?", "Ehrlich? Die Situation auf der Intensivstation ist für fast alle Angehörigen kaum auszuhalten...", ["Die Situation ist kaum auszuhalten", "Nehmen Sie sich täglich Auszeiten"]),
    "darf-ich-weinen.html": ("Darf ich vor meinem Angehörigen weinen?", "Ja, natürlich dürfen Sie weinen. Ihre Tränen zeigen Liebe, keine Schwäche...", ["Ja, Weinen ist völlig in Ordnung", "Ihre Tränen zeigen Liebe"]),
    "schuldgefuehle.html": ("Wie gehe ich mit Schuldgefühlen um?", "Schuldgefühle sind bei Angehörigen extrem häufig...", ["Schuldgefühle sind häufig, aber meist unbegründet", "Sie haben nach bestem Wissen gehandelt"]),
    "hilfe-fuer-angehoerige.html": ("Wo bekomme ich als Angehöriger Hilfe?", "Viele Krankenhäuser haben psychologische Angebote für Angehörige...", ["Krankenhäuser bieten psychologische Unterstützung an", "Selbsthilfegruppen können helfen"]),
    "selbstfuersorge.html": ("Wie sorge ich für mich selbst?", "Selbstfürsorge ist kein Luxus – sie ist überlebenswichtig...", ["Selbstfürsorge ist überlebenswichtig", "Essen, schlafen, Pausen machen"]),
    "kinder-informieren.html": ("Wie erkläre ich die Situation meinen Kindern?", "Kinder spüren, wenn etwas nicht stimmt...", ["Seien Sie ehrlich, aber altersgerecht", "Kleine Kinder: einfach erklären"]),
    "hoffnung-behalten.html": ("Wie kann ich Hoffnung behalten?", "Hoffnung ist wichtig – aber sie muss realistisch sein...", ["Hoffnung ist wichtig", "Konzentrieren Sie sich auf kleine Fortschritte"]),
    "kosten-intensivstation.html": ("Wer bezahlt die Intensivstation?", "In Deutschland übernimmt die Krankenkasse die Kosten...", ["Die Krankenkasse übernimmt alle Kosten", "Keine Zuzahlung über 10 Euro pro Tag"]),
    "vollmacht-betreuung.html": ("Brauche ich eine Vollmacht oder Betreuung?", "Wenn Ihr Angehöriger nicht mehr selbst entscheiden kann...", ["Ohne Vollmacht dürfen Sie keine medizinischen Entscheidungen treffen", "Vorsorgevollmacht gibt Ihnen dieses Recht"]),
    "patientenverfuegung.html": ("Was ist eine Patientenverfügung?", "Eine Patientenverfügung ist ein Dokument...", ["Patientenverfügung legt fest, welche Behandlungen gewünscht sind", "Ärzte müssen sich daran halten"]),
    "arbeitgeber-informieren.html": ("Muss ich meinen Arbeitgeber informieren?", "Sie sind nicht verpflichtet, Details zu erzählen...", ["Sie müssen keine Details erzählen", "Offenheit kann zu flexiblen Lösungen führen"]),
    "pflegezeit.html": ("Gibt es Pflegezeit für Angehörige?", "Ja, es gibt die Pflegezeit und die Familienpflegezeit...", ["10 Tage kurzfristige Arbeitsverhinderung möglich", "Bis zu 6 Monate Pflegezeit"]),
}

print(f"Creating {len(pages)} pages...")
for fname in pages:
    with open(fname, 'w') as f:
        f.write("Placeholder")
    print(f"✓ {fname}")
print("Done!")
