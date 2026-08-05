<!--
author:   Martin Lommatzsch
version:  0.0.1
language: de
edit:     true
comment:  Loot ergänzt LiaScript-Kurse um konfigurierbare Gamification. Das erste Feature ermittelt einen Highscore aus Fehlversuchen, verwendeten Hinweisen und sekundengenauem Zeitabzug und zeigt ihn mit einer Trophäe an.

script:   ./dist/index.js

@Highscore
<script run-once modify="false">
(function waitForLoot(remaining) {
  var api = window.__LIA_LOOT_HIGHSCORE__;
  if (api) {
    api.configure(Number("@0"), Number("@1"), Number("@2"), Number("@3"), Number("@4"));
    return;
  }
  if (remaining > 0) {
    window.setTimeout(function () { waitForLoot(remaining - 1); }, 50);
  } else {
    console.error("Loot konnte nicht geladen werden: dist/index.js fehlt.");
  }
})(400);
"LIA: stop"
</script>
@end

@Ressourcen
<script run-once modify="false">
(function waitForLoot(remaining) {
  var api = window.__LIA_LOOT_HIGHSCORE__;
  if (api) {
    var rawEnergy = String("@2").trim();
    var energy =
      rawEnergy === "" || rawEnergy.startsWith("@")
        ? undefined
        : Number(rawEnergy);
    api.resources(Number("@0"), Number("@1"), energy);
    return;
  }
  if (remaining > 0) {
    window.setTimeout(function () { waitForLoot(remaining - 1); }, 50);
  } else {
    console.error("Loot konnte nicht geladen werden: dist/index.js fehlt.");
  }
})(400);
"LIA: stop"
</script>
@end

@achievements: @LootAchievements_
@Achievements: @LootAchievements_
@Erfolge: @LootAchievements_
@lootif: @LootIfStart_(@uid,@0)
@Endelootif: @LootIfEnd_
@EndeLootif: @LootIfEnd_
@endlootif: @LootIfEnd_
@EndLootIf: @LootIfEnd_

@LootAchievements_
<script run-once modify="false">
(function waitForLoot(remaining) {
  var api = window.__LIA_LOOT_HIGHSCORE__;
  if (api) {
    api.enableAchievements();
    return;
  }
  if (remaining > 0) {
    window.setTimeout(function () { waitForLoot(remaining - 1); }, 50);
  } else {
    console.error("Loot konnte nicht geladen werden: dist/index.js fehlt.");
  }
})(400);
"LIA: stop"
</script>
@end

@LootIfStart_
<lia-keep>
<lia-loot-if-start data-loot-if-id='@0' data-options='@1'></lia-loot-if-start>
</lia-keep>
@end

@LootIfEnd_
[LOOT-IF-END](#lia-loot-if-end)
@end

@Schatztruhe: @LootTruhe_(@uid,@0,gold)
@Diamanttruhe: @LootTruhe_(@uid,@0,diamonds)
@Energiekiste: @LootTruhe_(@uid,@0,energy)
@Schluessel: @LootSchluessel_(@uid,@0)
@Puzzleteil: @LootPuzzleteil_(@uid,@0)
@Puzzletor: @LootPuzzletor_(@uid,@0)
@Lupe: @LootLupe_(@uid,@0)
@Schaufel: @LootWerkzeug_(@uid,shovel,@0)
@Giesskanne: @LootWerkzeug_(@uid,watering-can,@0)
@Erdhaufen: @LootRevealStart_(@uid,erde,@0)
@EndeErdhaufen: @LootRevealEnd_(erde)
@Pflanze: @LootRevealStart_(@uid,pflanze,@0)
@Blume: @Pflanze(@0)
@EndePflanze: @LootRevealEnd_(pflanze)
@EndeBlume: @LootRevealEnd_(pflanze)
@Portal: @LootPortal_(@uid,@0,two-way)
@Einwegportal: @LootPortal_(@uid,@0,one-way)
@Einbahnportal: @LootPortal_(@uid,@0,one-way)
@Unsichtbar: @LootVersteckt_(@uid,solid,@0)
@Zauberstaub: @LootVersteckt_(@uid,dust,@0)
@Schloss: @LootSchloss_(@uid,@0,@1)
@Geheimfolie: @LootGeheimfolie_(@uid)

@LootTruhe_
<lia-keep>
<lia-loot-chest data-chest-id="@0" data-placement="@1" data-reward="@2"></lia-loot-chest>
</lia-keep>
@end

@LootSchluessel_
<lia-keep>
<lia-loot-key data-key-id="@0" data-color="@1"></lia-loot-key>
</lia-keep>
@end

@LootPuzzleteil_
<lia-keep>
<lia-loot-puzzle-piece data-piece-id="@0" data-options="@1"></lia-loot-puzzle-piece>
</lia-keep>
@end

@LootPuzzletor_
<lia-keep>
<lia-loot-puzzle-gate data-gate-id="@0" data-options="@1"></lia-loot-puzzle-gate>
</lia-keep>
@end

@LootLupe_
<lia-keep>
<lia-loot-magnifier data-magnifier-id="@0" data-options="@1"></lia-loot-magnifier>
</lia-keep>
@end

@LootWerkzeug_
<lia-keep>
<lia-loot-tool data-tool-id='@0' data-tool='@1' data-options='@2'></lia-loot-tool>
</lia-keep>
@end

@LootRevealStart_
<lia-keep>
<lia-loot-reveal-start data-reveal-id='@0' data-reveal-kind='@1' data-options='@1; @2'></lia-loot-reveal-start>
</lia-keep>
@end

@LootRevealEnd_
[LOOT-REVEAL-END](#lia-loot-reveal-end-@0)
@end

@LootPortal_
<lia-keep>
<lia-loot-slide-portal data-portal-id="@0" data-options="@1" data-default-mode="@2"></lia-loot-slide-portal>
</lia-keep>
@end

@LootVersteckt_
<lia-loot-hidden data-secret-id="@0" data-loot-concealment="@1" inert aria-hidden="true">@2</lia-loot-hidden>
@end

@LootSchloss_
<lia-keep>
<lia-loot-lock data-lock-id="@0" data-target="@1" data-color="@2"></lia-loot-lock>
</lia-keep>
@end

@LootGeheimfolie_
<lia-keep>
<lia-loot-secret-slide data-secret-id="@0"></lia-loot-secret-slide>
</lia-keep>
@end
-->

# Loot

@achievements

          --{{0}}--
Loot ist ein Gamification-Template für LiaScript. Das erste Feature verwaltet einen
konfigurierbaren Highscore über den gesamten Kurs und zeigt nach der korrekt gelösten
Abschlussaufgabe ausschließlich die erreichten Punkte an.

Das Template erkennt nach dem Start automatisch:

- fehlgeschlagene Klicks auf **Prüfen** bei nativen LiaScript-Quizzen,
- jeden erstmals geöffneten nativen Hinweis `[[?]]`,
- eingesammelte farbige Schlüssel für das persönliche Inventar,
- nummerierte Puzzleteile und farbige Puzzletore als Fortschrittsgrenzen,
- mit passenden Farbschlüsseln entsperrbare Bedienobjekte,
- anklickbare Einweg- und Zweiwegportale zwischen Kursfolien,
- das letzte native Quiz auf der letzten Kursseite als Abschlussaufgabe,
- freigeschaltete Erfolge für Aufgaben, Highscore, Truhen, Schlösser und Geheimfolien.

           {{1}}
Nach der Veröffentlichung kann das Template mit folgender URL getestet werden:

`https://liascript.github.io/course/?https://raw.githubusercontent.com/MINT-the-GAP/lia-loot/main/README.md`

Das vorgesehene Repository ist:

`https://github.com/MINT-the-GAP/lia-loot`

## Einbindung

          --{{0}}--
Importiere das Template im Kopf deines LiaScript-Kurses:

`import: https://raw.githubusercontent.com/MINT-the-GAP/lia-loot/main/README.md`

Aktuell ist noch kein Release-Tag veröffentlicht. Bis zur ersten Veröffentlichung
wird deshalb `main` verwendet. Danach sollte `main` in produktiven Kursen durch den
tatsächlich veröffentlichten Tag ersetzt werden.

Ein vollständiger, anspruchsvoller Spiel- und Akzeptanzkurs liegt in
[`EscapeRoom.md`](./EscapeRoom.md). Er bindet das Template relativ mit
`import: ./README.md` ein und führt über zehn Folien durch eine knapp kalkulierte
Ressourcenroute: zehn Energieprüfungen, ein geplanter Diamanteinsatz, begrenzte
Hinweise, 16 Schlösser, 13 Truhen-Einheiten, beide Portalarten und eine nur per
Einwegportal erreichbare Geheimfolie. Damit eignet er sich zugleich als
Import-Smoke-Test und als nachvollziehbarer End-to-End-Beispielkurs.

Der manuelle Integrationskurs [`TemplateTargets.md`](./TemplateTargets.md)
importiert jedes dort benötigte Fremdtemplate ausschließlich in seinem eigenen
Dokumentkopf und jeweils genau einmal. Er prüft alle 12 Template-Ziel-IDs mit
echter Laufzeitoberfläche, Truhe und Schloss. Das importierbare Loot-Template
selbst lädt keine dieser reinen Demo-Abhängigkeiten transitiv mit.
JSXGraph bleibt dabei ausschließlich als direkte technische Laufzeitabhängigkeit
von `lia-coordinate` im Dokumentkopf; eine Loot-Option `jsxgraph` gibt es nicht.

Der Belastungskurs [`StressTest.md`](./StressTest.md) bleibt bewusst als
deterministische QA-Fixture getrennt. Er kombiniert alle 12 Template-Ziele auf nur
neun Folien: 23 Schlösser mit exakt passenden Schlüsseln, 26 Truhen-Einheiten,
mehrere Quizze pro Folie, Mehrziel-Truhen, wiederholte Komponenten und ineinander
verschachtelte Template-Flächen. `npm test` prüft diese Verträge direkt über
`tests/stress-course.test.mjs`. `npm run test:stress` baut zusätzlich das aktuelle
Bundle und testet die separate synthetische Browser-Fixture lokal in einem
installierten Edge-, Chrome- oder Chromium-Browser gegen mehrere Zielkopien,
verschachtelte Locks, Achievements und Folienwechsel.

## `@Ressourcen`

          --{{0}}--
Mit dem Makro legst du den anfänglichen Bestand an Goldmünzen, Diamanten und
optional Energie fest:

```markdown
@Ressourcen(10, 3, 5)
```

Beim Kursstart sucht das Template in der Kursquelle nach dem ersten gültigen
`@Ressourcen(...)`-Aufruf, der allein in einer eigenen Zeile steht. Die zentrierte
Ressourcen-Bar wird deshalb sofort mit diesen Werten angezeigt – unabhängig davon,
auf welcher Folie das Makro steht und ohne dass diese Folie zuerst besucht werden muss.
Kommentare, Makrodefinitionen und Markdown-Codebeispiele werden bei der Suche ignoriert.

Der erste Wert ist die Zahl der Goldmünzen, der zweite die Zahl der Diamanten und
der optionale dritte Wert der Energiebestand. Jeder gültige Klick auf **Prüfen**
und jeder erfolgreiche Start über den manuellen `onclick`-Button von lia-timer
kostet jeweils genau eine Energie. Bei `0` wird die betreffende Aktion vollständig
blockiert.
Jeder geöffnete Hinweis kostet weiterhin eine Goldmünze, jedes Auflösen einen Diamanten.
Ohne ausreichenden Bestand wird die jeweilige Aktion nicht ausgeführt. Der verbleibende
Bestand bleibt beim Neuladen innerhalb desselben Browser-Tabs erhalten.

Für bestehende Kurse bleibt der Aufruf mit zwei Werten gültig. Dann sind Prüfen
und Timerstart unbegrenzt möglich und das Energiesymbol wird nicht eingeblendet:

```markdown
@Ressourcen(10, 3)
```

@Ressourcen(1, 1, 2)

## `@Schatztruhe`

          --{{0}}--
@Ressourcen(1, 1, 2)

Ohne Parameter setzt das Makro eine Schatztruhe genau an die Aufrufstelle:

```markdown
@Schatztruhe
```

Ohne Mengenangabe steigt der Goldbestand beim Anklicken um eins. Eine positive ganze
Zahl als erste Option legt stattdessen die Belohnungsmenge fest:

```markdown
@Schatztruhe(3)
@Schatztruhe(3; menu)
```

Der erste Aufruf erzeugt eine Inline-Truhe mit drei Goldmünzen, der zweite eine
Menü-Truhe mit drei Goldmünzen. Danach verschwindet die jeweilige Truhe dauerhaft
für den aktuellen Browser-Tab. Jeder Makroaufruf erhält eine eigene ID und kann daher
genau einmal eingesammelt werden.

Mit einer durch Semikolons getrennten Liste setzt ein Aufruf mehrere unabhängige
Truhen in LiaScripts Bedienoberfläche. Steht am Anfang eine Menge, bringt jede dieser
Truhen die volle angegebene Belohnung:

```markdown
@Schatztruhe(toc; menu; classroom; info; translator; mode)
@Schatztruhe(3; toc; menu)
```

| Ziel | Position |
|:--|:--|
| `toc` | Inhaltsverzeichnis |
| `menu` | Design- und Einstellungsmenü |
| `classroom` | Teilen- und Classroom-Menü |
| `info` | Info-Menü |
| `translator` | Übersetzungs- und Sprachauswahl |
| `mode` | Auswahl der Darstellung: Lehrbuch, Präsentation oder Folien |

<a id=ziele-aus-direkt-importierten-templates></a>

**Zusätzliche Versteck- und Schlossoptionen durch importierte Templates**

Die folgenden Ziel-IDs funktionieren für `@Schatztruhe`, `@Diamanttruhe`,
`@Energiekiste` und `@Schloss`. Voraussetzung ist, dass das jeweilige Template
**direkt im Kopf des verwendenden Kurses** importiert wurde. Ein nur mittelbar über
ein anderes Template geladener Import reicht nicht zuverlässig aus. Loot prüft
zusätzlich den echten Laufzeitmarker beziehungsweise das registrierte Custom Element;
gleichnamiges, selbst geschriebenes HTML aktiviert kein Template-Ziel.

Beispiel für den direkten Import eines Ziel-Templates zusammen mit Loot:

```markdown
<!--
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-canvas-ocr/refs/heads/main/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-loot/main/README.md
-->
```

Bei folienlokalen Zielen stehen Fund oder Schloss auf derselben Quellfolie wie der
Makroaufruf und verwenden dort das erste sichtbare passende Exemplar. Die globalen
Werkzeugleisten von Board-Mode, Marker und Annotation werden dagegen unabhängig von
der Folie im per Same-Origin erreichbaren Top-Dokument gesucht. In der Spalte
„Versteck-Aufruf“ kann `@Schatztruhe` jeweils durch `@Diamanttruhe` oder
`@Energiekiste` ersetzt werden. Diese Zielparameter gelten für die drei
Truhenarten. Die Lupe bleibt ein eigenständiger Inline-Fund; Schlüssel besitzen
zusätzlich die unten dokumentierten offiziellen Oberflächenziele.

| Template / Ziel-ID | Truhe dort verstecken | Schloss davor setzen | Tatsächlicher Zielort und Besonderheiten |
|:--|:--|:--|:--|
| lia-DynFlex · `dynflex` | `@Schatztruhe(dynflex)` | `@Schloss(dynflex, rot)` | Erster sichtbarer `.dynFlex`-Bereich der Folie; das Schloss umfasst den ganzen Bereich. |
| lia-timer · `timer` | `@Schatztruhe(timer)` | `@Schloss(timer, rot)` | Die Truhe gehört zum sichtbaren Timer-Quiz und funktioniert auch bei `immediate` oder `oncheck`. Das Schloss sperrt im Modus `onclick` den echten manuellen Startbutton `.lia-sol-timer-startbtn[data-sol-timer-ui]`. Ein erfolgreicher manueller Start kostet bei aktivierter Energie genau eine Energie. |
| lia-board-mode · `boardmode`, Schlossalias `boardmodefontbutton` | `@Schatztruhe(boardmode)` | `@Schloss(boardmodefontbutton, rot)` | Die Truhe ist ein Kind des geöffneten Schriftgrößenmenüs `#lia-tff-panel-v2` und bleibt bei geschlossenem Menü verborgen. Das Schloss sperrt den zugehörigen Fontbutton `#lia-tff-btn-v2`. |
| lia-marker · `marker` / `textmarker`, Schlossalias `textmarkerbutton` | `@Schatztruhe(textmarker)` | `@Schloss(textmarkerbutton, rot)` | Die Truhe ist ein Kind von `#lia-hl-panel > .body` und erscheint nur im geöffneten Textmarkermenü. Das Schloss sperrt den globalen Markerbutton `#lia-hl-btn`. |
| lia-marker · `markerquiz` | `@Schatztruhe(markerquiz)` | `@Schloss(markerquiz, rot)` | Gesamter lokaler `.markerquiz`-Bereich von `@TextmarkerQuiz`, einschließlich Markieren und nativer Quizinteraktion. |
| lia-annotation · `annotation`, Schlossalias `annotationsbar` | `@Schatztruhe(annotation)` | `@Schloss(annotationsbar, rot)` | Die Truhe erscheint mit Abstand unterhalb der globalen `.lia-annot-toolbar`, und zwar nur dann, wenn die Annotationen über den Augenbutton ausgeblendet sind. Das Schloss sperrt die gesamte Leiste mit allen Buttons. |
| lia-canvas-ocr · `canvasocr` | `@Schatztruhe(canvasocr)` | `@Schloss(canvasocr, rot)` | Nach dem Öffnen von `@canvas` liegt die Truhe innerhalb der tatsächlichen Zeichenfläche `canvas.lia-draw`, nie über dem Öffnerbutton. Das Schloss sperrt weiterhin die gesamte `.lia-canvas-pair`. |
| lia-kachel · `kachel` | `@Schatztruhe(kachel)` | `@Schloss(kachel, rot)` | Ganze Kachelaufgabe von `@Kachelfolge`, `@KachelfolgeN` oder `div.Kachel`. |
| lia-llm · `llm` | `@Schatztruhe(llm)` | `@Schloss(llm, rot)` | Gesamter zu `@LLMQuiz` gehörender Quizbereich. |
| lia-coordinate · `coordinate` | `@Schatztruhe(coordinate)` | `@Schloss(coordinate, rot)` | Tatsächlich in `window.__boards` registrierter Board-Container `containerObj`; die abweichende Laufzeit-DOM-ID ist dabei unerheblich. |
| lia-freeze-v2 · `freeze` | `@Schatztruhe(freeze)` | `@Schloss(freeze, rot)` | Abgabebox, Exam-Start, ADetails-Punktebereich oder Auswertungsleiste: Damit lässt sich beispielsweise ein Schloss direkt vor `@Abgabe` setzen. |
| lia-mathpath · `mathpath` | `@Schatztruhe(mathpath)` | `@Schloss(mathpath, rot)` | Die Truhe gehört zum mit `@Explain` erweiterten Quiz. Das Schloss liegt ausschließlich über dem ersten sichtbaren `.lia-mathpath-explain-link`; weitere Explain-Links desselben Hinweises werden mitgesperrt, die übrige Quizbedienung bleibt frei. |

Der eigenständige Integrationskurs [`TemplateTargets.md`](./TemplateTargets.md)
zeigt alle 12 Ziel-IDs mit sichtbarer Komponente, passendem Fundort, Schlüssel und
Schloss. `lia-marker` zeigt seine beiden möglichen Ziele gemeinsam auf einer Folie.
Die README enthält diese Fremdtemplate-Beispiele nur als nicht ausführbaren
Quelltext und bleibt dadurch frei von verschachtelten Demo-Importen.

Eine optionale Belohnungsmenge steht bei allen drei Truhenarten immer zuerst. Danach
werden Ziele und weitere Optionen wie bisher mit Semikolons kombiniert; ein Schloss
erhält genau eine Ziel-ID und eine Farbe, getrennt durch ein Komma:

```markdown
@Schatztruhe(canvasocr)
@Schloss(canvasocr, blau)

@Abgabe
@Schatztruhe(freeze)
@Schloss(freeze, rot)

@Diamanttruhe(kachel; anker; 15s)
@Energiekiste(3; boardmode)
```

Die drei Truhenarten und alle weiteren echten Fund- und Freigabeobjekte verstehen
gemeinsame Anker-, Zeit- und Sichtbarkeitsoptionen. Sie werden wie die Ziele durch
Semikolons getrennt:

```markdown
@Schatztruhe(anker)
@Schatztruhe(10s)
@Schatztruhe(toc; menu; anker; 2min)
```

`anker` bindet den Fund an die Folie, auf der sein Makro steht. Eine Truhe
im ToC oder in einem Menü wird dann beim Verlassen dieser Quellfolie entfernt und
bei der Rückkehr wieder eingesetzt. Eine reine Zeitangabe erzeugt bis zum Ablauf
noch keinen anklick- oder fokussierbaren Fund. Möglich sind zum Beispiel `12s`,
`30 Sekunden`, `2min` oder `1.5 Minuten`.

Ohne Folienbindung beginnt der Countdown bei vorab erkannten Oberflächen-Truhen,
sobald ihre Deklarationen aus der Kursquelle geladen wurden, bei rein lokalen
Funden mit ihrem ersten Rendern. Zusammen mit `anker` beginnt er beim
ersten Betreten der Quellfolie. Ein Folienwechsel setzt einen begonnenen Countdown
nicht zurück; der Fund bleibt außerhalb seiner Quellfolie trotzdem verborgen. Ein
Neuladen startet den Countdown jedes noch nicht eingesammelten Fundes neu – auch
wenn er zuvor bereits abgelaufen war. Bereits eingesammelte Funde bleiben wie
bisher verschwunden.

**Sichtbarkeit nach Theme, Farbmodus und Annotationen**

Ein Fund kann zusätzlich an das aktive LiaScript-Farbtheme, an den hellen oder
dunklen Farbmodus und an eine ausgeblendete Annotationsanzeige gebunden werden.
Diese Bedingungen werden live neu ausgewertet: Beim Wechsel des Themes oder
Farbmodus sowie beim Ein- und Ausblenden der Annotationen verschwindet oder
erscheint ein noch nicht eingesammelter Fund unmittelbar.

| Achse | Kanonische Optionen | Bedeutung und Aliase |
|:--|:--|:--|
| Theme | `theme=rot`, `theme=gelb`, `theme=tuerkis`, `theme=blau` | `theme=standard` und `theme=türkis` bezeichnen ebenfalls das türkisfarbene Standardtheme. Die Kurzformen `theme-rot`, `theme-gelb`, `theme-tuerkis` und `theme-blau` bleiben unterstützt. |
| Farbmodus | `farbmodus=dunkel`, `farbmodus=hell` | Dafür sind auch `darkmode` beziehungsweise `lightmode` zulässig. |
| Annotationen | `annotationen=aus` | Der Alias `ohne-annotation` hat dieselbe Bedeutung. Ist keine Annotationsanzeige vorhanden, gilt sie ebenfalls als aus. |

Mehrere Werte derselben Achse sind Alternativen (**ODER**):
`theme=rot; theme=blau` erlaubt also Rot oder Blau. Bedingungen verschiedener
Achsen gelten gemeinsam (**UND**). Dasselbe gilt für `anker`, eine Verzögerung,
die Verbergung mit `unsichtbar` oder `zauberstaub` und direkte `erde`-/`pflanze`-
Schichten: Ein Objekt wird erst sichtbar beziehungsweise bedienbar, wenn alle
angegebenen Bedingungen erfüllt sind.

Die Sichtbarkeitsbedingungen gelten für alle echten Fund- und Freigabeobjekte:

| Objektgruppe | Unterstützte Makros |
|:--|:--|
| Schlüssel | `@Schluessel` |
| alle drei Truhenarten | `@Schatztruhe`, `@Diamanttruhe`, `@Energiekiste` |
| Such- und Aktionswerkzeuge | `@Lupe`, `@Schaufel`, `@Giesskanne` |
| Puzzleteile | `@Puzzleteil` |
| freizugebende Bereiche | `@Erdhaufen`, `@Pflanze` und der Alias `@Blume` |

Beispiele mit einzelnen und kombinierten Bedingungen:

```markdown
@Schluessel(blau; translator; theme=rot; theme=blau; farbmodus=dunkel; annotationen=aus)
@Schatztruhe(3; menu; theme=gelb; lightmode)
@Diamanttruhe(theme=tuerkis; ohne-annotation)
@Energiekiste(theme=standard; farbmodus=hell)
@Lupe(theme=blau; annotationen=aus)
@Schaufel(theme=rot; darkmode)
@Giesskanne(theme=türkis; lightmode; ohne-annotation)

@Erdhaufen(unsichtbar; theme=rot; theme=blau; farbmodus=dunkel)
@Pflanze(zauberstaub; annotationen=aus)
Hier kann auch ein Quiz oder ein anderes Funditem stehen.
@EndePflanze
@EndeErdhaufen
```

Portale und Schlösser sind Zugänge, aber keine eigenen Fundobjekte. `@Unsichtbar`
ist eine Verbergung für Inhalt und ebenfalls kein Fundobjekt. Diese drei Gruppen
erhalten daher keine eigenen Theme-, Farbmodus- oder Annotationsbedingungen;
Funditems innerhalb solcher Strukturen können die Bedingungen weiterhin verwenden.

Als Menge ist ausschließlich eine positive ganze Zahl zulässig. `3s` bleibt wegen
seiner Zeiteinheit eine Verzögerung und bedeutet nicht drei Ressourceneinheiten.
Null, negative oder gebrochene Mengen sowie eine Menge hinter einer anderen Option
lassen den Fund ebenso wie unvollständige oder vertippte Anker- und Zeitangaben
fail-closed verborgen und erzeugen eine Warnung in der Browserkonsole. Die bisherigen
Schreibweisen ohne Menge bleiben zur Kompatibilität mit vorhandenen Kursen gültig
und vergeben weiterhin genau eine Ressourceneinheit.

Die Ziele können einzeln oder kombiniert angegeben werden. Globale Oberflächen-Truhen
werden bereits beim Kursstart aus der Kursquelle registriert. Sie erscheinen deshalb
im ToC, in den Menüs oder an einer globalen Werkzeugleiste, auch wenn die Folie mit
dem Makro noch nie geöffnet wurde. Folienlokale Template-Ziele werden dagegen nur am
ersten sichtbaren passenden Exemplar ihrer Quellfolie eingesetzt. Kommentare und
Markdown-Codebeispiele werden bei der Quelltextsuche ignoriert. Eine Truhe ohne Ziel
folgt weiterhin dem jeweiligen Inhalt und erscheint zum Beispiel erst, wenn ein
Hinweis oder eine Musterlösung tatsächlich angezeigt wird. Zum Einsammeln muss
`@Ressourcen(...)` den Bestand aktiviert haben; andernfalls zeigt die Truhe einen
entsprechenden Hinweis.

Direkte Beispieltruhe:

@Schatztruhe

Sechs Beispieltruhen in der Oberfläche:

@Schatztruhe(toc; menu; classroom; info; translator; mode)

## `@Diamanttruhe`

          --{{0}}--
@Ressourcen(1, 1, 2)

Ohne Parameter setzt das Makro eine Diamanttruhe direkt an die Aufrufstelle:

```markdown
@Diamanttruhe
```

Ohne Mengenangabe steigt der Diamantenbestand beim Anklicken um eins. Eine führende
positive ganze Zahl vergibt entsprechend mehrere Diamanten. Danach verschwindet die
Diamanttruhe dauerhaft für den aktuellen Browser-Tab. Sie besitzt eine eigene
cyan-silberne Pixelart und ein Diamantemblem.

Alle Zielangaben der Goldtruhe funktionieren genauso für Diamanttruhen:

```markdown
@Diamanttruhe(toc; menu; classroom; info; translator; mode)
@Diamanttruhe(translator; anker; 15s)
@Diamanttruhe(3)
@Diamanttruhe(3; menu)
```

Jeder Aufruf erhält eine eigene ID. Gold- und Diamanttruhen können deshalb
unabhängig voneinander im selben Kurs eingesammelt werden.

Direkte Beispieltruhe:

@Diamanttruhe

Beispieltruhen beim Übersetzer und bei der Auswahl der Darstellung:

@Diamanttruhe(translator; mode)

## `@Energiekiste`

          --{{0}}--
@Ressourcen(1, 1, 2)

Ohne Parameter setzt das Makro eine Energiekiste direkt an die Aufrufstelle:

```markdown
@Energiekiste
```

Ohne Mengenangabe steigt der Energiebestand beim Anklicken um eins. Eine führende
positive ganze Zahl vergibt entsprechend mehrere Energiepunkte. Danach verschwindet
die Energiekiste dauerhaft für den aktuellen Browser-Tab. Ihre violett-goldene
Pixelart trägt ein gut sichtbares Blitzemblem.

Alle Zielangaben der anderen Truhen funktionieren auch für Energiekisten:

```markdown
@Energiekiste(toc; menu; classroom; info; translator; mode)
@Energiekiste(mode; anker; 12s)
@Energiekiste(3)
@Energiekiste(3; menu)
```

Zum Einsammeln muss Energie mit dem dritten Wert von `@Ressourcen(...)`
aktiviert sein. Ein älterer Aufruf mit nur zwei Werten lässt die Kiste sichtbar
und zeigt beim Anklicken einen Einrichtungshinweis.

Direkte Beispielkiste:

@Energiekiste

Sechs Beispielkisten in der Oberfläche:

@Energiekiste(toc; menu; classroom; info; translator; mode)

## `@Schluessel`

          --{{0}}--
Ohne Parameter setzt das Makro einen farbigen Schlüssel direkt an die Aufrufstelle.
Die Farbe wird automatisch und stabil aus der eindeutigen Fund-ID bestimmt:

```markdown
@Schluessel
```

Die tatsächliche Farbe ist sofort zu erkennen. Beim Anklicken wird der Schlüssel der
Ressourcenleiste hinzugefügt und von der Fundstelle entfernt. Beim Neuladen wartet
derselbe noch nicht eingesammelte Schlüssel deshalb wieder mit derselben Farbe.

Kursautorinnen und Kursautoren können eine Farbe gezielt festlegen:

```markdown
@Schluessel(rot)
@Schluessel(blau)
@Schluessel(gruen)
@Schluessel(gelb)
@Schluessel(lila)
@Schluessel(orange)
@Schluessel(magenta)
@Schluessel(weiss)
@Schluessel(schwarz)
@Schluessel(tuerkis)
@Schluessel(grau)
@Schluessel(braun)
```

Die vollständige, eindeutige Grammatik lautet:

```text
@Schluessel([farbe]; [ziel]; [anker]; [dauer]; [unsichtbar|zauberstaub])
```

Alle Optionen sind optional und reihenfolgeunabhängig. Zulässige Farben sind
`rot`, `blau`, `gruen`, `gelb`, `lila`, `orange`, `magenta`, `weiss`,
`schwarz`, `tuerkis`, `grau` und `braun`. Die natürlichen Schreibweisen
`grün`, `weiß` und `türkis` sowie die englischen Farbnamen werden ebenfalls
erkannt. Als Oberflächenziel ist
höchstens eines der Ziele `toc`, `menu`, `classroom`, `info`, `translator` oder
`mode` erlaubt. Ohne Ziel bleibt der Schlüssel ein Inline-Fund. `anker`, eine
Dauer wie `30s` oder `1min` und genau eine der Verbergungsarten `unsichtbar` oder
`zauberstaub` lassen sich sowohl inline als auch an einem Oberflächenziel mit der
Farbe kombinieren.

Ein gelber Schlüssel im Einstellungen-Untermenü und ein orangefarbener Schlüssel
im Classroom-Menü werden so gesetzt:

```markdown
@Schluessel(gelb; menu)
@Schluessel(orange; classroom)
```

Soll der orangefarbene Schlüssel erst nach dem Entsperren des Classroom-Menüs
erreichbar sein, kommt ein passender Inline-Schlüssel samt Schloss hinzu:

```markdown
@Schluessel(lila)
@Schloss(classroom, lila)
```

Die Reihenfolge der Optionen ist frei; die folgenden Kombinationen sind deshalb
ebenfalls gültig. Ohne Farbangabe bleibt die bisherige stabile
Überraschungsfarbe erhalten:

```markdown
@Schluessel(gruen; anker; 30s)
@Schluessel(anker; 1min)
@Schluessel(gelb; menu; anker; 30s; unsichtbar)
@Schluessel(zauberstaub; 1min; classroom; orange)
```

Gezielt gesetzte Farben sind ebenfalls sofort sichtbar. Jeder eingesammelte Schlüssel
erhält im Inventar ein eigenes farbiges Symbol. Auch gleiche Schlüssel werden nicht
zusammengezählt: Zwei grüne Funde liegen dort als zwei einzelne grüne Schlüssel direkt
nebeneinander. Verschiedene Farben werden genauso als einzelne Schlüssel aneinandergereiht.
Leere Schlüsselplätze werden nicht vorab gezeigt.

Das eingebettete Schlüssel-Inventar funktioniert unabhängig von `@Ressourcen(...)`
und bleibt beim Neuladen innerhalb desselben Browser-Tabs erhalten. Ohne gesetzten
Gold-, Diamant- oder Energiebestand zeigt das zentrierte Overlay einfach nur die
gefundenen Schlüssel. Jeder Makroaufruf bekommt über `@uid` eine eigene Fund-ID und
kann genau einmal eingesammelt werden.

Automatisch gefärbter Schlüssel:

@Schluessel

Vier gezielt vorbereitete, sofort erkennbare Schlüssel – darunter zwei grüne:

@Schluessel(rot)
@Schluessel(blau)
@Schluessel(gruen)
@Schluessel(gruen)

## `@Puzzleteil` und `@Puzzletor`

          --{{0}}--
Mit Puzzleteilen lassen sich farbige Fortschrittstore bauen. Jedes Teil besitzt
eine Farbe und eine eindeutige Zahl. Beim Anklicken verschwindet es von der
Fundstelle und erscheint als auswählbarer Button in der Ressourcenleiste:

```markdown
@Puzzleteil(rot; 4)
```

Beide Puzzle-Makros stehen jeweils allein in einer eigenen Markdown-Zeile.

Ein Tor legt mit einer Matrix fest, welche Teile benötigt werden und in welcher
Anordnung sie am Ende liegen müssen:

```markdown
@Puzzletor(rot; [[2;3];[1;6];[5;4]])
```

Dieses Beispiel erzeugt ein Raster mit zwei Spalten und drei Zeilen. Die sechs
Slots müssen zeilenweise mit `2, 3 / 1, 6 / 5, 4` belegt werden. Die Zahlen
beschreiben die Zielanordnung, nicht die Reihenfolge, in der die Teile eingesetzt
werden. Das Tor öffnet sich automatisch, sobald das Raster exakt stimmt.

Die Bedienung funktioniert vollständig ohne Drag-and-drop: Wähle ein Teil in der
Ressourcenleiste oder einen bereits belegten Slot und klicke danach auf den
gewünschten Steckplatz. Ein belegter Zielslot gibt sein bisheriges Teil wieder an
die Leiste zurück. Drag-and-drop steht zusätzlich zur Verfügung. Farbe, sichtbare
Zahl, zugängliche Beschriftung und Fokusmarkierung kennzeichnen jedes Teil.

Für ein Tor gelten folgende strikte Regeln:

- Erlaubte Farben sind `rot`, `blau`, `gruen`, `gelb`, `lila`, `orange`,
  `magenta`, `weiss`, `schwarz`, `tuerkis`, `grau` und `braun`. `grün`,
  `weiß` und `türkis` sind ebenfalls zulässig.
- Pro Farbe ist genau ein Tor zulässig.
- Eine Matrix muss rechteckig sein und für `N` Slots jede Zahl von `1` bis
  `N` genau einmal enthalten.
- Ein Tor kann höchstens 16 Slots besitzen.
- Zu jeder Matrixzahl muss genau ein gleichfarbiges `@Puzzleteil` vor dem
  eigenen Tor deklariert sein. Fehlende, doppelte, verwaiste oder hinter dem
  eigenen Tor liegende Teile sind Konfigurationsfehler.
- Ein fehlerhaftes Tor bleibt geschlossen und zeigt die Diagnose direkt im Kurs
  sowie in der Browserkonsole.

Ohne Zusatzoption ist das Tor ein **Navigationstor**. Solange es geschlossen ist,
sind alle späteren Folien hinter diesem Tor weder über Weiter, ToC, direkten
Folien-Hash, Browserhistorie noch Portale erreichbar. Rückwärtsnavigation bleibt
frei. Nach dem Öffnen werden die Folien bis einschließlich des nächsten noch
geschlossenen Puzzletors sichtbar. Das letzte Tor reicht bis zum Dateiende.
Geheimfolien bleiben unabhängig davon geheim.

Es gibt bewusst kein `@EndePuzzletor`. Bei Navigationstoren bildet das nächste
Puzzletor beziehungsweise das Dateiende die nächste Fortschrittsgrenze.

Mit `anker` wird das Tor stattdessen zu einem **lokalen Inhaltstor**:

```markdown
@Puzzleteil(blau; 1)
@Puzzleteil(blau; 2)

@Puzzletor(blau; [[2;1]]; anker)

Dieser Inhalt erscheint erst nach der richtigen Anordnung.

# Nächste Überschrift
```


@Puzzleteil(blau; 1)
@Puzzleteil(blau; 2)

@Puzzletor(blau; [[2;1]]; anker)


Ein geankertes Tor verändert weder Seitennavigation noch ToC. Es verbirgt nur den
Inhalt nach seinem Aufruf bis zur nächsten Markdown-`#`-Überschrift. Gibt es
keine weitere Überschrift, endet der Bereich am Dateiende. Mehrere Bereichs-Gates
wie `@lootif`, `@Erdhaufen`, `@Pflanze` und ein geankertes Puzzletor werden
UND-verknüpft: Das Öffnen eines Tors entfernt keine andere noch aktive Sperre.

Puzzleteile unterstützen dieselben Fundoptionen wie andere echte Sammelobjekte:
`anker`, Verzögerungen, Theme-, Farbmodus- und Annotationsbedingungen,
`unsichtbar` oder `zauberstaub` sowie direkte `erde`-/`pflanze`-Schichten.
Oberflächenziele wie `menu` oder `toc` sind nicht zulässig:

```markdown
@Puzzleteil(gruen; 3; anker; 12s; theme=blau; zauberstaub)
@Puzzleteil(gruen; 1; erde-unsichtbar; pflanze)
@Puzzleteil(gruen; 2)
@Puzzletor(gruen; [[2;3;1]])
```

Sammlung, Belegung und geöffnete Tore bleiben im aktuellen Browser-Tab erhalten
und sind an Kurs-URL, Kursversion und die vollständige Puzzlekonfiguration
gebunden. Ändert sich Matrix oder Teilekatalog, startet dieses Puzzle sicher neu.

Ein geöffnetes Tor kann außerdem bedingten Inhalt auslösen:

```markdown
@lootif(Puzzletor: rot; spawn)
Das rote Tor wurde geöffnet.
@Endelootif
```

## `@Lupe`, `@Unsichtbar` und `@Zauberstaub`

          --{{0}}--
Mit `@Lupe` setzt du einen einmalig findbaren Gegenstand direkt in den Kurs. Nach
dem Anklicken verschwindet die Pixelart-Lupe von der Fundstelle und erscheint als
Button in der Ressourcenleiste. Sie funktioniert auch ohne `@Ressourcen(...)`.

```markdown
@Lupe
```

Wie Schlüssel und Kisten kann die Lupe an ihre Ursprungsfolie gebunden oder
zeitverzögert eingeblendet werden:

```markdown
@Lupe(anker; 12s)
@Lupe(2min)
```

Ein Klick auf die Lupe in der Leiste aktiviert den kreisförmigen Suchausschnitt am
Mauszeiger. Ein weiterer Klick oder die Escape-Taste deaktiviert ihn. Auf Touchgeräten
kann der Ausschnitt durch Berühren positioniert werden.

`@Unsichtbar(...)` lässt den Platz eines Inhalts bestehen, verdeckt ihn aber
vollständig. Erst innerhalb des aktiven Lupenkreises wird der jeweilige Ausschnitt
richtig sichtbar und bedienbar:

```markdown
@Unsichtbar(Das geheime Lösungswort lautet MOND.)
```

Die beiden Textmakros sind für einzeiligen Inline-Text gedacht. Für Fundobjekte
werden die Modi direkt als Option angegeben.

Das funktioniert bei
Schlüsseln und bei allen Münz-, Diamant- und Energietruhen und lässt sich mit
`anker`, einer Zeitangabe oder einer Zieloberfläche kombinieren:

```markdown
@Schluessel(blau; unsichtbar)
@Schatztruhe(zauberstaub)
@Energiekiste(menu; anker; 12s; zauberstaub)
```

`@Zauberstaub(...)` verbirgt den Inhalt ebenfalls, hinterlässt außerhalb der Lupe
aber ein sehr schwaches, flimmerndes Pixelmuster als Suchhinweis:

```markdown
@Zauberstaub(Hier funkelt eine kaum sichtbare Nachricht.)
@Schluessel(lila; zauberstaub)
```

Bei Inhalten mit Kommas gelten die üblichen LiaScript-Makroregeln; der komplette
Parameter kann dafür in Backticks gesetzt werden. Die Verbergung ist ein visueller
Spieleffekt und keine Zugriffssperre: Der Inhalt bleibt im Kursquelltext und im DOM
vorhanden.

Sammle zuerst diese Lupe ein und aktiviere sie anschließend in der Leiste:

@Lupe

Vollständig verdeckter Text:

@Unsichtbar(Diese geheime Zeile wird nur im Lupenkreis sichtbar.)

Ein Schlüssel mit kaum sichtbarem Zauberstaub:

@Schluessel(lila; zauberstaub)

## `@Schaufel`, `@Giesskanne`, `@Erdhaufen` und `@Pflanze`

          --{{0}}--
Mit `@Schaufel` und `@Giesskanne` setzt du zwei weitere einmalig findbare
Werkzeuge in den Kurs. Nach dem Einsammeln liegen sie dauerhaft in der
Ressourcenleiste. Beide unterstützen wie die Lupe `anker` und eine Verzögerung:

```markdown
@Schaufel
@Giesskanne
@Schaufel(anker; 12s)
@Giesskanne(2min)
```

Schaufel und Gießkanne sind Aktionswerkzeuge: In der Leiste kann immer höchstens
eines von beiden aktiv sein. Die Lupe arbeitet unabhängig davon und darf
gleichzeitig aktiv bleiben. So kann ein unsichtbarer Erdhaufen im Lupenkreis
gefunden und direkt mit der Schaufel bearbeitet werden.

`@Erdhaufen` und `@Pflanze` sind Container für beliebigen blockweise
gerenderten LiaScript-Inhalt. Öffnendes und schließendes Makro müssen jeweils
als eigene Zeile direkt auf derselben Folienebene stehen; innerhalb von Listen,
Zitaten oder gemeinsamen HTML-Containern werden sie nicht eingesetzt. Der Inhalt
dazwischen bleibt bis zur vollständigen Freigabe verborgen und nicht bedienbar:

```markdown
@Erdhaufen
Unter der Erde liegt dieser Text.
@EndeErdhaufen

@Pflanze
@Schatztruhe(3)
@EndePflanze
```

Ein Erdhaufen gibt seinen Inhalt nach dem Wegbuddeln frei. Eine Pflanze besitzt
bewusst einen zusätzlichen Schritt: Zuerst wird die kleine Pflanze mit der
Gießkanne zum Blühen gebracht. Erst ein anschließender Klick auf die Blüte gibt
den Inhalt frei. `@Blume` ist ein Alias für `@Pflanze`; geschlossen wird diese
Form wahlweise mit `@EndePflanze` oder dem passenden Alias `@EndeBlume`.

Ohne Zusatzoption sind Erdhaufen und kleine Pflanze sichtbar. Mit `unsichtbar`
werden sie erst im aktiven Lupenkreis sichtbar; `zauberstaub` hinterlässt dort
stattdessen den bekannten schwachen Suchhinweis. Zusätzlich akzeptiert jeder
Container `anker` und höchstens eine Dauer in derselben Schreibweise wie die
anderen Fundobjekte:

```markdown
@Erdhaufen(unsichtbar; anker; 12s)
Verborgener Inhalt
@EndeErdhaufen

@Pflanze(zauberstaub; 2min)
Noch ein verborgener Inhalt
@EndePflanze
```

Container dürfen verschachtelt werden. Dabei muss in umgekehrter Reihenfolge
geschlossen werden. Das folgende vollständige Beispiel verlangt zuerst die
Lupe, dann die Schaufel, danach die Gießkanne und zuletzt einen Klick auf die
Blüte. Erst dann wird das native LiaScript-Quiz bedienbar:

```markdown
@Lupe
@Schaufel
@Giesskanne

@Erdhaufen(unsichtbar)
@Pflanze(unsichtbar)
Welches Lösungswort blüht hier? [[SONNENBLUME]]
[[?]] Gesucht ist eine gelbe Blume.
@EndePflanze
@EndeErdhaufen
```

Bei einzelnen Fundobjekten können die Schichten auch direkt als Optionen
angegeben werden. `erde` und `pflanze` beziehungsweise `blume` erzeugen sichtbare
Schichten; die Suffixe `-unsichtbar` und `-zauberstaub` steuern ihre jeweilige
Verbergung. Direkte Schichten werden von links nach rechts als außen nach innen
gelesen; das Fundobjekt liegt hinter der letzten Schicht. Eine zusätzliche
Itemoption `unsichtbar` bleibt davon unabhängig und verbirgt nur das Fundobjekt,
nicht automatisch Erde oder Pflanze. Die normalen Farb-, Mengen-, Ziel-, Anker-
und Zeitoptionen bleiben dabei erhalten:

| Direkt schichtbares Fundobjekt | Unterstützte Makros |
| --- | --- |
| Schlüssel | `@Schluessel` |
| alle Truhenbelohnungen und -ziele | `@Schatztruhe`, `@Diamanttruhe`, `@Energiekiste` |
| Suchwerkzeug | `@Lupe` |
| Aktionswerkzeuge | `@Schaufel`, `@Giesskanne` |
| Puzzleteile | `@Puzzleteil` |

```markdown
@Schluessel(blau; translator; erde-unsichtbar; pflanze; unsichtbar)
@Schatztruhe(3; menu; erde; blume; anker; 12s)
```

Portale und Schlösser sind keine Fundobjekte und akzeptieren deshalb keine
direkten `erde`-/`pflanze`-Optionen. Sie lassen sich wie Text, Quizze und andere
LiaScript-Inhalte vollständig in einen Bereichscontainer setzen:

```markdown
@Erdhaufen
@Portal(3)
Was liegt unter der Erde? [[SCHATZ]]
@Schloss(check, rot)
@EndeErdhaufen
```

Beim Schichten eines Werkzeugs muss ein bereits erreichbarer Lösungsweg bestehen:
Eine einzige Schaufel hinter ihrer eigenen Erde oder eine einzige Gießkanne hinter
ihrer eigenen Pflanze wäre absichtlich nicht erreichbar.


@Schaufel
@Giesskanne


@Erdhaufen
Unter der Erde liegt dieser Text.
@EndeErdhaufen

@Pflanze
@Schatztruhe(3)
@EndePflanze





## `@Portal`, `@Einwegportal` und `@Einbahnportal`

          --{{0}}--
Portale sind anklickbare Gegenstände, die direkt zu einer anderen Kursfolie führen.
Die Zielnummer ist **1-basiert**: `1` bezeichnet die erste Kursfolie, `5` die fünfte.
Folientitel werden nicht als Ziel ausgewertet.

| Syntax | Verhalten |
|:--|:--|
| `@Portal(5)` | Zweiwegportal zur Folie 5 |
| `@Portal(5; hinundher)` | ausdrückliche Schreibweise desselben Zweiwegportals |
| `@Portal(5; einweg)` | Einwegportal zur Folie 5 |
| `@Einwegportal(5)` | Kurzform für `@Portal(5; einweg)` |
| `@Einbahnportal(5)` | gleichbedeutender Alias für `@Einwegportal(5)` |

Ein Zweiwegportal merkt sich die Folie, von der es betreten wurde. Nach dem Sprung
erscheint auf der Zielfolie automatisch ein temporäres Rückportal. Ein Klick darauf
führt genau zur Ausgangsfolie zurück. Das Rückportal gehört nur zu dieser aktuellen
Portalreise: Wird die Zielfolie auf einem anderen Weg verlassen, wird es entfernt.
Ein erneut angeklicktes Ausgangsportal kann jederzeit eine neue Hin- und Rückreise
beginnen.

```markdown
## Eingangshalle

@Portal(5)
```

Ein Einwegportal erzeugt auf der Zielfolie kein Rückportal und ersetzt beim Sprung
den aktuellen Eintrag im Browser-Verlauf. Der Zurück-Button des Browsers stellt die
Ausgangsfolie daher nicht als Portalschritt wieder her. Das normale
Inhaltsverzeichnis sowie die Vor-/Zurück-Pfeile von LiaScript bleiben jedoch
unverändert nutzbar. Ein Einwegportal ist damit eine Spielmechanik und keine absolute
Zugriffssperre.

```markdown
@Einwegportal(8)

<!-- identisch: -->
@Einbahnportal(8)
@Portal(8; einweg)
```

Auch eine mit `@Geheimfolie` verborgene Folie darf absichtlich Ziel eines Portals
sein. Der Portal-Klick erteilt nur für diesen Sprung die nötige Freigabe; die
Geheimfolie bleibt im Inhaltsverzeichnis und für gewöhnliche direkte Aufrufe
weiterhin verborgen. Bei einem Zweiwegportal erscheint dort ebenfalls das
automatische Rückportal.

Fehlt die Zielnummer, ist sie nicht positiv und ganzzahlig, bezeichnet sie die
aktuelle oder eine nicht vorhandene Folie oder enthält der Aufruf unbekannte bzw.
widersprüchliche Modi, bleibt ein sichtbar als defekt gekennzeichnetes Portal
deaktiviert. Es führt dann keinen Folienwechsel aus und zeigt den Grund als Hinweis.

Die folgenden Gegenstände sind echte Live-Beispiele. Der blaue Schlüssel öffnet
das Schloss auf dem Zweiwegportal zur nächsten Folie:

@Schluessel(blau; anker)

@Portal(12)
@Schloss(portal, blau)

Dieses Einwegportal führt zurück zur Lupenfolie und erzeugt dort keinen Rückweg:

@Einwegportal(9)

Portale selbst vergeben und verbrauchen weder Gold, Diamanten, Energie noch
Schlüssel und werden nicht als Fundgegenstände gezählt. Ein Portalschloss ist
dagegen eine normale Schlossaufgabe und zählt für den Schlosserfolg.

`@Schloss(portal, farbe)` sperrt das zuletzt davor stehende, selbst gesetzte Portal
auf derselben Folie. Das Schlossmakro sollte deshalb direkt auf den Portalaufruf
folgen. Mehrere Portal-Schloss-Paare auf einer Folie bleiben unabhängig; mehrere
Schlösser direkt hinter demselben Portal werden nacheinander geöffnet. Portalschlösser
sind immer folienlokal, `anker` ist hier nicht nötig. Das automatisch erzeugte
Rückportal eines Zweiwegportals bleibt ungesperrt.

## `@Schloss`

          --{{0}}--
Mit `@Schloss` lässt sich ein globales Bedienobjekt, eine Fläche aus einem direkt
importierten Template, eine lokale Quiz-Aktion oder ein direkt davor stehendes
Portal mit einem farbigen Pixelart-Schloss sperren:

```markdown
@Schloss(info, gruen)
```

Das Ziel steht im ersten Parameter, die benötigte Schlüsselfarbe im zweiten. Für
Schlösser stehen alle zwölf Schlüsselfarben `rot`, `blau`, `gruen`, `gelb`,
`lila`, `orange`, `magenta`, `weiss`, `schwarz`, `tuerkis`, `grau` und
`braun` zur Verfügung. Natürliche Unicode- und englische Farbnamen werden
ebenfalls erkannt.

Globale Ziele sperren Elemente der LiaScript-Oberfläche:

Bei globalen Zielen gilt das Schloss ohne weitere Option kursweit und bleibt auch
nach einem Folienwechsel aktiv. Nur `anker` im zweiten Parameter bindet es an die
Folie des Aufrufs:

```markdown
@Schloss(boardmodefontbutton, gruen)
@Schloss(boardmodefontbutton, gruen; anker)
```

Der erste Aufruf sperrt den Board-Mode-Button auf allen Folien, der zweite nur auf
seiner Quellfolie. Das gilt ebenso für globale LiaScript-Menüs sowie Marker und
Annotation. Bereits von sich aus folienlokale Template- und Quizziele bleiben
unabhängig davon lokal.

| Ziel | Gesperrtes Bedienobjekt |
|:--|:--|
| `toc` | Inhaltsverzeichnis |
| `mode` | Auswahl der Darstellung |
| `menu` | Theme- und Einstellungsmenü |
| `translator` | Übersetzer und Sprachauswahl |
| `classroom` | Teilen- und Classroom-Menü |
| `info` | Info-Menü |
| `seitenwechsel` | alle regulären sequenziellen Eingaben für Zurück und Weiter |

Ein globaler Aufruf steht allein in einer eigenen Zeile. Er wird bereits beim
Kursstart aus der Kursquelle registriert; das Schloss ist also sichtbar, bevor die
Folie mit dem Makro besucht wurde. `@Schloss(seitenwechsel, orange)` sperrt Zurück
und Weiter gemeinsam: beide Schaltflächen, `ArrowLeft`/`ArrowRight`, die
LiaScript-Kurzbefehle `Alt+Shift+N` und `Alt+Shift+P` sowie schnelle horizontale
Wischgesten per Touch oder Mausdrag (mindestens 150 px horizontal, höchstens
100 px vertikal und höchstens 300 ms). In Eingabefeldern bleiben Cursor- und
Widgetfunktionen der Pfeiltasten erhalten, ohne die Folie zu wechseln. Direkte
Sprünge über das Inhaltsverzeichnis oder ein Portal bleiben absichtlich nutzbar.
Ein orangefarbener Schlüssel hebt alle sequenziellen Sperren gemeinsam auf.

Die Template-Ziele und ihre lokale oder globale Bindung stehen in der
[Tabelle der direkt importierten Templates](#ziele-aus-direkt-importierten-templates).
Ein folienlokales Schloss steht auf derselben Folie wie sein Ziel. Insbesondere
`@Schloss(timer, rot)` ist nur für einen Timer mit Startmodus `onclick` sinnvoll;
bei `immediate` und `oncheck` gibt es keinen sichtbaren Startbutton zum Sperren.
Bei aktivierter Energie kostet der erste erfolgreiche Klick auf diesen Startbutton
genau eine Energie; ein gesperrter oder wegen Energiemangel blockierter Klick startet
den Countdown nicht.

Für Quizze gibt es drei lokale Ziele:

| Ziel | Gesperrte Quiz-Aktion |
|:--|:--|
| `check` | Prüfen |
| `resolve` | Auflösen |
| `hint` | Hinweis |

Für ein Portal gibt es ein weiteres folienlokales Ziel:

| Ziel | Gesperrter Gegenstand |
|:--|:--|
| `portal` | das zuletzt davor stehende `@Portal`, `@Einwegportal` oder `@Einbahnportal` derselben Folie |

```markdown
@Portal(7)
@Schloss(portal, gruen)
```

Lokale Schlossmakros stehen direkt nach dem Quiz, zu dem sie gehören. Sollen mehrere
Aktionen desselben Quiz gesperrt werden, folgen die Makros unmittelbar aufeinander:

```markdown
Wie viel ist 2 + 2?

[[4]]
[[?]] Addiere zwei und zwei.

@Schloss(check, rot)
@Schloss(resolve, blau)
@Schloss(hint, gelb)
```

Ohne passenden Schlüssel bleibt das Ziel gesperrt und das Schloss zeigt einen
Hinweis. Beim erfolgreichen Entsperren wird genau ein Schlüssel der verlangten Farbe
aus dem Inventar verbraucht; bei mehreren gleichfarbigen Schlüsseln verschwindet also
genau eines der nebeneinanderliegenden Symbole. Danach ist das Bedienobjekt wieder
normal nutzbar. Die Entsperrung bleibt beim Neuladen innerhalb desselben Browser-Tabs
erhalten. Kommentare und Markdown-Codebeispiele erzeugen keine Schlösser.

Live-Beispiel für das Info-Menü:

@Schloss(info, gruen)

## `@Geheimfolie`

          --{{0}}--
Mit `@Geheimfolie` wird eine Folie aus dem normalen Inhaltsverzeichnis und aus der
gewöhnlichen Vor-/Zurück-Navigation ausgeblendet. Das Makro steht allein auf der
Folie, die verborgen werden soll:

```markdown
## Das geheime Labor

@Geheimfolie

Hier liegt der verborgene Inhalt.
```

Um die Folie zu finden, öffnet man das Inhaltsverzeichnis und gibt ihren
vollständigen Titel – im Beispiel `Das geheime Labor` – in das Suchfeld ein. Erst
bei einem exakten Treffer erscheint der geheime ToC-Eintrag. Er kann angeklickt
oder direkt mit **Enter** geöffnet werden. Groß-/Kleinschreibung, Unicode-Schreibweise
und zusätzliche Leerzeichen werden bei der Prüfung normalisiert.

Die weiter unten enthaltene Folie `Das geheime Labor` ist eine echte Live-Demo:
Öffne das ToC, suche exakt nach diesem Titel und öffne anschließend den eingeblendeten
Treffer.

Geheimfolien werden bei **Weiter**, **Zurück**, Pfeiltasten und Wischgesten
übersprungen. Auch ein direkter Folien-Hash ohne vorherige exakte Suche wird auf
eine öffentliche Nachbarfolie umgeleitet. Mehrere Geheimfolien dürfen verwendet
werden, ihre Titel müssen für die Enter-Navigation jedoch eindeutig sein.

Die Funktion ist eine Spielmechanik und keine Zugriffssperre: Der Markdown-Quelltext
eines veröffentlichten LiaScript-Kurses bleibt einsehbar. Auch die physische
Seitennummer kann weiterhin erkennen lassen, dass Folien übersprungen wurden.
Bei einem absichtlich direkt aufgerufenen Folien-Hash kann LiaScript außerdem
Skripte oder Makros der Zielseite bereits initialisieren, bevor das extern geladene
Loot-Template auf eine öffentliche Folie umleitet. Geheimfolien dürfen deshalb
keine vertraulichen Daten oder unerwünschten Seiteneffekte enthalten.

## Das geheime Labor

@Geheimfolie

Du hast das geheime Labor gefunden. Diese echte Demo-Folie erscheint nur nach der
exakten Suche nach `Das geheime Labor` im Inhaltsverzeichnis.

## `@lootif` und `@achievements`

**Bedingte Bereiche mit `@lootif`**

`@lootif(Trigger; spawn)` öffnet einen bedingten Bereich. Der beliebige
LiaScript-Inhalt darunter kann Text, Medien, native Quizze, alle Loot-Items und
deren vollständige Optionen sowie weitere Bereichscontainer enthalten. Geschlossen
wird der Bereich mit `@Endelootif`:

```markdown
@lootif(Gold >= 5; spawn)
Diese Nachricht erscheint ab fünf Goldmünzen.
@Schatztruhe(2; anker; zauberstaub)
@Endelootif
```

Das öffnende und das schließende Makro stehen jeweils allein auf einer eigenen
Zeile und auf derselben Folienebene. Wie bei `@Erdhaufen` und `@Pflanze` werden
sie nicht innerhalb von Listen, Zitaten oder gemeinsam umschließenden
HTML-Containern eingesetzt. `@Endelootif` ist die kanonische Schreibweise;
zusätzlich funktionieren `@EndeLootif`, `@endlootif` und `@EndLootIf`.

Der Trigger steht vor dem Semikolon. Dahinter wird derzeit ausschließlich die
Aktion `spawn` unterstützt: Der gesamte Bereich ist zuvor weder sichtbar noch
bedienbar und erscheint beim ersten Erfüllen dauerhaft. Ein späteres Absinken
einer Ressource lässt bereits erschienenen Inhalt nicht wieder verschwinden. Der
Spawn-Zustand bleibt kurs- und versionsgebunden im aktuellen Browser-Tab auch
nach einem Neuladen erhalten.

| Gewünschter Trigger | Kanonische Schreibweise im ersten Feld |
|:--|:--|
| unmittelbar vorhergehende bewertbare Aufgabe gelöst | `Vorherige Aufgabe gelöst` |
| alle erreichbaren bewertbaren Aufgaben der aktuellen Folie gelöst | `Alle Aufgaben der aktuellen Folie gelöst` |
| mindestens drei bewertbare Aufgaben im Kurs gelöst | `mindestens 3 bewertbare Aufgaben gelöst` oder `bewertbare Aufgaben >= 3` |
| Energie, Gold oder Diamanten vergleichen | `Energie > 0`, `Gold <= 4`, `Diamanten = 2` |
| geöffnete Kisten eines Typs vergleichen | `Schatztruhen >= 2`, `Diamanttruhen = 1`, `Energiekisten < 4` |
| bestimmtes Schloss geöffnet | `Schloss: translator` – der Name entspricht dem ersten Argument von `@Schloss` |
| bestimmtes Puzzletor geöffnet | `Puzzletor: rot` |
| eine Geheimfolie besucht | `Geheime Folie besucht` |
| Lupe gefunden | `Lupe gefunden` |
| ein beliebiges Wort mit einer Farbe markiert | `markiert: gelb` |
| ein bestimmtes Wort mit einer Farbe markiert | `markiert: gelb: Energie` |

Für Zahlenvergleiche stehen `>`, `>=`, `=`, `<=` und `<` zur Verfügung. Anzahlen
von Aufgaben und Kisten sind nichtnegative ganze Zahlen; Ressourcen dürfen auch
nichtnegative Dezimalzahlen verwenden. Bei Markierungen werden `gelb`, `grün`,
`blau`, `rosa`, `orange` und `rot` unterstützt. Ohne drittes Feld genügt irgendein
mit der Farbe markiertes Wort; mit dem dritten Feld muss auch der normalisierte
Wortlaut übereinstimmen.

Bereiche dürfen in umgekehrter Schließreihenfolge verschachtelt werden. Alle
äußeren Gates müssen bereits offen sein, bevor ein innerer Trigger seinen Inhalt
erscheinen lassen kann. Dadurch funktionieren auch die zuvor aufgebauten Such-
und Freigabeketten unverändert:

```markdown
@lootif(Lupe gefunden; spawn)
@Erdhaufen(unsichtbar)
@Pflanze(zauberstaub)
Welche Farbe hat die Blüte? [[GELB]]
@EndePflanze
@EndeErdhaufen
@Endelootif
```

Ungültige Trigger, andere Aktionen, zusätzliche Semikolonfelder und fehlende
Endmakros werden sicher geschlossen behandelt: Der betroffene Inhalt bleibt
verborgen und unbedienbar. Eine Range wird niemals über eine Foliengrenze hinweg
gepaart. Gültige, vollständig geschlossene Bereiche gehören bereits vor ihrem
Spawn zum vollständigen Kurs- und Achievement-Katalog, werden aber nicht als
aktive Source-Deklarationen materialisiert. Ungültige oder unbalancierte Bereiche
werden auch aus diesen Vollkatalogen ausgeschlossen.

**Achievements aktivieren**

          --{{0}}--
Mit einem einzelnen Makro aktivierst du die Erfolgsmeldungen für den gesamten Kurs:

```markdown
@achievements
```

`@achievements` ist die kanonische Schreibweise. Zusätzlich funktionieren
`@Achievements` und `@Erfolge`. Das Template erkennt den Aufruf direkt in der
Kursquelle; das System ist deshalb schon beim Kursstart aktiv, auch wenn das Makro
auf einer späteren Folie steht.

Beim ersten Erreichen erscheint unten rechts ein kleines, nichtmodales Overlay. Jede
Meldung blendet sich nach **12 Sekunden** automatisch aus und kann vorher über **×**
oder mit `Escape` geschlossen werden. Weitere Erfolge erscheinen sofort unten im
Stapel und schieben ältere Meldungen nach oben; jede Meldung hat ihren eigenen Timer.

| Erfolg | Interne ID | Bedingung |
|:--|:--|:--|
| Aufgaben-Meister | `all-quizzes-solved` | Die automatische Abschlussaufgabe ist korrekt gelöst und alle dabei geladenen bewertbaren LiaScript-Quizze sind gelöst. |
| Perfekter Highscore | `perfect-highscore` | Der endgültige Highscore entspricht exakt der konfigurierten Maximalpunktzahl. |
| Schatzjäger | `all-treasure-chests-opened` | Alle im Kurs deklarierten Schatztruhen wurden geöffnet. |
| Diamantensammler | `all-diamond-chests-opened` | Alle im Kurs deklarierten Diamanttruhen wurden geöffnet. |
| Energiesammler | `all-energy-chests-opened` | Alle im Kurs deklarierten Energiekisten wurden geöffnet. |
| Unsichtbares entdeckt | `all-invisible-objects-found` | Alle vollständig unsichtbaren Objekte wurden erstmals tatsächlich mit der aktiven Lupe gefunden. |
| Zauberstaubspürnase | `all-magic-dust-objects-found` | Alle mit Zauberstaub verborgenen Objekte wurden erstmals tatsächlich mit der aktiven Lupe gefunden. |
| Ausgrabungsprofi | `all-soil-dug` | Alle Erdhaufen wurden mit der Schaufel weggebuddelt. |
| Grüner Daumen | `all-plants-bloomed` | Alle kleinen Pflanzen wurden mit der Gießkanne zum Blühen gebracht. Das anschließende Öffnen der Blüte ist dafür nicht erforderlich. |
| Schlossknacker | `all-locks-opened` | Alle gültig deklarierten globalen, Template-, gegenstands- und quizlokalen Schlösser einschließlich der Live-Beispiele dieser README wurden mit passenden Schlüsseln geöffnet. |
| Puzzlemeister | `all-puzzle-gates-opened` | Alle gültig deklarierten Puzzletore wurden korrekt zusammengesetzt und geöffnet. |
| Geheimnis entdeckt | `secret-slide-found` | Eine Geheimfolie wurde nach exakter Suche tatsächlich geöffnet. |

Als bewertbare Aufgaben zählen native Quizze mit **Prüfen** und **Auflösen**;
Umfragen werden nicht mitgezählt. Bei Truhen zählt jedes tatsächlich erzeugte Ziel
eines Makroaufrufs als eigene Kiste. Die drei Kistenarten werden vollständig
unabhängig voneinander ausgewertet.

Für die beiden Lupenerfolge zählt jede konkrete Verbergungsinstanz: direkter Text in
`@Unsichtbar(...)` oder `@Zauberstaub(...)`, die Verbergung eines Funditems sowie
jede entsprechend verborgene Erde- oder Pflanzenschicht. „Gefunden“ bedeutet, dass
die Instanz zum ersten Mal wirklich im aktiven Lupenkreis liegt; ein bloß vorhandenes
oder nur schwach schimmerndes Objekt reicht nicht aus. Für die Grab- und Blüherfolge
zählen sowohl `@Erdhaufen` beziehungsweise `@Pflanze`/`@Blume` als auch direkte
`erde`- und `pflanze`-Schichten an Funditems.

Jeder kursweite „alle“-Erfolg wird erst geprüft, nachdem der vollständige
Kurskatalog geladen wurde, und nur, wenn mindestens ein Objekt seiner eigenen
Kategorie existiert. Fehlt eine bestimmte Kistenart oder besitzt der Kurs kein
unsichtbares Objekt, keinen Zauberstaub, keine Erde beziehungsweise keine Pflanze,
vergibt er den jeweils zugehörigen Erfolg daher nicht beim Start. Jeder Erfolg wird
pro Browser-Tab genau einmal gespeichert und beim Neuladen nicht erneut eingeblendet.

## `@Highscore`

          --{{0}}--
Setze `@Highscore` möglichst auf die erste Seite des Kurses. Dort beginnt die Zeitmessung.

```markdown
@Highscore(100, 10, 5, 15, 2)
```

Die fünf Parameter sind:

| Position | Bedeutung | Beispiel |
|:--|:--|--:|
| 1 | maximale Punktzahl | `100` |
| 2 | Punktabzug je fehlgeschlagener Prüfung | `10` |
| 3 | Punktabzug je geöffnetem Hinweis | `5` |
| 4 | Minuten ohne Zeitabzug | `15` |
| 5 | Punktabzug pro Minute nach dieser Freigrenze | `2` |

Der Zeitabzug wird pro vollständig vergangener Sekunde anteilig berechnet. Bei einem
Abzug von `2` Punkten pro Minute kostet jede Sekunde somit `2 / 60` Punkte.

Der Punktestand bleibt innerhalb des aktuellen Browser-Tabs auch beim Neuladen erhalten.
Ein neuer Tab beginnt einen neuen Versuch.

@Highscore(100, 10, 5, 0, 6)

## Automatisch erfasste Aufgaben

          --{{0}}--
@Ressourcen(1, 1, 2)

Nach `@Highscore(...)` funktionieren normale LiaScript-Quizze und Hinweise unverändert.
Jede falsche Prüfung und jeder tatsächlich aufgedeckte Hinweis werden automatisch erfasst.
Ist Energie über den dritten Wert von `@Ressourcen(...)` aktiviert, kostet jeder
gültige Klick auf **Prüfen** und jeder erfolgreiche manuelle lia-timer-Start genau
eine Energie. Bei `0` bleibt die jeweilige Aktion ohne Wirkung.

Berechne $2 + 2$.

[[4]]
[[?]] Addiere zwei und zwei.

Mit dieser Energiekiste lässt sich anschließend genau eine weitere Prüfung freischalten:

@Energiekiste

## Punkte und Trophäen

          --{{0}}--
Der intern ungerundete Punktestand bestimmt die Trophäe:

| Anteil an der Maximalpunktzahl | Anzeige |
|:--|:--|
| ab 90 % | goldene Trophäe |
| ab 75 % | silberne Trophäe |
| ab 50 % | kupferfarbene Trophäe |
| unter 50 % | keine Trophäe |

Im Dialog erscheinen nur die farbige Trophäe, sofern eine erreicht wurde, und die
tatsächlich erzielte Punktzahl mit höchstens einer Nachkommastelle. Die Maximalpunktzahl
und eine Aufschlüsselung der Abzüge werden nicht angezeigt.

## Implementierung

          --{{0}}--
Wenn du das Template nicht importieren möchtest, kannst du die gebaute Datei aus dem
aktuellen `main`-Stand direkt einbinden und das Makro in deinen LiaScript-Kopf kopieren:

```markdown
script: https://cdn.jsdelivr.net/gh/MINT-the-GAP/lia-loot@main/dist/index.js

@Highscore
<script run-once modify="false">
(function () {
  var api = window.__LIA_LOOT_HIGHSCORE__;
  if (!api) {
    throw new Error("Loot konnte nicht geladen werden: dist/index.js fehlt.");
  }
  api.configure(Number("@0"), Number("@1"), Number("@2"), Number("@3"), Number("@4"));
})();
"LIA: stop"
</script>
@end
```

## Automatische Abschlussaufgabe

          --{{0}}--
Das letzte native LiaScript-Quiz auf der letzten Kursseite ist automatisch die
Abschlussaufgabe. Dafür ist kein weiteres Makro nötig. Sobald diese Aufgabe korrekt
gelöst wurde, stoppt die Zeit und der Highscore-Dialog öffnet sich.

Der folgende Block ist ein kopierbares Minimalbeispiel. Im verwendenden Kurs muss
dieses Quiz auf der letzten Kursseite stehen, wenn es die Abschlussaufgabe sein soll:

```markdown
Wie heißt dieses Template?

[[Loot]]
[[?]] Der Name bedeutet auf Englisch unter anderem Beute oder Fundstücke.
```

## Integrationsbeispiele für Fremdtemplates

Die ausführbaren Beispiele mit DynFlex, Timer, Board-Mode, Marker, Annotation,
Canvas/OCR, Kachel, LLM, Coordinate, Freeze und MathPath liegen im eigenständigen
Kurs [`TemplateTargets.md`](./TemplateTargets.md). Die eigenständigen Demo-Kurse
importieren die benötigten Fremdtemplates direkt und jeweils genau einmal. Die frühere README-Übersicht bleibt unten
als nicht ausführbarer Markdown-Quelltext erhalten.

````markdown
<a id=template-live-beispiele></a>

# Template-Verstecke und -Schlösser live

Die folgenden 11 Folien decken in der Reihenfolge der unterstützten Zieltemplates
alle zwölf Ziel-IDs ab; `marker` und `markerquiz` teilen sich eine Folie. Jede
Folie zeigt die öffentliche, kopierbare Loot-Syntax und direkt darunter die
zugehörige Template-Komponente als Beispiel. Die Live-Instanzen verwenden intern
`@LootTruhe_` und `@LootSchloss_`. Bei Board-Mode, Marker und Annotation tragen
auch die internen Schlösser ausdrücklich `anker`; deshalb erscheinen sie nur auf
ihrer Beispielfolie. Ohne `anker` blieben diese globalen Schlösser kursweit aktiv.
Im vollständigen Achievement-Katalog werden alle Live-Instanzen trotzdem
mitgezählt. In eigenen Kursen werden ausschließlich die öffentlichen Makros aus den
Codeblöcken verwendet.

Board-Mode, der globale Marker und Annotation sind kursweite Werkzeugleisten. Ihre
foliengebundene Truhe und ihr Schloss sind live und folgen dem Zustand des jeweiligen
Menüs: Board-Mode und Marker müssen nach dem Entsperren geöffnet, Annotationen nach
dem Entsperren ausgeblendet sein. Alle Schlösser lassen sich mit dem Schlüssel auf
derselben Folie öffnen.

## lia-DynFlex – `dynflex`

Die Truhe und das Schloss beziehen sich auf den ganzen sichtbaren
`.dynFlex`-Bereich:

```markdown
@Schluessel(rot)
@Schatztruhe(dynflex)
@Schloss(dynflex, rot)
```

@Schluessel(rot)

<section class="dynFlex">

<div class="flex-child">

Welche Zahl folgt auf 2?

[[3]]

</div>

<div class="flex-child">

Auch dieser zweite Baustein gehört zum gesperrten Bereich.

</div>

</section>

@LootTruhe_(@uid,dynflex; anker,gold)
@LootSchloss_(@uid,dynflex,rot)

## lia-timer – `timer`

Der Modus `onclick` erzeugt einen sichtbaren Startbutton. Die Truhe gehört zum
Timer-Quiz; das Schloss liegt genau um diesen extern erzeugten Startbutton. Ein
erfolgreicher manueller Start kostet bei aktivierter Energie genau eine Energie:

```markdown
@Schluessel(blau)
@Diamanttruhe(timer)
@Schloss(timer, blau)
```

@Schluessel(blau)

<!-- data-solution-timer="10s" data-solution-timer-start="onclick" -->
Wie viel ist 9 + 6?

[[15]]

@LootTruhe_(@uid,timer; anker,diamonds)
@LootSchloss_(@uid,timer,blau)

## lia-board-mode – `boardmode`

Der Fontbutton `#lia-tff-btn-v2` öffnet die globale Schriftsteuerung. Die
Energiekiste ist nur im geöffneten Menü sichtbar und wird als Kind von
`#lia-tff-panel-v2` eingesetzt. Das Schlossbeispiel verwendet den eindeutigen Alias
`boardmodefontbutton` für den Fontbutton:

```markdown
@Schluessel(gruen)
@Energiekiste(boardmode; anker)
@Schloss(boardmodefontbutton, gruen; anker)
```

@Schluessel(gruen)

@LootTruhe_(@uid,boardmode; anker,energy)
@LootSchloss_(@uid,boardmodefontbutton,gruen; anker)

## lia-marker – `marker` und `markerquiz`

Dieses Template besitzt zwei sinnvolle Fundorte: das geöffnete globale
Textmarkermenü und den lokalen Bereich einer Textmarker-Aufgabe. Die globale Truhe
liegt als Kind von `#lia-hl-panel > .body`; `textmarkerbutton` sperrt den
Markerbutton, mit dem dieses Menü geöffnet wird.

```markdown
@Schluessel(gelb)
@Schatztruhe(textmarker; anker)
@Schloss(textmarkerbutton, gelb; anker)

@Schluessel(lila)
@Diamanttruhe(markerquiz)
@Schloss(markerquiz, lila)
```

Öffne das Textmarkermenü über den Markerbutton. Erst dann ist die
foliengebundene Schatztruhe innerhalb des Menüs sichtbar:

@Schluessel(gelb)

@LootTruhe_(@uid,marker; anker,gold)
@LootSchloss_(@uid,textmarkerbutton,gelb; anker)

Das lokale Markerquiz ist einschließlich Schlüssel, Diamanttruhe und Schloss live:

@Schluessel(lila)

<div class="markerquiz">

Markiere das Wort @markred(Rot) mit dem roten Textmarker.

@TextmarkerQuiz

</div>

@LootTruhe_(@uid,markerquiz; anker,diamonds)
@LootSchloss_(@uid,markerquiz,lila)

## lia-annotation – `annotation`

Blende die Annotationen über den Augenbutton aus. Nur in diesem Zustand erscheint
die foliengebundene Energiekiste mit Abstand unterhalb der globalen Werkzeugleiste.
Der Alias `annotationsbar` sperrt die gesamte Leiste mit allen ihren Buttons:

```markdown
@Schluessel(orange)
@Energiekiste(annotation; anker)
@Schloss(annotationsbar, orange; anker)
```

@Schluessel(orange)

@LootTruhe_(@uid,annotation; anker,energy)
@LootSchloss_(@uid,annotationsbar,orange; anker)

## lia-canvas-ocr – `canvasocr`

`@canvas` erzeugt zunächst den Öffnerbutton. Nach dem Öffnen erscheint die Truhe
innerhalb der tatsächlichen Zeichenfläche `canvas.lia-draw` und nie über diesem
Button. Das Schloss sperrt weiterhin die gesamte Canvas-/OCR-Komponente:

```markdown
@Schluessel(rot)
@Schatztruhe(canvasocr)
@Schloss(canvasocr, rot)
```

@Schluessel(rot)

Wie viel ist 10 + 5?

[[15]]

@canvas

@LootTruhe_(@uid,canvasocr; anker,gold)
@LootSchloss_(@uid,canvasocr,rot)

## lia-kachel – `kachel`

Die offiziell unterstützte, skriptfreie `<div class="Kachel">`-Region ist
das Ziel. Sie kommt ohne zusätzliche sichtbare Skriptausgabe aus:

```markdown
@Schluessel(gelb)

<div class="Kachel">

Ordne die beiden richtigen Grundfarben zu.

<!-- data-randomize="true" -->
[->[(Rot)|Orange]] [->[(Blau)|Grün]].

</div>

@Schatztruhe(kachel)
@Schloss(kachel, gelb)
```

@Schluessel(gelb)

<div class="Kachel">

Ordne die beiden richtigen Grundfarben zu.

<!-- data-randomize="true" -->
[->[(Rot)|Orange]] [->[(Blau)|Grün]].

</div>

@LootTruhe_(@uid,kachel; anker,gold)
@LootSchloss_(@uid,kachel,gelb)

## lia-llm – `llm`

Das Schloss umfasst den vollständigen von `@LLMQuiz` erzeugten Quizbereich.
Beim Öffnen der Folie kann das Template Modellgewichte laden und WebGPU oder seinen
dokumentierten Fallback verwenden.

```markdown
@Schluessel(lila)
@Diamanttruhe(llm)
@Schloss(llm, lila)
```

@Schluessel(lila)

Erkläre in einem Satz, warum Eis auf Wasser schwimmt.

<!-- data-solution-button="off" data-llm-textarea="3" -->
[[Antwort]]
```text @LLMQuiz(0.66;solution=0;feedback=0;operator=erklaeren)
Eis besitzt eine geringere Dichte als flüssiges Wasser und schwimmt deshalb an
der Oberfläche.
```

@LootTruhe_(@uid,llm; anker,diamonds)
@LootSchloss_(@uid,llm,lila)

## lia-coordinate – `coordinate`

Loot verwendet direkt den `containerObj` des tatsächlich registrierten
Koordinatensystems. Dadurch funktioniert das Schloss auch dann, wenn Registry-ID
und automatisch vergebene Laufzeit-DOM-ID verschieden sind:

```markdown
@Schluessel(rot)
@Diamanttruhe(coordinate)
@Schloss(coordinate, rot)
```

@Schluessel(rot)

@CoordinateSystem(`xmin=-4;xmax=4;ymin=-3;ymax=3;width=520;id=loot_coord_readme_demo`)

@LootTruhe_(@uid,coordinate; anker,diamonds)
@LootSchloss_(@uid,coordinate,rot)

## lia-freeze-v2 – `freeze`

`@Abgabe` erzeugt eine klar erkennbare Freeze-Abgabebox. Für die vollständige
Linkerzeugung muss der Kurs über eine erreichbare URL in LiaScript geladen sein.

```markdown
@Schluessel(gelb)
@Schatztruhe(freeze)
@Schloss(freeze, gelb)
```

@Schluessel(gelb)

@Abgabe

@LootTruhe_(@uid,freeze; anker,gold)
@LootSchloss_(@uid,freeze,gelb)

## lia-mathpath – `mathpath`

Freeze ist im Dokumentkopf vor MathPath importiert. Gib zuerst absichtlich `0`
ein und prüfe die falsche Antwort; danach lässt sich der Hinweis öffnen. Die
Truhe gehört weiterhin zum Quiz, das Schloss erscheint dagegen ausschließlich
über dem von `@Explain` erzeugten Erklärlink. Prüfen, Antwort und Hint-Button
bleiben frei bedienbar. Diese letzte Aufgabe bleibt zugleich die automatische
Abschlussaufgabe der README.

```markdown
@Schluessel(gruen)
@Diamanttruhe(mathpath)
@Schloss(mathpath, gruen)
```

@Schluessel(gruen)

<!-- data-hint-button="1" -->
Wie viel ist $\frac{1}{2}+\frac{1}{2}$? [[1]]
[[?]] @Explain

@ADetails(1=BE; Bruchrechnung, Einheiten)

@LootTruhe_(@uid,mathpath; anker,diamonds)
@LootSchloss_(@uid,mathpath,gruen)
````
