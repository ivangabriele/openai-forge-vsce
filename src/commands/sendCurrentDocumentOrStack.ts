import { WebSocketDataAction, type WebSocketData } from '../types'
import { formatPrompt } from '../utils/formatPrompt'
import { getCurrentDocumentInfo } from '../utils/getCurrentDocumentInfo'
import { getCurrentWorkspaceInfo } from '../utils/getCurrentWorkspaceInfo'

import type { WebSocket } from 'ws'

export function sendCurrentDocument(webSocket: WebSocket) {
  const currentDocumentInfo = getCurrentDocumentInfo()
  const currentWorkspaceInfo = getCurrentWorkspaceInfo()

  const promptMessage = formatPrompt(currentWorkspaceInfo, [currentDocumentInfo])

  const webSocketData: WebSocketData = {
    action: WebSocketDataAction.ASK,
    message: promptMessage,
  }

  webSocket.send(JSON.stringify(webSocketData))
}
