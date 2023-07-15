import { promises as fs } from 'fs'
import { any, filter, keys } from 'ramda'

import { ProjectFramework } from '../types'

// Each criteria is a function that takes a list of paths and returns a boolean.
type ProjectFrameworkMatcher = (paths: string[]) => boolean

const isReactProject: ProjectFrameworkMatcher = any<string>(path => /\.(j|t)sx$/.test(path))
const isNextProject: ProjectFrameworkMatcher = any<string>(path => /(^|\/).next(\/|$)/.test(path))
const isTauriProject: ProjectFrameworkMatcher = any<string>(path => /(^|\/)src-tauri(\/|$)/.test(path))

// A map of ProjectFrameworks to their corresponding criteria.
const PROJECT_FRAMEWORK_MATCHER_MATCH: Record<ProjectFramework, ProjectFrameworkMatcher> = {
  [ProjectFramework.REACT]: isReactProject,
  [ProjectFramework.NEXT_JS]: isNextProject,
  [ProjectFramework.TAURI]: isTauriProject,
}

export async function getProjectFrameworks(
  workspacePath: string,
  sourceCodeDocumentPaths: string[],
): Promise<ProjectFramework[]> {
  const rootPaths = await fs.readdir(workspacePath)
  const sourceCodeDocumentRelativePaths = sourceCodeDocumentPaths.map(path => path.replace(`${workspacePath}/`, ''))
  const allPaths = [...rootPaths, ...sourceCodeDocumentRelativePaths]

  const projectFrameworks = filter(
    (framework: ProjectFramework) => PROJECT_FRAMEWORK_MATCHER_MATCH[framework](allPaths),
    keys(PROJECT_FRAMEWORK_MATCHER_MATCH),
  )

  return projectFrameworks
}
