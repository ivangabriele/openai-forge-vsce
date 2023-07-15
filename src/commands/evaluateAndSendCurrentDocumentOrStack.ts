import { window, workspace } from 'vscode'

import { DocumentInfo } from '../libs/DocumentInfo'
import { stackManager } from '../libs/stackManager'
import { WebSocketDataAction, type WebSocketData } from '../types'
import { formatPrompt } from '../utils/formatPrompt'
import { getCurrentWorkspaceInfo } from '../utils/getCurrentWorkspaceInfo'
import { runEvaluator } from '../utils/runEvaluator'

import type { WebSocket } from 'ws'

export async function evaluateAndSendCurrentDocumentOrStack(webSocket: WebSocket) {
  const excludeProjectInfo = workspace.getConfiguration('openai-forge').get<boolean>('promt.excludeProjectInfo')

  const currentWorkspaceInfo = await getCurrentWorkspaceInfo()
  const currentOrStackDocumentInfos = stackManager.documentInfos.length
    ? stackManager.documentInfos
    : [new DocumentInfo()]

  const errorOutput = await runEvaluator(currentOrStackDocumentInfos, currentWorkspaceInfo)
  if (!errorOutput) {
    window.showWarningMessage('OpenAI Forge: No error output to send. Aborting.')

    return
  }

  const message = await formatPrompt(currentOrStackDocumentInfos, {
    errorOutput,
    workspaceInfo: !excludeProjectInfo ? currentWorkspaceInfo : undefined,
  })

  const webSocketData: WebSocketData = {
    action: WebSocketDataAction.ASK,
    message,
  }

  webSocket.send(JSON.stringify(webSocketData))
}
