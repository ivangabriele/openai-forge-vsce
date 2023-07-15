import { globby } from 'globby'
import { ascend, identity } from 'ramda'

import { IGNORED_DIRECTORY_GLOBS } from '../constants'
import { ProjectLanguage } from '../types'

export const PROJECT_LANGUAGE_TO_EXTENSIONS_MAP: Record<ProjectLanguage, string[]> = {
  [ProjectLanguage.C_SHARP]: ['cs'],
  [ProjectLanguage.DART]: ['dart'],
  [ProjectLanguage.ELIXIR]: ['ex', 'exs'],
  [ProjectLanguage.GO]: ['go'],
  [ProjectLanguage.HASKELL]: ['hs', 'lhs'],
  [ProjectLanguage.JAVA]: ['java', 'jsp', 'jspx'],
  [ProjectLanguage.JAVASCRIPT]: ['cjs', 'js', 'jsx', 'mjs'],
  [ProjectLanguage.KOTLIN]: ['kt', 'kts'],
  [ProjectLanguage.PHP]: ['php', 'php3', 'php4', 'php5', 'php7', 'phtml'],
  [ProjectLanguage.PYTHON]: ['py', 'pyi', 'pyw'],
  [ProjectLanguage.RUBY]: ['rb'],
  [ProjectLanguage.RUST]: ['rs'],
  [ProjectLanguage.SCALA]: ['scala'],
  [ProjectLanguage.TYPESCRIPT]: ['ts', 'tsx'],
}

const PROJECT_LANGUAGE_EXTENSIONS_AS_STRING = Object.values(PROJECT_LANGUAGE_TO_EXTENSIONS_MAP).flat().join(',')

export async function getSourceCodeDocumentPaths(workspacePath: string): Promise<string[]> {
  const paths = await globby([`**/*.{${PROJECT_LANGUAGE_EXTENSIONS_AS_STRING}}`, ...IGNORED_DIRECTORY_GLOBS], {
    cwd: workspacePath,
    gitignore: true,
  })
  const sortedPaths = paths.sort(ascend(identity))

  return sortedPaths
}