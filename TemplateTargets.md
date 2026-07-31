<!--
author:   Martin Lommatzsch
version:  0.0.1
language: de
edit:     true
comment:  Manueller LiaScript-Integrationskurs für alle direkt importierten Template-Ziele von Loot.
tags:     LiaScript, Loot, Integrationstest, Smoke-Test, Templates
mode:     Presentation

import: https://raw.githubusercontent.com/MINT-the-GAP/lia-DynFlex/refs/heads/main/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-timer/refs/heads/main/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-board-mode/refs/heads/main/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-marker/refs/heads/main/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-annotation/refs/heads/main/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-canvas-ocr/refs/heads/main/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-kachel/refs/heads/main/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-llm/refs/heads/main/README.md
import: https://raw.githubusercontent.com/liaTemplates/JSXGraph/main/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-coordinate/refs/heads/main/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-freeze-v2/main/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-mathpath/refs/heads/master/README.md
import: ./README.md
-->

# Loot: Smoke-Test der Template-Ziele

@Ressourcen(0, 0, 40)

Dieser Kurs prüft die direkt importierten Template-Ziele von Loot manuell im
Browser. Jede Zielseite enthält einen farblich passenden Schlüssel, eine
`@Schatztruhe` am Ziel und ein `@Schloss` über demselben Ziel. Geprüft wird:

1. Die Truhe erscheint am dokumentierten Ziel und nur in dessen vorgesehenem
   Laufzeitzustand, etwa bei geöffnetem Werkzeugmenü.
2. Das Schloss liegt absichtlich mit höherem `z-index` über Ziel und Truhe. Es
   darf eine bereits sichtbare Truhe bis zum Entsperren mitschützen; Schlüssel und
   Navigation müssen erreichbar bleiben.
3. Nach dem Einsammeln des Schlüssels lässt sich genau dieses Schloss öffnen;
   danach sind ursprüngliche Oberfläche und Truhe bedienbar.
4. Folienwechsel erzeugen keine doppelten Truhen, Schlösser oder Laufzeitflächen.

Nutze ein Desktopfenster in der vorgegebenen Präsentationsansicht. Board-Mode,
Marker und Annotation liegen im erreichbaren Top-Dokument; insbesondere der
Board-Mode-Button kann auf kleinen Bildschirmen absichtlich fehlen. Alle
`##`-Überschriften sind eindeutig und öffentlich. Dieser Kurs verwendet bewusst
keine Geheimfolie, damit jede Smoke-Seite normal über Inhaltsverzeichnis sowie
Vor-/Zurück-Navigation erreichbar bleibt. Die drei globalen Ziele Board-Mode,
Marker und Annotation tragen hier bei Truhe und Schloss bewusst `anker`; dadurch
bleiben beide an die jeweilige Smoke-Folie gebunden. Der separate `StressTest.md`
prüft dieselben globalen Schlösser ohne `anker` kursweit.

## DynFlex – `dynflex`

Sammle den roten Schlüssel. Vor dem Öffnen muss das Schloss den gesamten
DynFlex-Bereich einschließlich des kleinen Quiz sperren und darf dabei auch die
darunterliegende Truhe mitschützen.

@Schluessel(rot)

<section class="dynFlex">

<div class="flex-child">

Welche Zahl folgt auf 2?

[[3]]

</div>

<div class="flex-child">

Dieser zweite Flex-Baustein macht die Bereichsgrenze sichtbar.

</div>

</section>

@Schatztruhe(dynflex)
@Schloss(dynflex, rot)

## Quiz-Timer – `timer`

Der dokumentierte Modus `onclick` muss einen sichtbaren manuellen Startbutton
erzeugen. Die Truhe gehört zum Timer-Quiz, das Schloss muss genau den außerhalb
des Attributträgers erzeugten Startbutton treffen. Ein Klick auf den gesperrten
Button darf weder Countdown noch Energieverbrauch auslösen. Nach dem Öffnen muss
ein erfolgreicher Start den Energiebestand genau um eins senken.

@Schluessel(blau)

<!-- data-solution-timer="10s" data-solution-timer-start="onclick" -->
Wie viel ist 9 + 6?

[[15]]

@Schatztruhe(timer)
@Schloss(timer, blau)

## Board-Mode – `boardmode`

In Präsentationsansicht und bei ausreichender Fensterbreite erscheint die globale
Schriftsteuerung. Bei geschlossenem Menü darf keine Truhe über dem Fontbutton
liegen. Öffne nach dem Entsperren den Button `#lia-tff-btn-v2`: Die Truhe muss
als Kind innerhalb von `#lia-tff-panel-v2` erscheinen und beim Schließen wieder
verschwinden, ohne beim erneuten Öffnen dupliziert zu werden.

@Schluessel(gruen)
@Schatztruhe(boardmode; anker)
@Schloss(boardmodefontbutton, gruen; anker)

## Globaler Textmarker – `marker`

Hier wird das globale Textmarkermenü geprüft, noch nicht die lokale Markeraufgabe
der nächsten Folie. Das Schloss sperrt den Markerbutton. Erst nach dem Entsperren
und Öffnen darf die Truhe als Kind von `#lia-hl-panel > .body` erscheinen; bei
geschlossenem Menü darf sie weder über dem Button noch im Kursinhalt liegen.

@Schluessel(gelb)
@Schatztruhe(textmarker; anker)
@Schloss(textmarkerbutton, gelb; anker)

## Textmarker-Quiz – `markerquiz`

Markiere das Wort @markred(Rot) mit dem roten Textmarker. Das lokale Schloss muss
den gesamten `.markerquiz`-Bereich einschließlich Markieren und nativer
Quizinteraktion sperren.

@Schluessel(lila)

<div class="markerquiz">

Das zu markierende Wort lautet @markred(Rot).

@TextmarkerQuiz

</div>

@Schatztruhe(markerquiz)
@Schloss(markerquiz, lila)

## Annotation – `annotation`

Das Annotation-Template erzeugt seine Werkzeugleiste ohne Inhaltsmakro. Das
Schloss muss alle Buttons der globalen Leiste einschließlich des Augenbuttons
blockieren. Nach dem Entsperren dürfen sichtbare Annotationen noch keine Truhe
zeigen. Blende sie über das Auge aus: Erst dann erscheint die Truhe mit Abstand
unterhalb der Leiste. Beim erneuten Einblenden muss sie wieder verschwinden.

@Schluessel(orange)
@Schatztruhe(annotation; anker)
@Schloss(annotationsbar, orange; anker)

## Canvas/OCR – `canvasocr`

Das Schloss sperrt die gesamte von `@canvas` erzeugte Komponente. Solange sie
geschlossen ist, darf keine Truhe über dem Stiftbutton liegen. Öffne nach dem
Entsperren die Zeichenfläche: Die Truhe muss innerhalb der tatsächlichen
`canvas.lia-draw` erscheinen. Schließen und erneutes Öffnen dürfen sie nicht
duplizieren.

@Schluessel(rot)

Wie viel ist 10 + 5?

[[15]]

@canvas

@Schatztruhe(canvasocr)
@Schloss(canvasocr, rot)

## Lia-Kachel – `kachel`

Die offiziell unterstützte `<div class="Kachel">`-Region kommt ohne
zusätzliche sichtbare Skriptausgabe aus. Das Schloss muss die gesamte Region sperren.

@Schluessel(gelb)

<div class="Kachel">

Ordne die beiden richtigen Grundfarben beliebig an.

<!-- data-randomize="true" -->
[->[(Rot)|Orange]] [->[(Blau)|Grün]].

</div>

@Schatztruhe(kachel)
@Schloss(kachel, gelb)

## Lokales LLM-Quiz – `llm`

Diese Folie prüft den stets erzeugten Ownership-Marker von `@LLMQuiz`. Bereits
das Rendern kann Modellgewichte laden und benötigt je nach Browser WebGPU oder
den dokumentierten Fallback. Für den DOM-Smoke muss keine Antwort ausgewertet
werden.

@Schluessel(lila)

Erkläre in einem Satz, warum Eis auf Wasser schwimmt.

<!-- data-solution-button="off" data-llm-textarea="3" -->
[[Antwort]]
```text @LLMQuiz(0.66;solution=0;feedback=0;operator=erklaeren)
Eis besitzt eine geringere Dichte als flüssiges Wasser und schwimmt deshalb an
der Oberfläche.
```

@Schatztruhe(llm)
@Schloss(llm, lila)

## Koordinatensystem – `coordinate`

Das Schloss muss den in `window.__boards` registrierten `containerObj`
treffen. Seine automatisch vergebene DOM-ID unterscheidet sich absichtlich von
der logischen Kurs-ID und darf für die Zuordnung keine Rolle spielen.

@Schluessel(rot)

@CoordinateSystem(`xmin=-4;xmax=4;ymin=-3;ymax=3;width=520;id=loot_coord_smoke`)

@Schatztruhe(coordinate)
@Schloss(coordinate, rot)

## Freeze-Abgabe – `freeze`

Diese Folie verwendet die dokumentierte sichtbare `@Abgabe`-Box. Öffne
das Schloss und teste Name, Linkerzeugung und Kopieren. Die
vollständige Linkerzeugung setzt voraus, dass der Kurs über eine erreichbare URL
in LiaScript geladen wurde; ein rein lokaler Dateiaufruf reicht dafür nicht
zuverlässig aus.

@Schluessel(gelb)

@Abgabe

@Schatztruhe(freeze)
@Schloss(freeze, gelb)

## MathPath – `mathpath`

Freeze wurde vor MathPath importiert. Gib zuerst absichtlich `0` ein, prüfe die
falsche Antwort und öffne danach den Hinweis: Das Schloss darf ausschließlich
über dem von `@Explain` erzeugten Erklärlink liegen. Antwort, Prüfen und
Hint-Button bleiben frei. Das `@ADetails`-Makro liefert die benötigten Themen.

@Schluessel(gruen)

<!-- data-hint-button="1" -->
Wie viel ist $\frac{1}{2}+\frac{1}{2}$? [[1]]
[[?]] @Explain

@ADetails(1=BE; Bruchrechnung, Einheiten)

@Schatztruhe(mathpath)
@Schloss(mathpath, gruen)
