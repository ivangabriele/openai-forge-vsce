import { ProgressLocation, window } from 'vscode'

import { DocumentInfo } from '../libs/DocumentInfo'
import { stackManager } from '../libs/stackManager'
import { WebSocketDataAction, type WebSocketData } from '../types'
import { getChatGptPrompt } from '../utils/getChatGptPrompt'
import { getUserSetting } from '../utils/getUserSetting'
import { getUserWorkspaceEvaluators } from '../utils/getUserWorkspaceEvaluators'
import { getUserWorkspaceInfo } from '../utils/getUserWorkspaceInfo'
import { runEvaluator } from '../utils/runEvaluator'

import type { WebSocket } from 'ws'

export async function evaluateAndSendCurrentDocumentOrStack(webSocket: WebSocket) {
  await window.withProgress(
    {
      location: ProgressLocation.Notification,
    },
    async progress => {
      progress.report({ message: 'OpenAI Forge: Detecting current project Technology Stack...' })

      const workspaceInfo = await getUserWorkspaceInfo()
      const evaluators = await getUserWorkspaceEvaluators(workspaceInfo.rootPath)

      progress.report({ message: 'OpenAI Forge: Evaluating code to check for errors...' })

      const currentOrStackDocumentInfos = stackManager.documentInfos.length
        ? stackManager.documentInfos
        : [new DocumentInfo()]

      const errorOutput = await runEvaluator(currentOrStackDocumentInfos, evaluators)
      if (!errorOutput) {
        window.showWarningMessage('OpenAI Forge: No error output to send. Aborted.')

        return
      }

      progress.report({ message: 'OpenAI Forge: Sending source code & errors to ChatGPT...' })

      const excludeProjectInfo = getUserSetting('prompt', 'excludeProjectInfo') || false
      const message = await getChatGptPrompt(currentOrStackDocumentInfos, {
        errorOutput,
        workspaceInfo: !excludeProjectInfo ? workspaceInfo : undefined,
      })
      const webSocketData: WebSocketData = {
        action: WebSocketDataAction.ASK,
        message,
      }

      webSocket.send(JSON.stringify(webSocketData))
    },
  )
}
