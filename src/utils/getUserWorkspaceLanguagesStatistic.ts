import { basename, extname } from 'path'
import { countBy, identity, map, mapObjIndexed, sum } from 'ramda'

import { USER_WORKSPACE_LANGUAGE_TO_EXTENSIONS_MAP } from '../constants'
import { type UserWorkspace } from '../types'

export function getUserWorkspaceLanguagesStatistic(
  sourceCodeDocumentPaths: string[],
): UserWorkspace.LanguagesStatistic {
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
  }, USER_WORKSPACE_LANGUAGE_TO_EXTENSIONS_MAP)

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
