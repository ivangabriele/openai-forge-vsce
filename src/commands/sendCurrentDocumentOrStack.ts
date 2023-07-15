import { window, workspace } from 'vscode'

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

  const maybeUserMessage = await window.showInputBox({
    placeHolder: 'Just press enter to skip',
    prompt: 'Do you want to add a message to the prompt?',
  })
  const userMessage = maybeUserMessage && maybeUserMessage.trim().length > 0 ? maybeUserMessage : undefined

  const message = await formatPrompt(currentOrStackDocumentInfos, {
    userMessage,
    workspaceInfo: currentWorkspaceInfo,
  })

  const webSocketData: WebSocketData = {
    action: WebSocketDataAction.ASK,
    message,
  }

  webSocket.send(JSON.stringify(webSocketData))
}