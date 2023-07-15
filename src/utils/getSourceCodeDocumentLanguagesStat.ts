import { basename, extname } from 'path'
import { countBy, identity, map, mapObjIndexed, sum } from 'ramda'

import { PROJECT_LANGUAGE_TO_EXTENSIONS_MAP } from './getSourceCodeDocumentPaths'

import type { ProjectLanguage } from '../types'

export type SourceCodeDocumentLanguagesStat = {
  count: Record<ProjectLanguage, number>
  ratio: Record<ProjectLanguage, number>
}

export function getSourceCodeDocumentLanguagesStat(sourceCodeDocumentPaths: string[]): SourceCodeDocumentLanguagesStat {
  const sourceCodeDocumentExtensions: string[] = sourceCodeDocumentPaths.map(sourceCodeDocumentPath =>
    extname(basename(sourceCodeDocumentPath))
      // Remove the leading dot
      .slice(1),
  )

  const sourceCodeDocumentExtensionsCount: Record<string, number> = countBy(identity, sourceCodeDocumentExtensions)

  const sourceCodeDocumentLanguagesCount = mapObjIndexed((languageExtensions: string[]): number => {
    const languageExtensionsCounts = sum(
      map(extension => sourceCodeDocumentExtensionsCount[extension] || 0, languageExtensions),
    )

    return languageExtensionsCounts
  }, PROJECT_LANGUAGE_TO_EXTENSIONS_MAP)

  const sourceCodeDocumentPathsLength = sourceCodeDocumentPaths.length
  const sourceCodeDocumentLanguagesRatio = mapObjIndexed(
    (languageCount: number): number => languageCount / sourceCodeDocumentPathsLength,
    sourceCodeDocumentLanguagesCount,
  )

  return {
    count: sourceCodeDocumentLanguagesCount,
    ratio: sourceCodeDocumentLanguagesRatio,
  }
}
