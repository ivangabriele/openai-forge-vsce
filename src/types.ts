export enum ProjectFramework {
  NEXT_JS = 'Next.js',
  REACT = 'React',
  TAURI = 'Tauri',
}

export enum ProjectLanguage {
  C_SHARP = 'C#',
  DART = 'Dart',
  ELIXIR = 'Elixir',
  GO = 'Go',
  HASKELL = 'Haskell',
  JAVA = 'Java',
  JAVASCRIPT = 'JavaScript',
  KOTLIN = 'Kotlin',
  PHP = 'PHP',
  PYTHON = 'Python',
  RUBY = 'Ruby',
  RUST = 'Rust',
  SCALA = 'Scala',
  TYPESCRIPT = 'TypeScript',
}

export enum State {
  'FAILED' = 'FAILED',
  'RUNNING' = 'RUNNING',
  'STARTING' = 'STARTING',
  'STOPPED' = 'STOPPED',
  'STOPPING' = 'STOPPING',
}

export type WorkspaceInfo = {
  frameworks: ProjectFramework[]
  languages: ProjectLanguage[]
  name: string
  rootPath: string
  sourceCodeDocumentsLength: number
}

export enum WebSocketDataAction {
  ASK = 'ASK',
}

export type WebSocketData = {
  action: WebSocketDataAction
  message: string
}
