import { UserWorkspace } from './types'

export enum DocumentationPath {
  FAQ = 'docs/FAQ.md',
  WELCOME = 'docs/WELCOME.md',
}

export const IGNORED_DIRECTORY_GLOBS = [
  '.git',
  '.github',
  '.idea',
  '.vscode',
  '.yarn',
  '__pycache__',
  'build',
  'dist',
  'node_modules',
  'target',
  'vendor',
].map(directory => `!**/${directory}/**`)

export enum NotificationAction {
  NEVER_SHOW_AGAIN = 'Never show again',
  SHOW_HELP = 'Show Help',
}

export const USER_WORKSPACE_LANGUAGE_TO_EXTENSIONS_MAP: Record<UserWorkspace.Language, string[]> = {
  [UserWorkspace.Language.C_SHARP]: ['cs'],
  [UserWorkspace.Language.DART]: ['dart'],
  [UserWorkspace.Language.ELIXIR]: ['ex', 'exs'],
  [UserWorkspace.Language.GO]: ['go'],
  [UserWorkspace.Language.HASKELL]: ['hs', 'lhs'],
  [UserWorkspace.Language.JAVA]: ['java', 'jsp', 'jspx'],
  [UserWorkspace.Language.JAVASCRIPT]: ['cjs', 'js', 'jsx', 'mjs'],
  [UserWorkspace.Language.KOTLIN]: ['kt', 'kts'],
  [UserWorkspace.Language.PHP]: ['php', 'php3', 'php4', 'php5', 'php7', 'phtml'],
  [UserWorkspace.Language.PYTHON]: ['py', 'pyi', 'pyw'],
  [UserWorkspace.Language.RUBY]: ['rb'],
  [UserWorkspace.Language.RUST]: ['rs'],
  [UserWorkspace.Language.SCALA]: ['scala'],
  [UserWorkspace.Language.TYPESCRIPT]: ['ts', 'tsx'],
}
