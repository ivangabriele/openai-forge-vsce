import { execa } from 'execa'
import { intersection } from 'ramda'

import type { DocumentInfo } from '../libs/DocumentInfo'
import type { WorkspaceInfo } from '../types'

export async function runEvaluator(
  documentInfos: DocumentInfo[],
  workspaceInfo: WorkspaceInfo,
): Promise<string | undefined> {
  const documentExtensions = documentInfos.map(documentInfo => documentInfo.extension)

  // eslint-disable-next-line no-restricted-syntax
  for (const evaluator of workspaceInfo.evaluators) {
    if (!intersection(evaluator.extensions, documentExtensions).length) {
      // eslint-disable-next-line no-continue
      continue
    }

    // eslint-disable-next-line no-await-in-loop
    const { stderr } = await execa(evaluator.command, evaluator.commandArgs, {
      cwd: evaluator.workingDirectoryPath,
      reject: false,
    })

    if (!stderr.trim().length) {
      return undefined
    }

    return stderr
  }

  return undefined
}
