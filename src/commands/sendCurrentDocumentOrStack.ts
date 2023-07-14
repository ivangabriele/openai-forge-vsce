import { stackManager } from '../libs/stackManager'
import { WebSocketDataAction, type WebSocketData } from '../types'
import { formatPrompt } from '../utils/formatPrompt'
import { getCurrentDocumentInfo } from '../utils/getCurrentDocumentInfo'
import { getCurrentWorkspaceInfo } from '../utils/getCurrentWorkspaceInfo'

import type { WebSocket } from 'ws'

export function sendCurrentDocument(webSocket: WebSocket) {
  const currentWorkspaceInfo = getCurrentWorkspaceInfo()
  const currentOrStackDocumentInfos = stackManager.documentInfos.length
    ? stackManager.documentInfos
    : [getCurrentDocumentInfo()]

  const promptMessage = formatPrompt(currentWorkspaceInfo, currentOrStackDocumentInfos)

  const webSocketData: WebSocketData = {
    action: WebSocketDataAction.ASK,
    message: promptMessage,
  }

  webSocket.send(JSON.stringify(webSocketData))
}
