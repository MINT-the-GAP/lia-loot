export interface CoursePuzzlePieceDeclaration {
  gated: boolean
  options: string
  section: number
  sourceOrder: number
}

export interface CoursePuzzleGateDeclaration {
  gated: boolean
  options: string
  section: number
  sourceOrder: number
}

export interface CoursePuzzleDiscovery {
  gates: CoursePuzzleGateDeclaration[]
  pieces: CoursePuzzlePieceDeclaration[]
}
