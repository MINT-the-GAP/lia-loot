<!--
author:   Martin Lommatzsch
version:  0.0.2
language: de
comment:  Ein anspruchsvoller Escape-Room mit knapper Ressourcenbilanz, verschachtelten Hinweisen und gesperrten Portalen.
tags:     Gamification, Escape Room, LiaScript, Ressourcen, Testkurs
mode:     Presentation

import:   ./README.md
-->

# Escape Room: Das Archiv der Nullschicht

@achievements

@Ressourcen(2, 1, 3)

@Highscore(100, 6, 3, 45, 1)

@Schatztruhe(toc)
@Diamanttruhe(menu)
@Energiekiste(info; classroom)

@Schloss(seitenwechsel, orange)
@Schloss(toc, gruen)
@Schloss(menu, blau)
@Schloss(info, gelb)
@Schloss(classroom, lila)

Die Forschungsstation läuft im Notbetrieb. In der **Nullschicht** wurden vier
Richtungssiegel getrennt und das Archiv versiegelt. Nur wer die Zwischenergebnisse
notiert, die Portale in der richtigen Reihenfolge benutzt und den Ressourcenplan
einhält, erreicht den Ausgang.

Dein vorgesehener Nullfehlerpfad ist absichtlich knapp:

| Ressource | Bestand im gesamten Kurs | Geplanter Einsatz |
|:--|--:|:--|
| Energie | 3 am Start + 7 aus Kisten = **10** | genau zehn Aufgaben mit **Prüfen** |
| Diamanten | 1 am Start + 2 aus Kisten = **3** | die Quarantänekonsole einmal mit **Auflösen** |
| Gold | 2 am Start + 4 aus Kisten = **6** | optionale Hinweise; nicht alle lassen sich kaufen |

Ein Fehlversuch kostet ebenfalls Energie. Wenn du versehentlich die
Quarantäneaufgabe prüfst, musst du deshalb später eine andere Aufgabe mit einem
Diamanten auflösen. Bezahlte Hinweise helfen, kosten aber Highscore-Punkte.

Sammle zunächst die fünf sichtbaren Schlüssel und die Lupe. Der lilafarbene
Schlüssel liegt im Zauberstaub. Öffne danach die Schlösser an Seitenwechsel,
Inhaltsverzeichnis, Menü, Info und Classroom. In vier dieser Oberflächen warten
eine Gold-, eine Diamant- und zwei Energiekisten.

@Schluessel(orange)
@Schluessel(gruen)
@Schluessel(blau)
@Schluessel(gelb)
@Schluessel(rot)

@Lupe(anker; 1s)

@Schluessel(lila; zauberstaub)
@Schatztruhe(zauberstaub)

Notiere alle hervorgehobenen Variablen. Die Notstromanzeige zeigt die Folge
`3, 6, 12, 24`. Bestimme die nächste Zahl.

[[48]]
[[?]] Vergleiche jeweils zwei benachbarte Glieder und suche einen konstanten Faktor.

@Schloss(check, rot)

Für das Nordsiegel gilt später: **A ist die letzte Ziffer dieses Ergebnisses**.

## Kartenraum – Wege werden Zahlen

Aktiviere die Lupe und untersuche auch das schwach funkelnde Feld. Dort liegen die
nächste Energieeinheit und der orangefarbene Schlüssel für die Prüfung.

@Energiekiste(zauberstaub; anker)
@Schluessel(orange; zauberstaub)

Eine Drohne startet bei `(-1|2)`. Sie fliegt vier Felder nach Osten, drei nach
Süden, ein Feld nach Westen und zwei nach Norden. Bestimme anschließend den
Manhattan-Abstand des Endpunkts vom Ursprung, also `|x| + |y|`.

Gib nur den Manhattan-Abstand ein.

[[3]]
[[?]] Verändere bei Ost und West nur x, bei Nord und Süd nur y. Der Endpunkt ist `(2|1)`.

@Schloss(check, orange)

Notiere den Abstand als **B**. Das Nordsiegel wird später aus `A + B` gebildet.

## Zahlenspeicher – Ohne Rechner

Warte auf die Energiekiste und suche mit der Lupe nach der Goldtruhe. Der grüne
Schlüssel öffnet nur den Hinweis; wer die Binärzahl selbst umrechnet, spart Gold
und Highscore-Punkte.

@Schluessel(gruen)
@Energiekiste(anker; 2s)
@Schatztruhe(zauberstaub; anker)

Wandle die Binärzahl `101101₂` in eine Dezimalzahl um.

[[45]]
[[?]] Die Stellenwerte von links sind 32, 16, 8, 4, 2 und 1.

@Schloss(hint, gruen)

Notiere als **C** die Quersumme der Dezimalzahl.

## Quarantänekonsole – Der notwendige Diamant

Diese Station ist das eigentliche Ressourcen-Schott. Öffne mit dem blauen Schlüssel
das Schloss auf **Auflösen** und benutze anschließend bewusst diese Aktion. Bezahle
hier genau einen Diamanten und **klicke nicht auf Prüfen**. Nur so bleiben zehn
Energiepunkte für die übrigen zehn Prüfungen.

@Schluessel(blau)

Die Kalibrierung verwendet `(A + C - B) / 2`. Bestimme den Kalibrierwert.

[[7]]
[[?]] Setze A = 8, B = 3 und C = 9 ein.

@Schloss(resolve, blau)

Das aufgelöste Ergebnis ist **D**. Ein Diamant kostet keine Highscore-Punkte.

## Prismenkammer – Zwei Portale, ein Umweg

Sammle zuerst die Energiekiste sowie den gelben Schlüssel für das Kühlarchiv.
Der lilafarbene Schlüssel für das violette Portal liegt erneut im Zauberstaub.

@Energiekiste(anker; 2s)
@Schluessel(gelb)
@Schluessel(lila; zauberstaub)

Vier Prismen `A`, `B`, `C` und `D` stehen in einer Reihe. `A` steht unmittelbar
vor `C`, `D` unmittelbar hinter `B`, und das Paar `B-D` steht links vom Paar
`A-C`. Bestimme die eindeutige Reihenfolge.

Gib die vier Buchstaben mit Bindestrichen ein.

[[B-D-A-C]]
[[?]] Behandle `A-C` und `B-D` zunächst als zwei untrennbare Blöcke.

Für die spätere Rechnung ersetzt du die Buchstaben durch ihre Alphabetpositionen
(`A = 1`, `B = 2`, `C = 3`, `D = 4`). Lies die beiden Zweierblöcke als
zweistellige Zahlen und ziehe den rechten Block vom linken ab. Das Ergebnis ist
**P**.

**Erst der Abstecher:** Öffne das lilafarbene Schloss und benutze das
Zweiwegportal zum Kühlarchiv. Dort musst du Energie, Diamant und den orangefarbenen
Schlüssel einsammeln. Kehre ausschließlich durch das automatisch erzeugte
Rückportal hierher zurück.

@Portal(6)
@Schloss(portal, lila)

**Nach der Rückkehr:** Der orangefarbene Schlüssel aus dem Archiv öffnet dieses
Einwegportal. Es gibt danach kein Portal zurück.

@Einwegportal(7)
@Schloss(portal, orange)

## Kühlarchiv – Der Rückweg ist Teil des Rätsels

Die Diamanttruhe ist vollständig unsichtbar und liegt direkt unter der
Energiekiste. Suche diese Leerfläche mit der Lupe. Der orangefarbene Schlüssel
funkelt weiter unten; du brauchst ihn nach der Rückkehr in der Prismenkammer.

@Energiekiste(anker)
@Diamanttruhe(unsichtbar; anker)
@Schluessel(orange; zauberstaub)

Ein Tank enthält 48 Kühlmittel-Einheiten. Zuerst geht ein Viertel des
Ausgangsbestands verloren. Danach wird die Hälfte des verbliebenen Bestands
verbraucht. Bestimme den Restbestand.

[[18]]
[[?]] Nach dem ersten Verlust bleiben 36 Einheiten. Halbiere diesen Rest.

@Schloss(check, gelb)

Notiere den Restbestand als **R**. Die Lupe enthüllt außerdem die Rechenregel für
das Südsiegel:

@Unsichtbar(Der Südwert lautet R minus P.)

Benutze jetzt das automatisch erschienene Rückportal. Der normale Seitenwechsel
würde die vorgesehene Portalroute abkürzen.

## Einwegschleuse – Nicht auf Weiter klicken

Das Einwegportal aus der Prismenkammer hat keinen Rückweg erzeugt. Sammle hier drei
Schlüssel: Gelb entsperrt die Seitenpfeile, Rot das nächste Portal und der
vollständig unsichtbare blaue Schlüssel wird erst in der Kernkammer benötigt.

@Schluessel(gelb)
@Schluessel(rot; zauberstaub)
@Schluessel(blau; unsichtbar)
@Energiekiste(zauberstaub; anker)

@Schloss(seitenwechsel, gelb; anker)

Entsperre die Seitenpfeile für den Schlossknacker-Erfolg, benutze **Weiter** aber
nicht: Die nächste Folie ist geheim und würde bei normaler Navigation übersprungen.

Aus vier verschiedenen Relais werden genau zwei für die Notbrücke ausgewählt.
Die Reihenfolge der beiden ausgewählten Relais spielt keine Rolle. Bestimme die
Anzahl der möglichen Paare.

[[6]]
[[?]] Berechne den Binomialkoeffizienten „4 über 2“ oder liste alle ungeordneten Paare auf.

Notiere das Ergebnis als **Q**. Öffne anschließend mit Rot das Einwegportal in den
verborgenen Wartungsschacht.

@Einwegportal(8)
@Schloss(portal, rot)

## Der blinde Wartungsschacht

@Geheimfolie

Du hast die nur über das Portal erreichbare Geheimfolie betreten. Sammle die
Goldtruhe und suche im Zauberstaub nach dem roten Schlüssel für das letzte Schloss.

@Schatztruhe(unsichtbar; anker)
@Schluessel(rot; zauberstaub)

Auf einer Wartungsplakette steht `QRUG`. Jeder Buchstabe wurde im lateinischen
Alphabet um drei Stellen nach vorn verschoben. Entschlüssele das Wort, indem du
jeden Buchstaben drei Stellen zurücksetzt.

[[NORD]]
[[?]] Q wird zu N, R wird zu O, U wird zu R und G wird zu D.

Für das Westsiegel zählt nicht das Wort selbst, sondern seine Länge:

@Unsichtbar(Der Westwert ist Q mal die Anzahl der Buchstaben von NORD.)

Mit **Weiter** erreichst du nun die Kernkammer. Das folienlokale Schloss der
Einwegschleuse wirkt hier nicht mehr.

## Kernkammer – Vier Siegel zusammenführen

Lege deine Notizen nebeneinander:

| Siegel | Rechnung |
|:--|:--|
| Nord | `A + B` |
| Ost | `C + D` |
| Süd | `R - P` |
| West | `Q · Länge(NORD)` |

Der blaue Schlüssel aus der Einwegschleuse öffnet die erste Prüfung.

Berechne den Wert des Ostsiegels.

[[16]]
[[?]] C ist die Quersumme von 45, D ist der aufgelöste Kalibrierwert.

@Schloss(check, blau)

Berechne danach die Kontrollsumme aus Nord + Ost + Süd + West.

[[58]]
[[?]] Die vier Siegelwerte sind 11, 16, 7 und 24.

Wenn deine Kontrollsumme stimmt, ordne die vier zweistelligen Siegelwerte als
`Nord-Ost-Süd-West`. Eine einstellige Zahl erhält eine führende Null.

## Ausgang – Das Siegel der Nullschicht

Vor dem letzten Prüfen sollte deine Bilanz so aussehen:

- alle **16 Schlösser** sind geöffnet,
- alle **13 Truhen-Einheiten** sind eingesammelt,
- die zehn bisherigen Aufgaben sind gelöst,
- die Geheimfolie wurde besucht,
- im Nullfehlerpfad ist noch genau **eine Energie** übrig.

Der rote Schlüssel aus dem Wartungsschacht sperrt die Abschlussprüfung. Gib den
Code im Format `NN-NN-NN-NN` ein.

Wie lautet der Code aus Nord, Ost, Süd und West?

[[11-16-07-24]]
[[?]] Nutze die bestätigte Reihenfolge Nord-Ost-Süd-West und vergiss die führende Null nicht.

@Schloss(check, rot)
