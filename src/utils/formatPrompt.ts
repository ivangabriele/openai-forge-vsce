import type { DocumentInfo } from '../libs/DocumentInfo'
import type { WorkspaceInfo } from '../types'

type FormatPromptOptions = {
  errorOutput?: string
  userMessage?: string | undefined
  workspaceInfo?: WorkspaceInfo | undefined
}

export async function formatPrompt(
  documentInfos: DocumentInfo[],
  { errorOutput, userMessage, workspaceInfo }: FormatPromptOptions = {},
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
          ...(workspaceInfo.frameworks.length ? [`- Frameworks: ${workspaceInfo.frameworks.join(', ')}`] : []),
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
    .concat(errorOutput ? ['', 'Errors:', '```', errorOutput, '```'] : [])
    .concat(userMessage ? ['', userMessage] : [])
    .join('\n')
}
