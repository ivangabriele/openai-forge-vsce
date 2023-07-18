import { globby } from 'globby'
import { ascend, identity } from 'ramda'

import { IGNORED_DIRECTORY_GLOBS, USER_WORKSPACE_LANGUAGE_TO_EXTENSIONS_MAP } from '../constants'

const PROJECT_LANGUAGE_EXTENSIONS_AS_STRING = Object.values(USER_WORKSPACE_LANGUAGE_TO_EXTENSIONS_MAP).flat().join(',')

export async function getUserWorkspaceSourceCodePaths(workspacePath: string): Promise<string[]> {
  const paths = await globby([`**/*.{${PROJECT_LANGUAGE_EXTENSIONS_AS_STRING}}`, ...IGNORED_DIRECTORY_GLOBS], {
    cwd: workspacePath,
    gitignore: true,
  })
  const sortedPaths = paths.sort(ascend(identity))

  return sortedPaths
}
