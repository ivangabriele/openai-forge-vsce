import { type ExtensionContext, workspace, commands } from 'vscode'

import { addOrRemoveCurrentDocument } from './commands/addOrRemoveCurrentDocument'
import { sendCurrentDocument } from './commands/sendCurrentDocumentOrStack'
import { server } from './libs/server'
import { stateManager } from './libs/stateManager'
import { handleError } from './utils/handleError'
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
    // Commands

    const addOrRemoveCurrentDocumentDisposable = commands.registerCommand(
      'openai-forge.addOrRemoveCurrentDocument',
      addOrRemoveCurrentDocument,
    )
    const sendCurrentDocumentDisposable = commands.registerCommand('openai-forge.sendCurrentDocument', () => {
      stateManager.clients.forEach(sendCurrentDocument)
    })

    context.subscriptions.push(addOrRemoveCurrentDocumentDisposable)
    context.subscriptions.push(sendCurrentDocumentDisposable)

    // -------------------------------------------------------------------------
    // Status Bar Items

    updateStateStatusBarItem()
    updateStackStatusBarItem()

    // -------------------------------------------------------------------------
    // WebSocket Server

    server.start()
  } catch (err) {
    handleError(err)

    server.stop()
    updateStackStatusBarItem(true)
  }
}

export function deactivate() {
  server.stop()
}
