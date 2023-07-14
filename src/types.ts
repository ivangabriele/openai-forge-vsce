export type DocumentInfo = {
  absolutePath: string
  relativePath: string
  source: string
}

export enum ProjectFramework {
  REACT = 'React',
  TAURI = 'Tauri',
}

export enum ProjectLanguage {
  JAVASCRIPT = 'JavaScript',
  RUST = 'Rust',
  TYPESCRIPT = 'TypeScript',
}

export enum State {
  'RUNNING' = 'RUNNING',
  'STARTING' = 'STARTING',
  'STOPPED' = 'STOPPED',
  'STOPPING' = 'STOPPING',
}

export type WorkspaceInfo = {
  languages: ProjectLanguage[]
  mainFramework: ProjectFramework | undefined
  name: string
  rootPath: string
  subFrameworks: ProjectFramework[]
}

export enum WebSocketDataAction {
  ASK = 'ASK',
}

export type WebSocketData = {
  action: WebSocketDataAction
  message: string
}
