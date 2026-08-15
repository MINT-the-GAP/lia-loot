<!--
author:   MINT-the-GAP
version:  1.0.0
language: de
comment:  Browser-Regression fuer verschachtelte Makros in Inline-Reveals.

import: ../../../README.md
-->

# Verschachtelte Inline-Makros

@Ressourcen(0, 0, 0)
@Schaufel
@Giesskanne

@Erdhaufen.inline( @Energiekiste )
@Pflanze.inline( @Energietruhe )


@Erdhaufen.inline( @Puzzleteil(tuerkis; 1) )
@Pflanze.inline( @Puzzleteil(tuerkis; 2) )


@Erdhaufen.inline( @Puzzleteil(tuerkis; 3) )
@Pflanze.inline( @Puzzleteil(tuerkis; 4) )

@Puzzletor(tuerkis; [[1;2;3;4]])
