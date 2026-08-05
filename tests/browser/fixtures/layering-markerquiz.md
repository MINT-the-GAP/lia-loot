<!--
author:   Martin Lommatzsch
version:  1.0.0
language: de
mode:     Textbook
comment:  Deterministische Browser-Regression für Schloss-Layer und Markerquiz-Ressourcen.

import: https://raw.githubusercontent.com/MINT-the-GAP/lia-DynFlex/9ef8f05c0eae8b51e183efbfe34c5b38e41488c8/README.md
import: https://raw.githubusercontent.com/MINT-the-GAP/lia-marker/ecb68037026e8e9db6fae4bf23033ff89cff54a2/README.md
import: ../../../README.md
-->

# Schloss-Layer und Markerquiz

@Ressourcen(0, 0)

Der obere Abstand macht die Scrollgrenze des fixierten Headers reproduzierbar.

<div style="height: 45vh" aria-hidden="true"></div>

<section class="dynFlex" style="min-height: 30rem; width: 100%">

<div class="flex-child">

## Gesperrter DynFlex-Inhalt

Dieser Inhalt bleibt hinter dem Schloss verborgen.

</div>

<div class="flex-child">

Auch dieser Teil des DynFlex-Bereichs ist gesperrt.

</div>

</section>

@Schloss(dynflex, rot)

<div style="height: 65vh" aria-hidden="true"></div>

## Markerquiz ohne Diamanten

<div class="markerquiz">

Markiere das Wort @markred(Rot) mit dem roten Textmarker.

@TextmarkerQuiz

</div>

*****************
Diese Musterlösung darf ohne Diamanten nicht sichtbar werden.
*****************
