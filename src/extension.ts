import { type ExtensionContext, workspace, commands } from 'vscode'

import { addOrRemoveCurrentDocument } from './commands/addOrRemoveCurrentDocument'
import { evaluateAndSendCurrentDocumentOrStack } from './commands/evaluateAndSendCurrentDocumentOrStack'
import { sendCurrentDocument } from './commands/sendCurrentDocumentOrStack'
import { server } from './libs/server'
import { stackManager } from './libs/stackManager'
import { stateManager } from './libs/stateManager'
import { handleError } from './utils/handleError'
import { updateStateStatusBarItem } from './utils/updateStateStatusBarItem'

export async function activate(context: ExtensionContext) {
  try {
    // -------------------------------------------------------------------------
    // Are we in a workspace?

    if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0) {
      return
    }

    // -------------------------------------------------------------------------
    // Commands

    const addOrRemoveCurrentDocumentDisposable = commands.registerCommand(
      'openai-forge.addOrRemoveCurrentDocument',
      addOrRemoveCurrentDocument,
    )
    const evaluateAndSendCurrentDocumentOrStackDisposable = commands.registerCommand(
      'openai-forge.evaluateAndSendCurrentDocumentOrStack',
      () => {
        stateManager.clients.forEach(evaluateAndSendCurrentDocumentOrStack)
      },
    )
    const sendCurrentDocumentDisposable = commands.registerCommand('openai-forge.sendCurrentDocument', () => {
      stateManager.clients.forEach(sendCurrentDocument)
    })

    context.subscriptions.push(addOrRemoveCurrentDocumentDisposable)
    context.subscriptions.push(evaluateAndSendCurrentDocumentOrStackDisposable)
    context.subscriptions.push(sendCurrentDocumentDisposable)

    // -------------------------------------------------------------------------
    // Status Bar Items

    updateStateStatusBarItem()
    stackManager.updateStatusBarItem()

    // -------------------------------------------------------------------------
    // WebSocket Server

    server.start()
  } catch (err) {
    handleError(err)

    server.stop()
    stackManager.updateStatusBarItem(true)
  }
}

export function deactivate() {
  server.stop()
}
