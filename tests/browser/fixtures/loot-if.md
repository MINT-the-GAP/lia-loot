<!--
author: Lia Loot Test
email: test@example.invalid
version: 1.0.0
language: de
narrator: Deutsch Female
import: ../../../README.md
-->

# Bedingter Lootif-Echtlauf

@Ressourcen(0, 0, 0)

@Schatztruhe

@Lupe

@lootif(Gold >= 1; spawn)

<div id="real-lootif-outer">Der äußere Lootif-Inhalt ist erschienen.</div>

@lootif(Lupe gefunden; spawn)

<div id="real-lootif-inner">Der innere Lootif-Inhalt ist erschienen.</div>

Welche Zahl ist die Antwort? [[42]]

@Endelootif

@Endelootif
