export namespace UserWorkspace {
  export type Info = {
    frameworks: Framework[]
    languages: Language[]
    name: string
    rootPath: string
    sourceCodeDocumentsLength: number
  }

  export type Evaluator = {
    command: string
    commandArgs: string[]
    extensions: string[]
    workingDirectoryAbsolutePath: string
  }

  export enum Framework {
    NEXT_JS = 'Next.js',
    REACT = 'React',
    TAURI = 'Tauri',
  }

  export enum Language {
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

  export type LanguagesStatistic = {
    count: Record<Language, number>
    ratio: Record<Language, number>
  }
}
