import { intersection } from 'ramda'

import type { DocumentInfo } from '../libs/DocumentInfo'
import type { UserWorkspace } from '../types'

function countMatchingExtensions(evaluator: UserWorkspace.Evaluator, documentExtensions: string[]): number {
  return intersection(evaluator.extensions, documentExtensions).length
}

export function getTopEvaluator(
  documentInfos: DocumentInfo[],
  evaluators: UserWorkspace.Evaluator[],
): UserWorkspace.Evaluator | undefined {
  const documentExtensions = documentInfos.map(documentInfo => documentInfo.extension)

  // Sort evaluators by the count of matching extensions in descending order
  const sortedEvaluators = evaluators.sort(
    (a, b) => countMatchingExtensions(b, documentExtensions) - countMatchingExtensions(a, documentExtensions),
  )

  // Return the first evaluator with matching extensions or null if none found
  const topEvaluator = sortedEvaluators.find(evaluator => countMatchingExtensions(evaluator, documentExtensions) > 0)

  return topEvaluator
}
