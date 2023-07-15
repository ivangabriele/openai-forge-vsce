import { descend, filter, map, prop, sort, toPairs } from 'ramda'

import { type SourceCodeDocumentLanguagesStat } from './getSourceCodeDocumentLanguagesStat'

import type { ProjectLanguage } from '../types'

const SIGNIFICANT_RATIO = 0.05
const SIGNIFICANT_COUNT = 100

export function getSourceCodeDocumentMainLanguages({
  count: sourceCodeDocumentLanguagesCount,
  ratio: sourceCodeDocumentLanguagesRatio,
}: SourceCodeDocumentLanguagesStat): ProjectLanguage[] {
  const sourceCodeDocumentLanguagesStats = map(
    ([language, count]) => ({
      count,
      language: language as ProjectLanguage,
      ratio: sourceCodeDocumentLanguagesRatio[language],
    }),
    toPairs(sourceCodeDocumentLanguagesCount),
  )

  const sourceCodeDocumentMainLanguagesStats = filter(
    ({ count, ratio }) => count > SIGNIFICANT_COUNT || ratio > SIGNIFICANT_RATIO,
    sourceCodeDocumentLanguagesStats,
  )

  const sortedSourceCodeDocumentMainLanguagesStats = sort(descend(prop('ratio')), sourceCodeDocumentMainLanguagesStats)

  const mainLanguages = sortedSourceCodeDocumentMainLanguagesStats.map(({ language }) => language)

  return mainLanguages
}
