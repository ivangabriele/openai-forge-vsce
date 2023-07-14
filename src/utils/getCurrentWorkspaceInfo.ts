import { getWorkspaceRootPath } from './getWorkspaceRootPath'

import type { WorkspaceInfo } from '../types'

export function getCurrentWorkspaceInfo(): WorkspaceInfo {
  const rootPath = getWorkspaceRootPath()

  return {
    languages: [],
    mainFramework: undefined,
    name: '',
    subFrameworks: [],
    rootPath,
  }
}
