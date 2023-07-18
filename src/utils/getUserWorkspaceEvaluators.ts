import { globby } from 'globby'
import { dirname, join, sep } from 'path'
import { equals } from 'ramda'

import { getUserSetting } from './getUserSetting'
import { IGNORED_DIRECTORY_GLOBS } from '../constants'
import { sortPathByDepth } from '../helpers/sortPathByDepth'
import { type UserWorkspace } from '../types'

const PACKAGE_MANAGER_GLOBS = ['Cargo.toml'].map(directory => `**/${directory}`)

export async function getUserWorkspaceEvaluators(workspacePath: string): Promise<UserWorkspace.Evaluator[]> {
  const absolutePaths = await globby([...PACKAGE_MANAGER_GLOBS, ...IGNORED_DIRECTORY_GLOBS], {
    absolute: true,
    cwd: workspacePath,
    gitignore: true,
  })

  const absolutePathsSortedByDepth = absolutePaths.sort(sortPathByDepth)
  const baseEvaluators: UserWorkspace.Evaluator[] = absolutePathsSortedByDepth.reduce(
    (previousEvaluators, absolutePath) =>
      absolutePath.endsWith(`${sep}Cargo.toml`) &&
      !previousEvaluators.find(
        evaluator => evaluator.command.includes('cargo') && equals(['build'], evaluator.commandArgs),
      )
        ? [
            ...previousEvaluators,
            {
              command: 'cargo',
              commandArgs: ['build'],
              extensions: ['.rs'],
              extraExtensions: ['.toml'],
              workingDirectoryAbsolutePath: dirname(absolutePath),
            },
          ]
        : previousEvaluators,
    [] as UserWorkspace.Evaluator[],
  )

  const userSettingsCustomEvaluators = getUserSetting('customEvaluators') || []
  const customEvaluators: UserWorkspace.Evaluator[] = userSettingsCustomEvaluators.map(userSettingsCustomEvaluator => ({
    ...userSettingsCustomEvaluator,
    workingDirectoryAbsolutePath: join(workspacePath, userSettingsCustomEvaluator.workingDirectoryRelativePath),
  }))

  return [...customEvaluators, ...baseEvaluators]
}
