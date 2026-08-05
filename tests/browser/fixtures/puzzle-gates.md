<!--
author:   Lia Loot Test
version:  1.0.0
language: de
mode:     Textbook
comment:  Browser-Regression für Puzzleteile, Puzzletore und Folienfreigaben.

import: ../../../README.md
-->

# Rotes Puzzletor

Das rote Tor schützt alle späteren Folien. Das Portal versucht, das Tor zu überspringen.

@Portal(3)

@Puzzleteil(rot; 1)
@Puzzleteil(rot; 2)
@Puzzleteil(rot; 3)
@Puzzleteil(rot; 4)
@Puzzleteil(rot; 5)
@Puzzleteil(rot; 6)

@Puzzletor(rot; [[2;3];[1;6];[5;4]])

# Blaues Puzzletor

Dieses zweite Tor bildet die nächste Navigationsgrenze.

@Puzzleteil(blau; 1)
@Puzzleteil(blau; 2)

@Puzzletor(blau; [[2;1]])

# Geankertes grünes Puzzletor

Das geankerte Tor sperrt nur den nachfolgenden Inhalt dieser Folie.

@Puzzleteil(gruen; 1)
@Puzzleteil(gruen; 2)

@Puzzletor(gruen; [[2;1]]; anker)

<p id="puzzle-anchor-secret">Der geankerte Inhalt ist jetzt freigeschaltet.</p>

# Freigeschaltetes Kursende

Diese Folie liegt hinter der nächsten Überschrift und bleibt vom geankerten Tor unabhängig.
