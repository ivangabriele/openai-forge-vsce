import { promises as fs } from 'fs'
import { any, filter, keys } from 'ramda'

import { UserWorkspace } from '../types'

type ProjectFrameworkMatcher = (paths: string[]) => boolean

const isReactProject: ProjectFrameworkMatcher = any<string>(path => /\.(j|t)sx$/.test(path))
const isNextProject: ProjectFrameworkMatcher = any<string>(path => /(^|\/).next(\/|$)/.test(path))
const isTauriProject: ProjectFrameworkMatcher = any<string>(path => /(^|\/)src-tauri(\/|$)/.test(path))

const PROJECT_FRAMEWORK_MATCHER_MATCH: Record<UserWorkspace.Framework, ProjectFrameworkMatcher> = {
  [UserWorkspace.Framework.REACT]: isReactProject,
  [UserWorkspace.Framework.NEXT_JS]: isNextProject,
  [UserWorkspace.Framework.TAURI]: isTauriProject,
}

export async function getUserWorkspaceFrameworks(
  workspacePath: string,
  sourceCodeDocumentPaths: string[],
): Promise<UserWorkspace.Framework[]> {
  const rootPaths = await fs.readdir(workspacePath)
  const sourceCodeDocumentRelativePaths = sourceCodeDocumentPaths.map(path => path.replace(`${workspacePath}/`, ''))
  const allPaths = [...rootPaths, ...sourceCodeDocumentRelativePaths]

  const projectFrameworks = filter(
    (framework: UserWorkspace.Framework) => PROJECT_FRAMEWORK_MATCHER_MATCH[framework](allPaths),
    keys(PROJECT_FRAMEWORK_MATCHER_MATCH),
  )

  return projectFrameworks
}
