import { globby } from 'globby'
import { dirname, sep } from 'path'

import { IGNORED_DIRECTORY_GLOBS } from '../constants'
import { type WorkspaceEvaluator } from '../types'

const PACKAGE_MANAGER_GLOBS = ['Cargo.toml'].map(directory => `**/${directory}`)

function sortPathByDepth(a: string, b: string) {
  const aDepth = a.split(sep).length
  const bDepth = b.split(sep).length

  return aDepth - bDepth
}

export async function getWorkspaceEvaluators(workspacePath: string): Promise<WorkspaceEvaluator[]> {
  const absolutePaths = await globby([...PACKAGE_MANAGER_GLOBS, ...IGNORED_DIRECTORY_GLOBS], {
    absolute: true,
    cwd: workspacePath,
    gitignore: true,
  })

  const absolutePathsSortedByDepth = absolutePaths.sort(sortPathByDepth)

  const evaluators: WorkspaceEvaluator[] = absolutePathsSortedByDepth.reduce((previousEvaluators, absolutePath) => {
    if (
      absolutePath.endsWith(`${sep}Cargo.toml`) &&
      !previousEvaluators.find(evaluator => evaluator.command.includes('cargo run'))
    ) {
      return [
        ...previousEvaluators,
        {
          command: 'cargo',
          commandArgs: ['run'],
          extensions: ['.rs'],
          extraExtensions: ['.toml'],
          workingDirectoryPath: dirname(absolutePath),
        },
      ]
    }

    return previousEvaluators
  }, [] as WorkspaceEvaluator[])

  return evaluators
}
