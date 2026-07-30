<!--
author:   Martin Lommatzsch
version:  0.0.1
language: de
comment:  Ein bewusst leicht lösbarer Escape-Room zum Testen der Loot-Gamification in LiaScript.
tags:     Gamification, Escape Room, LiaScript, Testkurs
mode:     Presentation

import:   ./README.md
-->

# Escape Room: Der verschwundene Pausenschlüssel

@achievements

@Ressourcen(4, 2, 8)

@Highscore(100, 5, 2, 60, 0)

@Schatztruhe(toc; menu)
@Diamanttruhe(translator; mode)
@Energiekiste(classroom; info)

@Schloss(seitenwechsel, orange)
@Schloss(toc, gruen)

Die Tür zum Pausenhof ist zugefallen. Zum Glück hat die Hausmeisterin überall
leicht erkennbare Spuren hinterlassen. Sammle Schlüssel und Kisten ein, öffne die
Schlösser und löse die kurzen Aufgaben. Die normalen Texttipps sind **kostenlos**.

Dein Ziel ist das Lösungswort **ESCAPE**. Damit du außerdem alle Erfolge testen
kannst, solltest du unterwegs jede Truhe und jedes Schloss anklicken und die
Geheimfolie besuchen.

**Erster Schritt:** Sammle beide Schlüssel ein. Öffne danach mit Orange das Schloss
auf den Seitenpfeilen und mit Grün das Schloss am Inhaltsverzeichnis.

@Schluessel(orange)
@Schluessel(gruen)

In der ersten offen stehenden Truhe liegt eine zusätzliche Goldmünze:

@Schatztruhe

Sobald das orange Seitenschloss geöffnet ist, geht es mit **Weiter** in die
Garderobe.

## Garderobe – Der Schlüsselbund

Hier hängt der komplette Schlüsselbund. Sammle **alle** Schlüssel ein. Doppelte
Farben erscheinen absichtlich einzeln nebeneinander in deinem Inventar.

@Schluessel(rot)
@Schluessel(rot)
@Schluessel(blau)
@Schluessel(blau)
@Schluessel(gelb)
@Schluessel(gelb)
@Schluessel(lila)
@Schluessel(orange)

@Schloss(mode, blau)
@Schloss(menu, rot)
@Schloss(translator, gelb)
@Schloss(classroom, lila)
@Schloss(info, orange)

Öffne nun die fünf farbigen Schlösser an **Darstellung**, **Menü**,
**Übersetzer**, **Classroom** und **Info**. Die zweite Ausführung von Rot, Blau und
Gelb wird später noch für ein Quiz gebraucht.

Eine foliengebundene Goldtruhe erscheint nach drei Sekunden. Bleibe kurz hier:

@Schatztruhe(anker; 3s)

> Kostenloser Tipp: Wähle **Grün**.

Welche Farbe hat eine typische Wiese?

- [( )] Blau
- [(X)] Grün
- [( )] Lila

## Vorratskammer – Rechnen mit Ressourcen

Hier kannst du alle drei Währungsarten direkt einsammeln. Die Goldtruhe erscheint
erst nach zwölf Sekunden auf dieser Folie.

@Diamanttruhe
@Energiekiste
@Schatztruhe(anker; 12s)

Jeder Klick auf **Prüfen** kostet eine Energie, ein nativer **Hinweis** eine
Goldmünze und **Auflösen** einen Diamanten. Für den perfekten Highscore nutzt du den
kostenlosen Tipp und lässt den kostenpflichtigen Hinweis geschlossen.

> Kostenloser Tipp: Die richtige Zahl ist **4**.

Wie viel ist 2 + 2?

[[4]]
[[?]] Addiere zwei und zwei. Das Ergebnis ist 4.

## Kontrollpult – Drei lokale Schlösser

Am nächsten Quiz sind alle drei Aktionen gesperrt. Öffne zuerst das **rote** Schloss
bei Prüfen, das **blaue** bei Auflösen und das **gelbe** beim Hinweis. Du musst
Auflösen und Hinweis danach nicht benutzen; das Öffnen der Schlösser reicht für den
Schlossknacker-Erfolg.

> Kostenloser Tipp: Tippe genau **START** ein.

Welches Wort startet laut Beschriftung die Maschine?

[[START]]
[[?]] Das gesuchte Wort steht bereits im kostenlosen Tipp: START.

@Schloss(check, rot)
@Schloss(resolve, blau)
@Schloss(hint, gelb)

## Uhrwerk – Funde mit Zeit und Anker

Diese drei Funde demonstrieren die Sichtbarkeitsoptionen. Der grüne Schlüssel und
die Diamanttruhe sind an diese Folie gebunden; die Energiekiste nutzt nur eine
Zeitangabe. Warte höchstens vier Sekunden.

@Schluessel(gruen; anker; 3s)
@Diamanttruhe(anker; 2s)
@Energiekiste(4s)

> Kostenloser Tipp: Die Aussage ist **richtig**.

Eine Kiste mit der Option `3s` ist erst nach drei Sekunden anklickbar.

- [(X)] Richtig
- [( )] Falsch

## Archiv – Die verborgene Spur

Kontrolliere nun die sechs Bereiche der LiaScript-Oberfläche. Dort liegen die beim
Kursstart registrierten Portaltruhen:

| Bereich | Fund |
|:--|:--|
| Inhaltsverzeichnis | Goldtruhe |
| Menü | Goldtruhe |
| Übersetzer | Diamanttruhe |
| Darstellung | Diamanttruhe |
| Classroom | Energiekiste |
| Info | Energiekiste |

Die letzte Spur ist absichtlich nicht im normalen Inhaltsverzeichnis sichtbar.
Öffne die ToC-Suche, gib exakt **Die geheime Werkstatt** ein und öffne den Treffer.
Die Groß-/Kleinschreibung darf dabei abweichen. Nach der Geheimfolie führt **Weiter**
zum Ausgang.

## Die geheime Werkstatt

@Geheimfolie

Gefunden! Damit sollte unten rechts der Erfolg **Geheimnis entdeckt** erscheinen.
Sammle beide Truhen ein; die Goldtruhe braucht zwei Sekunden.

@Diamanttruhe
@Schatztruhe(anker; 2s)

> Kostenloser Tipp: Tippe genau **GEHEIM** ein.

Welches Wort beschreibt diesen Raum?

[[GEHEIM]]

## Ausgang – Das letzte Zahlenschloss

@Energiekiste

Vor dem Abschluss kannst du kurz kontrollieren:

- alle **10 Schlösser** sind geöffnet,
- alle **16 Truhen und Kisten** sind eingesammelt,
- alle bisherigen Aufgaben sind gelöst,
- die geheime Werkstatt wurde besucht.

Wenn du keine falsche Prüfung und keinen kostenpflichtigen Hinweis verwendet hast,
erreichst du außerdem den maximalen Highscore von 100 Punkten.

> Kostenloser Tipp: Das Lösungswort vom Start lautet **ESCAPE**.

Wie lautet das Lösungswort?

[[ESCAPE]]
