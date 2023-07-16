import { execa } from 'execa'
import { relative, sep } from 'path'
import { intersection } from 'ramda'
import { ProgressLocation, window } from 'vscode'

import type { DocumentInfo } from '../libs/DocumentInfo'
import type { WorkspaceInfo } from '../types'

export async function runEvaluator(
  documentInfos: DocumentInfo[],
  workspaceInfo: WorkspaceInfo,
): Promise<string | undefined> {
  return window.withProgress<string | undefined>(
    {
      location: ProgressLocation.Notification,
    },
    async progress => {
      const documentExtensions = documentInfos.map(documentInfo => documentInfo.extension)

      // eslint-disable-next-line no-restricted-syntax
      for (const evaluator of workspaceInfo.evaluators) {
        if (!intersection(evaluator.extensions, documentExtensions).length) {
          // eslint-disable-next-line no-continue
          continue
        }

        progress.report({
          message: `Running \`${evaluator.command} ${evaluator.commandArgs.join(' ')}\` in .${sep}${relative(
            workspaceInfo.rootPath,
            evaluator.workingDirectoryPath,
          )}`,
        })
        // eslint-disable-next-line no-await-in-loop
        const { stderr } = await execa(evaluator.command, evaluator.commandArgs, {
          cwd: evaluator.workingDirectoryPath,
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
