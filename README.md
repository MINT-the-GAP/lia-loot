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
})(200);
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
      rawEnergy === "" || rawEnergy === "@2"
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
})(200);
"LIA: stop"
</script>
@end

@achievements: @LootAchievements_
@Achievements: @LootAchievements_
@Erfolge: @LootAchievements_

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
})(200);
"LIA: stop"
</script>
@end

@Schatztruhe: @LootTruhe_(@uid,@0,gold)
@Diamanttruhe: @LootTruhe_(@uid,@0,diamonds)
@Energiekiste: @LootTruhe_(@uid,@0,energy)
@Schluessel: @LootSchluessel_(@uid,@0)
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
- mit passenden Farbschlüsseln entsperrbare Bedienobjekte,
- das letzte native Quiz auf der letzten Kursseite als Abschlussaufgabe,
- freigeschaltete Erfolge für Aufgaben, Highscore, Truhen, Schlösser und Geheimfolien.

           {{1}}
Nach der Veröffentlichung kann das Template mit folgender URL getestet werden:

`https://liascript.github.io/course/?https://raw.githubusercontent.com/MINT-the-GAP/Loot/main/README.md`

Das vorgesehene Repository ist:

`https://github.com/MINT-the-GAP/Loot`

## Einbindung

          --{{0}}--
Importiere das Template im Kopf deines LiaScript-Kurses:

`import: https://raw.githubusercontent.com/MINT-the-GAP/Loot/main/README.md`

Für veröffentlichte Kurse sollte später eine feste Version verwendet werden:

`import: https://raw.githubusercontent.com/MINT-the-GAP/Loot/0.0.1/README.md`

Ein vollständiger, bewusst leicht lösbarer Testkurs liegt in
[`EscapeRoom.md`](./EscapeRoom.md). Er bindet das Template relativ mit
`import: ./README.md` ein und eignet sich damit auch als Import-Smoke-Test.

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
der optionale dritte Wert die Zahl der verfügbaren Prüfungen. Jeder gültige Klick
auf **Prüfen** kostet eine Energie. Bei `0` wird die Prüfung vollständig blockiert.
Jeder geöffnete Hinweis kostet weiterhin eine Goldmünze, jedes Auflösen einen Diamanten.
Ohne ausreichenden Bestand wird die jeweilige Aktion nicht ausgeführt. Der verbleibende
Bestand bleibt beim Neuladen innerhalb desselben Browser-Tabs erhalten.

Für bestehende Kurse bleibt der Aufruf mit zwei Werten gültig. Dann ist Prüfen
unbegrenzt möglich und das Energiesymbol wird nicht eingeblendet:

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

Beim Anklicken steigt der Goldbestand um eins und die Truhe verschwindet dauerhaft
für den aktuellen Browser-Tab. Jeder Makroaufruf erhält eine eigene ID und kann daher
genau einmal eingesammelt werden.

Mit einer durch Semikolons getrennten Liste setzt ein Aufruf mehrere unabhängige
Truhen in LiaScripts Bedienoberfläche:

```markdown
@Schatztruhe(toc; menu; classroom; info; translator; mode)
```

| Ziel | Position |
|:--|:--|
| `toc` | Inhaltsverzeichnis |
| `menu` | Design- und Einstellungsmenü |
| `classroom` | Teilen- und Classroom-Menü |
| `info` | Info-Menü |
| `translator` | Übersetzungs- und Sprachauswahl |
| `mode` | Auswahl der Darstellung: Lehrbuch, Präsentation oder Folien |

Zusätzlich verstehen alle drei Truhenarten und Schlüssel zwei frei kombinierbare
Optionen. Sie werden wie die Ziele durch Semikolons getrennt:

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

Unvollständige oder vertippte Anker- und Zeitangaben lassen den Fund fail-closed
verborgen und erzeugen eine Warnung in der Browserkonsole. Die bisherigen
Schreibweisen bleiben zur Kompatibilität mit vorhandenen Kursen weiterhin gültig.

Die Ziele können einzeln oder kombiniert angegeben werden. Oberflächen-Truhen werden
bereits beim Kursstart aus der Kursquelle registriert. Sie erscheinen deshalb im ToC
und in den Menüs, auch wenn die Folie mit dem Makro noch nie geöffnet wurde. Kommentare
und Markdown-Codebeispiele werden dabei ignoriert. Eine Truhe ohne Ziel folgt weiterhin
dem jeweiligen Inhalt und erscheint zum Beispiel erst, wenn ein Hinweis oder eine
Musterlösung tatsächlich angezeigt wird. Zum Einsammeln muss `@Ressourcen(...)` den
Bestand aktiviert haben; andernfalls zeigt die Truhe einen entsprechenden Hinweis.

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

Beim Anklicken steigt der Diamantenbestand um eins. Danach verschwindet die
Diamanttruhe dauerhaft für den aktuellen Browser-Tab. Sie besitzt eine eigene
cyan-silberne Pixelart und ein Diamantemblem.

Alle Zielangaben der Goldtruhe funktionieren genauso für Diamanttruhen:

```markdown
@Diamanttruhe(toc; menu; classroom; info; translator; mode)
@Diamanttruhe(translator; anker; 15s)
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

Beim Anklicken steigt der Energiebestand um eins. Danach verschwindet die
Energiekiste dauerhaft für den aktuellen Browser-Tab. Ihre violett-goldene
Pixelart trägt ein gut sichtbares Blitzemblem.

Alle Zielangaben der anderen Truhen funktionieren auch für Energiekisten:

```markdown
@Energiekiste(toc; menu; classroom; info; translator; mode)
@Energiekiste(mode; anker; 12s)
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
```

Auch Schlüssel unterstützen beide Sichtbarkeitsoptionen. Ohne Farbangabe bleibt
die bisherige stabile Überraschungsfarbe erhalten:

```markdown
@Schluessel(gruen; anker; 30s)
@Schluessel(anker; 1min)
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

## `@Schloss`

          --{{0}}--
Mit `@Schloss` lässt sich ein globales Bedienobjekt oder eine lokale Quiz-Aktion
mit einem farbigen Pixelart-Schloss sperren:

```markdown
@Schloss(info, gruen)
```

Das Ziel steht im ersten Parameter, die benötigte Schlüsselfarbe im zweiten. Für
Schlösser stehen alle sechs Schlüsselfarben `rot`, `blau`, `gruen`, `gelb`, `lila`
und `orange` zur Verfügung.

Globale Ziele sperren Elemente der LiaScript-Oberfläche:

| Ziel | Gesperrtes Bedienobjekt |
|:--|:--|
| `toc` | Inhaltsverzeichnis |
| `mode` | Auswahl der Darstellung |
| `menu` | Theme- und Einstellungsmenü |
| `translator` | Übersetzer und Sprachauswahl |
| `classroom` | Teilen- und Classroom-Menü |
| `info` | Info-Menü |
| `seitenwechsel` | beide Prev-/Next-Schaltflächen für Zurück und Weiter |

Ein globaler Aufruf steht allein in einer eigenen Zeile. Er wird bereits beim
Kursstart aus der Kursquelle registriert; das Schloss ist also sichtbar, bevor die
Folie mit dem Makro besucht wurde. `@Schloss(seitenwechsel, orange)` sperrt Zurück
und Weiter gemeinsam. Ein orangefarbener Schlüssel entsperrt beide Schaltflächen.

Für Quizze gibt es drei lokale Ziele:

| Ziel | Gesperrte Quiz-Aktion |
|:--|:--|
| `check` | Prüfen |
| `resolve` | Auflösen |
| `hint` | Hinweis |

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

## `@achievements`

          --{{0}}--
Mit einem einzelnen Makro aktivierst du die Erfolgsmeldungen für den gesamten Kurs:

```markdown
@achievements
```

`@achievements` ist die kanonische Schreibweise. Zusätzlich funktionieren
`@Achievements` und `@Erfolge`. Das Template erkennt den Aufruf direkt in der
Kursquelle; das System ist deshalb schon beim Kursstart aktiv, auch wenn das Makro
auf einer späteren Folie steht.

Beim ersten Erreichen erscheint unten rechts ein kleines, nichtmodales Overlay. Es
bleibt sichtbar, bis es über **×** geschlossen wird. Werden mehrere Erfolge zugleich
freigeschaltet, erscheinen sie danach einzeln in einer Warteschlange.

| Erfolg | Bedingung |
|:--|:--|
| Aufgaben-Meister | Die automatische Abschlussaufgabe ist korrekt gelöst und alle dabei geladenen bewertbaren LiaScript-Quizze sind gelöst. |
| Perfekter Highscore | Der endgültige Highscore entspricht exakt der konfigurierten Maximalpunktzahl. |
| Schatzjäger | Jede im Kurs deklarierte Schatz-, Diamant- und Energiekiste wurde geöffnet. Mehrere Ziele eines Kistenmakros zählen als einzelne Truhen. |
| Schlossknacker | Alle gültig deklarierten globalen und quizlokalen Schlösser wurden mit passenden Schlüsseln geöffnet. |
| Geheimnis entdeckt | Eine Geheimfolie wurde nach exakter Suche tatsächlich geöffnet. |

Als bewertbare Aufgaben zählen native Quizze mit **Prüfen** und **Auflösen**;
Umfragen werden nicht mitgezählt. Ein „alle“-Erfolg für Truhen oder Schlösser wird
nur geprüft, wenn mindestens ein solches Objekt existiert und der vollständige
Kurskatalog geladen wurde. Jeder Erfolg wird pro Browser-Tab genau einmal gespeichert
und beim Neuladen nicht erneut eingeblendet.

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
gültige Klick auf **Prüfen** genau eine Energie. Bei `0` bleibt der Klick ohne Wirkung.

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
Wenn du das Template nicht importieren möchtest, kannst du nach einer Veröffentlichung
die gebaute Datei direkt einbinden und das Makro in deinen LiaScript-Kopf kopieren:

```markdown
script: https://cdn.jsdelivr.net/gh/MINT-the-GAP/Loot@0.0.1/dist/index.js

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

```markdown
Wie heißt dieses Template?

[[Loot]]
[[?]] Der Name bedeutet auf Englisch unter anderem Beute oder Fundstücke.
```

Wie heißt dieses Template?

[[Loot]]
[[?]] Der Name bedeutet auf Englisch unter anderem Beute oder Fundstücke.
