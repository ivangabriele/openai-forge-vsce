import type { DocumentInfo } from '../libs/DocumentInfo'
import type { WorkspaceInfo } from '../types'

export async function formatPrompt(
  workspaceInfo: WorkspaceInfo | undefined,
  documentInfos: DocumentInfo[],
): Promise<string> {
  const documents = await Promise.all(
    documentInfos.map(async documentInfo => ({
      relativePath: documentInfo.relativePath,
      source: await documentInfo.getSource(),
    })),
  )

  return (
    workspaceInfo
      ? [
          `Project:`,
          `- Name: ${workspaceInfo.name}`,
          ...(workspaceInfo.frameworks.length ? [`- Framework: ${workspaceInfo.frameworks.join(', ')}`] : []),
          `- Languages: ${workspaceInfo.languages.join(', ')}`,
          '',
        ]
      : []
  )
    .concat(
      documents.reduce(
        (lines, document, index) => [
          ...lines,
          ...(index > 0 ? [''] : []),
          `${document.relativePath}:`,
          '```',
          document.source,
          '```',
        ],
        [] as string[],
      ),
    )
    .join('\n')
}
