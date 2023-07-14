import { workspace } from 'vscode'

import type { DocumentInfo, WorkspaceInfo } from '../types'

export function formatPrompt(workspaceInfo: WorkspaceInfo, documentInfos: DocumentInfo[]): string {
  const excludeProjectInfo = workspace.getConfiguration('openai-forge').get<boolean>('promt.excludeProjectInfo')

  return (
    !excludeProjectInfo
      ? [
          `Project:`,
          `- Name: ${workspaceInfo.name}`,
          ...(workspaceInfo.mainFramework
            ? [`- Framework: ${workspaceInfo.mainFramework}, ${workspaceInfo.subFrameworks.join(', ')}`]
            : []),
          `- Languages: ${workspaceInfo.languages.join(', ')}`,
          '',
        ]
      : []
  )
    .concat(
      documentInfos.reduce(
        (lines, documentInfo, index) => [
          ...lines,
          ...(index > 0 ? [''] : []),
          `${documentInfo.relativePath}:`,
          '```',
          documentInfo.source,
          '```',
        ],
        [] as string[],
      ),
    )
    .join('\n')
}
