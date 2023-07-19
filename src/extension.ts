import { type ExtensionContext, workspace, commands, ExtensionMode } from 'vscode'

import { addOrRemoveCurrentDocument } from './commands/addOrRemoveCurrentDocument'
import { evaluateAndSendCurrentDocumentOrStack } from './commands/evaluateAndSendCurrentDocumentOrStack'
import { sendCurrentDocument } from './commands/sendCurrentDocumentOrStack'
import { welcome } from './commands/welcome'
import { handleError } from './helpers/handleError'
import { getGlobalStateManager, initializeGlobalStateManager } from './libs/GlobalStateManager'
import { server } from './libs/server'
import { stackManager } from './libs/stackManager'
import { stateManager } from './libs/stateManager'

export async function activate(context: ExtensionContext) {
  try {
    // -------------------------------------------------------------------------
    // Are we in a workspace?

    if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0) {
      return
    }

    // -------------------------------------------------------------------------
    // Global State

    await initializeGlobalStateManager(context)
    if (context.extensionMode === ExtensionMode.Development) {
      await getGlobalStateManager().clear()
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

    stackManager.updateStatusBarItem()
    stateManager.updateStatusBarItem()

    // -------------------------------------------------------------------------
    // WebSocket Server

    server.start(context)

    // -------------------------------------------------------------------------
    // Welcome Documentation

    await welcome()
  } catch (err) {
    handleError(err)

    stackManager.hideStatusBarItem()
    server.stop()
  }
}

export function deactivate() {
  server.stop()
}
