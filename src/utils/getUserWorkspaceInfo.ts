import { getUserWorkspaceFrameworks } from './getUserWorkspaceFrameworks'
import { getUserWorkspaceLanguagesStatistic } from './getUserWorkspaceLanguagesStatistic'
import { getSourceCodeDocumentMainLanguages } from './getUserWorkspaceMainLanguages'
import { getUserWorkspaceName } from './getUserWorkspaceName'
import { getUserWorkspaceRootPath } from './getUserWorkspaceRootPath'
import { getUserWorkspaceSourceCodePaths } from './getUserWorkspaceSourceCodePaths'
import { UserError } from '../libs/UserError'
import { type UserWorkspace } from '../types'

let WORKSPACE_INFO: UserWorkspace.Info | undefined

export async function getUserWorkspaceInfo(mustRefresh: boolean = false): Promise<UserWorkspace.Info> {
  if (!WORKSPACE_INFO || WORKSPACE_INFO.sourceCodeDocumentsLength < 10 || mustRefresh) {
    const rootPath = getUserWorkspaceRootPath()

    const name = getUserWorkspaceName(rootPath)

    const sourceCodeDocumentPaths = await getUserWorkspaceSourceCodePaths(rootPath)
    const sourceCodeDocumentLanguageStats = getUserWorkspaceLanguagesStatistic(sourceCodeDocumentPaths)
    const languages = getSourceCodeDocumentMainLanguages(sourceCodeDocumentLanguageStats)
    if (!languages.length) {
      throw new UserError("OpenAI Forge couldn't detect any of the supported languages for this workspace.")
    }

    const frameworks = await getUserWorkspaceFrameworks(rootPath, sourceCodeDocumentPaths)

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
