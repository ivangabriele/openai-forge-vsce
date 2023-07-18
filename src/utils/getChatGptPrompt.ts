import { type DocumentInfo } from '../libs/DocumentInfo'
import { type UserWorkspace } from '../types'

type FormatPromptOptions = {
  errorOutput?: string
  userMessage?: string | undefined
  workspaceInfo?: UserWorkspace.Info | undefined
}

export async function getChatGptPrompt(
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
