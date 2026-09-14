# Inline-Reveals: Gartenregression

## Ausgangspunkt und unveraenderte Quelle

- lia-loot: `84ba6b38e0a896166e3480376bcfe337fc4c469e`.
- Originalkurs: [Wochenaufgabe/5/Mathematik/Lia5_03.md](https://github.com/MINT-the-GAP/Wochenaufgabe/blob/5109e1046496ef3c8809b0e88c0a30924fd47d2a/5/Mathematik/Lia5_03.md#L1252).
- Kursrevision: `5109e1046496ef3c8809b0e88c0a30924fd47d2a`.
- Die Fixture `fixtures/reveal-inline-garden.md` bewahrt die beiden Originalabsaetze
  mit der urspruenglichen Zeilenstruktur, einschliesslich Leerzeilen sowie fuehrendem
  und abschliessendem Leerzeichen. Die Gartenfolie folgt einer Startfolie.
- Am Wochenaufgabe-Repository und seinen oeffentlichen Makroaufrufen wurde nichts geaendert.

## Reproduktion vor der Korrektur

Vor den Browserpruefungen wurde `npm run build` ausgefuehrt. Getestet wurde sowohl
mit dem installierten echten LiaScript-Editor als auch unter
`https://liascript.github.io/course/` mit dem vollstaendigen Originalkurs und seinen
Importen. Im oeffentlichen Renderer wurden ausschliesslich die lia-loot-README und
das Bundle durch den lokalen Ausgangsstand ersetzt.

Die kleine lokale Fixture funktionierte auf dem Ausgangsstand bereits. Erst der
vollstaendige Kurs im oeffentlichen Renderer reproduzierte die verbliebene
Absatzverbergung:

| Reveal-ID | Zugeordneter Inhalt | Verbunden | hidden | Gerendert | Berechnete visibility |
| --- | --- | --- | --- | --- | --- |
| 7_2 | @Energiekiste (Erde) | ja | false | true | visible |
| 7_5 | @Energiekiste (Pflanze) | ja | false | true | visible |
| 7_7 | @Puzzleteil(tuerkis; 1) (Erde) | ja | false | true | hidden |
| 7_9 | @Puzzleteil(tuerkis; 2) (Pflanze) | ja | false | true | hidden |
| 7_11 | @Puzzleteil(tuerkis; 3) (Pflanze) | ja | false | true | hidden |
| 7_13 | @Puzzleteil(tuerkis; 4) (Erde) | ja | false | true | hidden |

Alle Renderer waren bereits entfernt. Drei Tail-Marker fuer `7_7`, `7_9` und
`7_11` blieben im gemeinsamen `p.lia-paragraph` zurueck. Dessen `visibility:hidden`
vererbte sich an alle vier Steuerelemente. Der Absatz hatte selbst weder `hidden`
noch `inert`; die weiteren Vorfahren einschliesslich `main` waren sichtbar.
Die drei verbliebenen Marker hatten jeweils unmittelbar danach einen direkten
Textknoten ` ) ` und anschliessend die naechste Reveal-Instanz. Der bisherige
Cleanup erwartete einen `span[ondblclick]`-Wrapper und ignorierte diesen Fall.
Sowohl das Runtime-CSS als auch das Base64-CSS der importierten README enthielten
die zu breite Absatzregel.

Ein getrennt injizierter Fehler reproduzierte zusaetzlich den veralteten Host nach
asynchroner Quellaufloesung: Im echten lokalen Renderer wurde `1_2` unmittelbar
nach dem API-Aufruf ersetzt. Bei `send.lia("LIA: stop")` war der Anfangshost
abgetrennt (`isConnected=false`) und ungleich dem aktuellen Host derselben ID.
Fuer diese Instanz wurde kein dynamischer Inhalt gesendet. Nach zwoelf Sekunden
fehlte weiterhin `data-loot-inline-rendered`; Renderer und Tail blieben stehen.
Die Absatzregel verbarg dadurch auch den benachbarten, korrekt geladenen Host
`1_5`. Dieser Fehler wurde gezielt ausgeloest und war nicht die Ursache des oben
protokollierten vollstaendigen Kurslaufs.

Eine weitere Preservation-Pruefung fand auch auf dem Ausgangsstand einen
verlorenen Originalnachsatz nach der zweiten Energie-Instanz. Instrumentiertes
`Node.replaceChild` zeigte, dass ein spaeterer LiaScript-VDOM-Patch den Span
mit `zum Blühen bringen. Pflücke die Blume, sodass sie ihre Geheimnisse
preisgibt.` ersetzte. Physisches Entfernen der Compiler-Spans hatte vorher die
Kindpositionen im Absatz verschoben. Die Bereinigung muss deshalb deren
DOM-Plaetze erhalten; nur eigene Compilerpraefixe und aktive Markerattribute
werden entfernt.

## Korrektur

Die Zuordnung und Wiederaufnahme erfolgen anhand der stabilen Reveal-ID.
Dynamische Belohnungs-IDs werden ausschliesslich aus Reveal-ID, Attributname
und urspruenglicher LiaScript-UID gebildet; Cover-/SVG-Aufbau und der Zeitpunkt
der Initialisierung beeinflussen sie nicht.
Compilerreste duerfen nur unmittelbar zugeordnete Textknoten oder Compilerwrapper
betreffen; Nachbarinstanzen und normaler Begleittext bleiben erhalten.

Beide CSS-Stellen verbergen ausschliesslich Marker sowie noch nicht initialisierte
oder fehlgeschlagene Instanzen. Das authored `hidden` am Inline-Host entfaellt;
ein instanzbezogener CSS-Selektor schuetzt den Inhalt bis zur Initialisierung.
`data-loot-reveal-kind` wird erst gesetzt, nachdem der eigene Payload mit
`hidden`, `inert` und `aria-hidden` abgesichert und das Cover erstellt wurde.
Ein erneutes Setzen von authored `hidden` wurde im protokollierten
Produktionslauf nicht beobachtet. Statisch fehlte jedoch eine Reaktion darauf
in `LootRevealElement.observedAttributes`; durch die Entfernung aus dem
Makro besitzt LiaScript diesen widerspruechlichen authored Zustand nicht mehr.
Die Freigabemechanik in `exploration.ts` bleibt erhalten: Erde braucht die Schaufel,
Pflanzen werden gegossen und danach ueber die Bluete geoeffnet.

## Geaenderte Dateien

| Datei | Zweck |
| --- | --- |
| `src/inline-reveal.ts` | ID-Zuordnung, begrenzte Wiederaufnahme, sichere Ausgabe- und Tail-Verarbeitung |
| `src/style.ts` | Sichtbarkeit auf die jeweilige Instanz begrenzen |
| `README.md` | Gleiches Preflight-CSS; kein authored hidden am Inline-Host |
| `dist/index.js` | Neu gebautes ausgeliefertes Bundle |
| `tests/course-chests.test.mjs` | Source-Reihenfolge der originalen Gartenabschnitte |
| `tests/browser/fixtures/reveal-inline-garden.md` | Originaltext plus eigener Testablauf und Puzzletor ausserhalb des unveraenderten Auszugs |
| `tests/browser/garden-helpers.mjs` | Echte Compiler-/DOM-Diagnostik und Interaktionspruefungen |
| `tests/browser/reveal-inline-garden.spec.mjs` | Sechs lokale Gartenregressionen |
| `tests/browser/reveal-inline-garden-published.spec.mjs` | Vollstaendiger veroeffentlichter Kurs und alle Originalimporte |
| `tests/browser/reveal-inline.spec.mjs` | Bestehende Mechanik auch fuer Alias @Blume.inline |
| `tests/browser/reveal-loading-artifacts.spec.mjs` | Instanzbezogener Ladeschutz, direkte Tails, Nachbar-/Textschutz |
| `tests/browser/import-fixtures.spec.mjs` | Neuer Preflight-/Makrovertrag |
| `tests/browser/inline-reveal-regression.md` | Ursachen, Abgrenzung und Testnachweis |

## Testergebnisse

Abschliessender Build vor den Browserlaeufen: `npm run build`, erfolgreich,
`dist/index.js` 364.34 kB. `npm run typecheck` erfolgreich.
`npm test`: **348 bestanden**, keine Fehler, keine uebersprungenen Tests.

| Browserlauf | Ergebnis |
| --- | --- |
| Chromium: Inline, Alias, nested macros, Compilerreste, Blockketten, Importreihenfolge | 19 bestanden |
| Firefox und WebKit: Inline, Alias, nested macros, Compilerreste | 18 bestanden (9 je Engine) |
| Chromium: unveraenderte Gartenfixture, kompletter Ablauf, Hostersatz, fehlender Host, Ausgabe-/Quellfehler | 6 bestanden |
| Chromium: veroeffentlichter Originalkurs mit allen Importen, Navigation, sechs Freigaben und Reload | 1 bestanden |

Damit sind **44 Browserpruefungen** erfolgreich. Die Garden-Tests pruefen nach
Einsammeln den freigegebenen, nicht inerten Payload und das stabile Inventar;
ein bereits leerer Belohnungs-Payload muss keine sichtbare Box mehr besitzen.
Beide Energiebelohnungen bleiben einmalig, alle vier Puzzleteile eindeutig.

Die Entwicklungslauf-Fehler (verlorener Nachsatz und erneut erzeugte verborgene
Belohnungsduplikate) wurden reproduziert und korrigiert. Das letzte Produktbundle
besteht die unveraenderten bestehenden nested-macro-Pruefungen in allen drei
Engines. Testaufbaufehler wurden getrennt korrigiert: passender gemeinsamer
Gartenabsatz fuer direkte Tails, eigenes Puzzletor fuer die Testteil-Katalogisierung,
und Zustand statt Geometrie eines nach Einsammeln leeren Payloads.

Ausgefuehrte Browserbefehle (Ausgaben unter `.parcel-cache/inline-verified-*`):

```sh
npx playwright test tests/browser/reveal-inline.spec.mjs tests/browser/reveal-inline-nested-macros.spec.mjs tests/browser/reveal-loading-artifacts.spec.mjs tests/browser/import-fixtures.spec.mjs --project=chromium --workers=1 --output=.parcel-cache/inline-verified-chromium
npx playwright test tests/browser/reveal-inline.spec.mjs tests/browser/reveal-inline-nested-macros.spec.mjs tests/browser/reveal-loading-artifacts.spec.mjs --project=firefox --project=webkit --workers=2 --output=.parcel-cache/inline-verified-engines
npx playwright test tests/browser/reveal-inline-garden.spec.mjs --project=chromium --workers=1 --output=.parcel-cache/garden-final-local
npx playwright test tests/browser/reveal-inline-garden-published.spec.mjs --project=chromium --workers=1 --output=.parcel-cache/garden-final-published
```

Der oeffentliche Kurs wurde ueber echte Netzwerkimporte geladen; ausschliesslich
README und Bundle von lia-loot wurden fuer den Test durch die lokalen Aenderungen
ersetzt. Erstbesuch, Hin-/Ruecknavigation und Reload erhalten alle sechs richtigen
Zuordnungen, den gesamten Originalnachsatz sowie die Sperren bis Schaufeln bzw.
Giessen und anschliessendem Oeffnen der Bluete. Der published-Test protokolliert
Host-IDs, Inhalte, Renderer/Tails, Verbindung, hidden/inert und berechnete
Sichtbarkeit aller Vorfahren in JSON-Artefakten. `git diff --check` erfolgreich.
Die Pruefung veroeffentlicht selbst keine Dateien. Die gesicherten
Ausgangsdiagnosen liegen lokal unter `.parcel-cache/garden-baseline/`.


Die abschliessenden JSON-Diagnosen liegen unter
`.parcel-cache/garden-final-published/reveal-inline-garden-publi-93bbd-orten-Garten-und-Navigation-chromium/`:
`published-garden-visibility.json` und `published-hidden-mutations-before-reload.json`.
Sie bestaetigen alle sechs richtigen Inhalte, verbundene Hosts, `rendered=true`,
`hidden=false`, sichtbare Vorfahren und null aktive Renderer-/Tail-Marker.
Waehrend der Navigation wurden voruebergehend auch `hidden=true` und danach
`hidden=false` beobachtet. Das ist keine sichere Attribution zu authored hidden;
die legitimen Folien-/Freigabegates duerfen diesen Zustand weiterhin setzen.
Der lokale Testserver wurde nach den Pruefungen beendet.
