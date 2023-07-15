import { workspace } from 'vscode'

import { DocumentInfo } from '../libs/DocumentInfo'
import { stackManager } from '../libs/stackManager'
import { WebSocketDataAction, type WebSocketData } from '../types'
import { formatPrompt } from '../utils/formatPrompt'
import { getCurrentWorkspaceInfo } from '../utils/getCurrentWorkspaceInfo'

import type { WebSocket } from 'ws'

export async function sendCurrentDocument(webSocket: WebSocket) {
  const excludeProjectInfo = workspace.getConfiguration('openai-forge').get<boolean>('promt.excludeProjectInfo')

  const currentWorkspaceInfo = !excludeProjectInfo ? await getCurrentWorkspaceInfo() : undefined
  const currentOrStackDocumentInfos = stackManager.documentInfos.length
    ? stackManager.documentInfos
    : [new DocumentInfo()]

  const message = await formatPrompt(currentWorkspaceInfo, currentOrStackDocumentInfos)

  const webSocketData: WebSocketData = {
    action: WebSocketDataAction.ASK,
    message,
  }

  webSocket.send(JSON.stringify(webSocketData))
}
