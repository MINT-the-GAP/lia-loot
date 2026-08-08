<!--
author: Lia Loot Test
version: 1.0.0
language: de
mode: Presentation
import: https://cdn.jsdelivr.net/gh/LiaTemplates/JSXGraph@main/README.md
import: https://cdn.jsdelivr.net/gh/MINT-the-GAP/lia-coordinate@1e1f7be4ea807c8360d10bf6b251a1272974212e/README.md
import: https://cdn.jsdelivr.net/gh/MINT-the-GAP/lia-pentominos@055342d24604f8db43b591c7738c7af7847a9971/README.md
import: http://127.0.0.1:4173/README.md
-->

# Zwei unabhängig gesperrte Pentomino-Quizze

@Schluessel(rot)
@Schluessel(blau)

**Einzelstein-Quiz**

@PentominoQuiz(3,`name=Lock-I2;type=I2;numbers=[1,2]`,`<!-- data-solution-button="off" -->`)

@Schloss(pentominoquiz, rot)

**Inventar-Quiz**

@PentominoDockQuizAuswahl(3,`I2`,`<!-- data-solution-button="off" -->`)

@Schloss(PentominoDockQuizAuswahl, blau)
