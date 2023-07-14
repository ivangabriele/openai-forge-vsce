import { type ExtensionContext, workspace, commands } from 'vscode'

import { addOrRemoveCurrentDocument } from './commands/addOrRemoveCurrentDocument'
import { sendCurrentDocument } from './commands/sendCurrentDocumentOrStack'
import { stateManager } from './libs/stateManager'
import { handleError } from './utils/handleError'
import { startWebSocketServer } from './utils/startWebSocketServer'
import { updateStackStatusBarItem } from './utils/updateStackStatusBarItem'
import { updateStateStatusBarItem } from './utils/updateStateStatusBarItem'

export async function activate(context: ExtensionContext) {
  try {
    // -------------------------------------------------------------------------
    // Are we in a workspace?

    if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0) {
      return
    }

    // -------------------------------------------------------------------------
    // Status Bar Items

    updateStateStatusBarItem()
    updateStackStatusBarItem()

    // -------------------------------------------------------------------------
    // WebSocket Server

    startWebSocketServer()

    // -------------------------------------------------------------------------
    // Commands

    const addOrRemoveCurrentDocumentDisposable = commands.registerCommand(
      'extension.openai-forge.addOrRemoveCurrentDocument',
      addOrRemoveCurrentDocument,
    )
    const sendCurrentDocumentDisposable = commands.registerCommand('extension.openai-forge.sendCurrentDocument', () => {
      stateManager.clients.forEach(sendCurrentDocument)
    })

    context.subscriptions.push(addOrRemoveCurrentDocumentDisposable)
    context.subscriptions.push(sendCurrentDocumentDisposable)
  } catch (err) {
    handleError(err)
  }
}

export function deactivate() {}
