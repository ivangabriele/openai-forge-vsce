import { ProgressLocation, window } from 'vscode'

import { DocumentInfo } from '../libs/DocumentInfo'
import { stackManager } from '../libs/stackManager'
import { WebSocketDataAction, type WebSocketData } from '../types'
import { getChatGptPrompt } from '../utils/getChatGptPrompt'
import { getUserSetting } from '../utils/getUserSetting'
import { getUserWorkspaceInfo } from '../utils/getUserWorkspaceInfo'

import type { WebSocket } from 'ws'

export async function sendCurrentDocument(webSocket: WebSocket) {
  await window.withProgress(
    {
      location: ProgressLocation.Notification,
    },
    async progress => {
      progress.report({ message: 'OpenAI Forge: Detecting current project Technology Stack...' })

      const excludeProjectInfo = getUserSetting('prompt', 'excludeProjectInfo') || false
      const currentWorkspaceInfo = !excludeProjectInfo ? await getUserWorkspaceInfo() : undefined
      const currentOrStackDocumentInfos = stackManager.documentInfos.length
        ? stackManager.documentInfos
        : [new DocumentInfo()]

      progress.report({ message: 'OpenAI Forge: Waiting for your prompt (or not)...' })

      const maybeUserMessage = await window.showInputBox({
        placeHolder: 'Just press enter to skip',
        prompt: 'Do you want to add a message to the prompt?',
      })
      const userMessage = maybeUserMessage && maybeUserMessage.trim().length > 0 ? maybeUserMessage : undefined

      progress.report({ message: 'OpenAI Forge: Sending source code & errors to ChatGPT...' })

      const message = await getChatGptPrompt(currentOrStackDocumentInfos, {
        userMessage,
        workspaceInfo: currentWorkspaceInfo,
      })
      const webSocketData: WebSocketData = {
        action: WebSocketDataAction.ASK,
        message,
      }

      webSocket.send(JSON.stringify(webSocketData))
    },
  )
}
