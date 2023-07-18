import { execa } from 'execa'
import { relative, sep } from 'path'
import { intersection } from 'ramda'
import { ProgressLocation, window } from 'vscode'

import { getUserWorkspaceRootPath } from './getUserWorkspaceRootPath'

import type { DocumentInfo } from '../libs/DocumentInfo'
import type { UserWorkspace } from '../types'

export async function runEvaluator(
  documentInfos: DocumentInfo[],
  evaluators: UserWorkspace.Evaluator[],
): Promise<string | undefined> {
  return window.withProgress<string | undefined>(
    {
      location: ProgressLocation.Notification,
    },
    async progress => {
      const documentExtensions = documentInfos.map(documentInfo => documentInfo.extension)
      const workspaceRootPath = getUserWorkspaceRootPath()

      // eslint-disable-next-line no-restricted-syntax
      for (const evaluator of evaluators) {
        if (!intersection(evaluator.extensions, documentExtensions).length) {
          // eslint-disable-next-line no-continue
          continue
        }

        progress.report({
          message: `Running \`${evaluator.command} ${evaluator.commandArgs.join(' ')}\` in .${sep}${relative(
            workspaceRootPath,
            evaluator.workingDirectoryAbsolutePath,
          )}`,
        })
        // eslint-disable-next-line no-await-in-loop
        const { stderr } = await execa(evaluator.command, evaluator.commandArgs, {
          cwd: evaluator.workingDirectoryAbsolutePath,
          reject: false,
        })

        if (!stderr.trim().length) {
          return Promise.resolve(undefined)
        }

        return Promise.resolve(stderr)
      }

      return Promise.resolve(undefined)
    },
  )
}
