<!--
author:   Martin Lommatzsch
version:  0.0.1
language: de
edit:     true
comment:  Manueller Belastungstest für kombinierte, wiederholte und verschachtelte Loot-Ziele.
tags:     LiaScript, Loot, Integrationstest, Stresstest, Verschachtelung
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

# Loot-Stresstest – sichere Startschleuse

@achievements

@Ressourcen(8, 8, 40)

@Highscore(100, 5, 2, 60, 0)

Dieser Kurs belastet Loot absichtlich mit mehreren Funden und Schlössern pro
Folie, Mehrziel-Portalen, wiederholten Komponenten sowie ineinanderliegenden
Template-Flächen. Für einen vollständigen neuen Durchlauf muss eine frische
Browsersitzung verwendet oder der Kurszustand zurückgesetzt werden.

Alle für diesen Belastungskurs benötigten Fremdtemplates werden ausschließlich
hier und jeweils genau einmal direkt importiert. Das zusätzlich importierte
`README.md` bringt nur Loot selbst und keine transitiven Demo-Abhängigkeiten mit.

Die Inventur am Ende muss **23 geöffnete Schlösser** und **26 eingesammelte
Truhen-Einheiten** ergeben. Ein Mehrziel-Aufruf zählt dabei je Ziel als eigene
Einheit.

Sammle zuerst alle acht sichtbaren Schlüssel und die Lupe. Öffne danach zuerst
das orange Schloss der Seitennavigation und dann das grüne Schloss am
Inhaltsverzeichnis. Die beiden Info-Schlösser liegen absichtlich nacheinander
auf demselben Ziel: erst Rot, dann Blau.

Wechsle nach dem Öffnen der beiden Navigationsschlösser zunächst auf die nächste
Folie, ohne die übrigen sechs Schlösser zu öffnen. Menü, beide Info-Schlösser,
Board-Mode, Textmarker und Annotation müssen dort weiterhin gesperrt sein, weil
diese Aufrufe bewusst kein `anker` besitzen. Kehre danach zur Startfolie zurück.

@Lupe

@Schluessel(orange)
@Schluessel(gruen)
@Schluessel(rot)
@Schluessel(rot)
@Schluessel(blau)
@Schluessel(gruen)
@Schluessel(gelb)
@Schluessel(orange)

@Diamanttruhe(toc; menu; classroom; info; translator; mode)
@Schatztruhe(zauberstaub; anker; 1s)

@Schloss(seitenwechsel, orange)
@Schloss(toc, gruen)
@Schloss(menu, rot)
@Schloss(info, rot)
@Schloss(info, blau)
@Schloss(boardmodefontbutton, gruen)
@Schloss(textmarkerbutton, gelb)
@Schloss(annotationsbar, orange)

Die sechs Diamanttruhen in der Oberfläche dürfen auch nach einem Folienwechsel
erreichbar bleiben. Die staubverdeckte Goldtruhe ist dagegen an diese Folie
gebunden und erscheint nach einer Sekunde. Ein gesperrtes Ziel darf weder auf
Maus noch Tastatur reagieren.

## Globale Werkzeugleisten gleichzeitig

Die drei globalen Werkzeugschlösser wurden bereits auf der Startfolie
registriert. Nach dem Entsperren prüfst du alle drei Zustände auf derselben
Folie:

- Board-Mode öffnen: Die Truhe muss **im Schriftgrößenmenü** liegen.
- Textmarker öffnen: Die Truhe muss **im Textmarkermenü** liegen.
- Annotationen ausblenden: Erst dann muss die Truhe **unter** der Leiste liegen.

Öffne und schließe jedes Menü mindestens dreimal. Zu keinem Zeitpunkt darf ein
Ziel mehr als eine Truhe aus diesem Aufruf enthalten.

@Schatztruhe(boardmode; textmarker; annotation; anker)

## Zwei Quizze und fünf lokale Aktionsschlösser

Alle fünf Schlüssel liegen vor beiden Quizzen. Die drei Schlossmakros des ersten
Quiz und die zwei des zweiten stehen jeweils unmittelbar hinter ihrem Quiz,
damit die lokale Zuordnung auch bei mehreren Aufgaben auf derselben Folie
eindeutig bleibt.

@Schluessel(rot)
@Schluessel(rot)
@Schluessel(blau)
@Schluessel(gelb)
@Schluessel(lila)

Erstes Quiz: Wie viel ist 2 + 2? [[4]]
[[?]] Vier.

@Schloss(check, rot)
@Schloss(resolve, blau)
@Schloss(hint, gelb)

Zweites Quiz: Wasser gefriert bei 0 °C.

- [(X)] Richtig
- [( )] Falsch

[[?]] Wasser gefriert bei null Grad Celsius.

@Schloss(check, rot)
@Schloss(hint, lila)

@Energiekiste(anker; 1s)

Prüfe nach dem Entsperren beide Aufgaben. Jeder erlaubte Klick auf **Prüfen**
verbraucht genau eine Energie; Klicks auf ein noch gesperrtes Prüffeld dürfen
keine Energie kosten. Die Schlösser des ersten Quiz dürfen niemals zum zweiten
Quiz springen.

## Verschachtelte DynFlex- und Markerquiz-Ziele

Hier liegt das Markerquiz vollständig innerhalb eines DynFlex-Bereichs. Sammle
beide Schlüssel außerhalb des gesperrten Containers. Öffne zuerst das äußere
rote DynFlex-Schloss an einer Stelle außerhalb des Markerquiz und danach das
innere lilafarbene Schloss.

@Schluessel(rot)
@Schluessel(lila)

<section class="dynFlex">

<div class="flex-child">

<div class="markerquiz">

Markiere das Wort @markred(Rot) mit dem roten Textmarker.

@TextmarkerQuiz

</div>

</div>

<div class="flex-child">

@Unsichtbar(Das geheime Wort im verschachtelten Container lautet NESTED.)

</div>

</section>

@Schatztruhe(dynflex; markerquiz; anker; 2s; zauberstaub)
@Schloss(dynflex, rot)
@Schloss(markerquiz, lila)

Aktiviere zusätzlich die Lupe und warte zwei Sekunden. Genau zwei
staubverdeckte Goldtruhen müssen an den beiden ineinanderliegenden Zielen
erscheinen. Folienwechsel und erneutes Öffnen dürfen weder Schloss noch Truhe
duplizieren.

## Wiederholte DynFlex-Instanzen

Dieser Fall prüft die dokumentierte Zuordnung zum **ersten sichtbaren**
Template-Ziel. Solange das Detail geschlossen ist, müssen Schloss und Truhe auf
der zweiten DynFlex-Instanz liegen. Öffne das Detail vor dem Einsammeln: Beides
muss ohne Duplikat auf die nun erste sichtbare Instanz wechseln. Wiederhole den
Wechsel dreimal.

@Schluessel(gruen)

<details>
<summary>Erste DynFlex-Instanz einblenden</summary>

<section class="dynFlex">
<div class="flex-child">Verdeckte erste Instanz.</div>
<div class="flex-child">A</div>
</section>

</details>

<section class="dynFlex">
<div class="flex-child">Zunächst sichtbare zweite Instanz.</div>
<div class="flex-child">B</div>
</section>

@Energiekiste(dynflex; anker)
@Schloss(dynflex, gruen)

## Timer, Canvas und Coordinate mit Portal-Fanout

Auf dieser Folie laufen drei dynamische Komponenten gleichzeitig. Die einzelne
Diamanttruhe erzeugt fünf unabhängige Portale: im Inhaltsverzeichnis, im Menü,
am Timer, in der geöffneten OCR-Zeichenfläche und im registrierten
Koordinatensystem.

@Schluessel(blau)
@Schluessel(rot)
@Schluessel(gelb)

<!-- data-solution-timer="12s" data-solution-timer-start="onclick" -->
Timerfrage: Wie viel ist 3 + 4? [[7]]

Canvasfrage: Wie viel ist 8 - 3? [[5]]

@canvas

@CoordinateSystem(`xmin=-4;xmax=4;ymin=-3;ymax=3;width=480;id=loot_stress_coord`)

@Diamanttruhe(toc; menu; timer; canvasocr; coordinate; anker; 1.5s)
@Schloss(timer, blau)
@Schloss(canvasocr, rot)
@Schloss(coordinate, gelb)

Vor dem Entsperren darf der Timerstart weder Countdown noch Energieverbrauch
auslösen. Danach kostet der erste echte Start genau eine Energie. Die
Canvas-Truhe darf erst innerhalb der tatsächlich geöffneten
`canvas.lia-draw` erscheinen; die Coordinate-Truhe gehört an das über
`window.__boards` registrierte Board. Nach 1,5 Sekunden müssen insgesamt fünf,
nicht mehr und nicht weniger, Truhen aus diesem Aufruf existieren.

## Kachel, LLM und Freeze gleichzeitig

Die drei unterschiedlichen Template-Flächen werden gleichzeitig gerendert,
gesperrt und mit je einer Truhe belegt. Die Kachel darf insbesondere keine
sichtbare Ausgabe `false` erzeugen. Für den LLM-DOM-Test muss keine
Modellinferenz abgewartet werden.

@Schluessel(orange)
@Schluessel(lila)
@Schluessel(gelb)

<div class="Kachel">

Ordne die Grundfarben zu.

<!-- data-randomize="true" -->
[->[(Rot)|Orange]] [->[(Blau)|Grün]].

</div>

Erkläre in einem Satz, warum Eis schwimmt.

<!-- data-solution-button="off" data-llm-textarea="3" -->
[[Antwort]]
```text @LLMQuiz(0.66;solution=0;feedback=0;operator=erklaeren)
Eis hat eine geringere Dichte als flüssiges Wasser.
```

@Abgabe

@Schatztruhe(kachel; llm; freeze; anker)
@Schloss(kachel, orange)
@Schloss(llm, lila)
@Schloss(freeze, gelb)

Öffne die drei Schlösser in beliebiger Reihenfolge und wechsle danach zweimal
von der Folie weg und zurück. Es müssen weiterhin genau drei getrennte
Template-Truhen und höchstens ein Schloss je Fläche sichtbar sein.

## Zustandsabhängiger MathPath-Link

MathPath bleibt auf einer eigenen Folie, damit Quiz, `@ADetails` und
Erklärlink eindeutig zugeordnet sind. Gib zunächst absichtlich `0` ein,
prüfe die falsche Antwort und öffne anschließend den Hinweis. Das Schloss darf
ausschließlich über dem von `@Explain` erzeugten Link liegen; Antwortfeld,
Prüfen und Hinweis bleiben frei.

@Schluessel(gruen)

<!-- data-hint-button="1" -->
Wie viel ist $\frac{1}{2}+\frac{1}{2}$? [[1]]
[[?]] @Explain

@ADetails(1=BE; Bruchrechnung)

@Diamanttruhe(mathpath; anker)
@Schloss(mathpath, gruen)

Nach dem Entsperren muss der Erklärlink bedienbar sein. Ein erneutes Öffnen und
Schließen des Hinweises darf weder Truhe noch Schloss duplizieren.

## Abschlussinventur

Diese drei Inline-Funde schließen den Truhenkatalog ab.

@Schatztruhe
@Diamanttruhe
@Energiekiste

Kontrolliere vor der letzten Antwort:

- **23 von 23 Schlössern** sind geöffnet.
- **26 von 26 Truhen-Einheiten** sind eingesammelt.
- Die Erfolge für alle Schlösser und alle Truhen erschienen jeweils erst nach
  dem tatsächlich letzten Objekt.
- Gesammelte Portale kehren nach Menü-, Zustands- oder Folienwechsel nicht
  zurück.

Wie lautet das Testwort? [[STRESS]]
