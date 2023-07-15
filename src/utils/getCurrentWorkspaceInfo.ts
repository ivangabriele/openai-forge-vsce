import { getProjectFrameworks } from './getProjectFrameworks'
import { getProjectName } from './getProjectName'
import { getSourceCodeDocumentLanguagesStat } from './getSourceCodeDocumentLanguagesStat'
import { getSourceCodeDocumentMainLanguages } from './getSourceCodeDocumentMainLanguages'
import { getSourceCodeDocumentPaths } from './getSourceCodeDocumentPaths'
import { getWorkspaceRootPath } from './getWorkspaceRootPath'
import { UserError } from '../libs/UserError'
import { type WorkspaceInfo } from '../types'

let WORKSPACE_INFO: WorkspaceInfo | undefined

export async function getCurrentWorkspaceInfo(mustRefresh: boolean = false): Promise<WorkspaceInfo> {
  if (!WORKSPACE_INFO || WORKSPACE_INFO.sourceCodeDocumentsLength < 10 || mustRefresh) {
    const rootPath = getWorkspaceRootPath()

    const name = getProjectName(rootPath)

    const sourceCodeDocumentPaths = await getSourceCodeDocumentPaths(rootPath)
    const sourceCodeDocumentLanguageStats = getSourceCodeDocumentLanguagesStat(sourceCodeDocumentPaths)
    const languages = getSourceCodeDocumentMainLanguages(sourceCodeDocumentLanguageStats)
    if (!languages.length) {
      throw new UserError("OpenAI Forge couldn't detect any of the supported languages for this workspace.")
    }

    const frameworks = await getProjectFrameworks(rootPath, sourceCodeDocumentPaths)

    const sourceCodeDocumentsLength = sourceCodeDocumentPaths.length

    WORKSPACE_INFO = {
      frameworks,
      languages,
      name,
      rootPath,
      sourceCodeDocumentsLength,
    }
  }

  return WORKSPACE_INFO
}
