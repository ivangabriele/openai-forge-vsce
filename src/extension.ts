import { type ExtensionContext, workspace, commands, ExtensionMode } from 'vscode'

import { addOrRemoveCurrentDocument } from './commands/addOrRemoveCurrentDocument'
import { evaluateAndSendCurrentDocumentOrStack } from './commands/evaluateAndSendCurrentDocumentOrStack'
import { sendCurrentDocument } from './commands/sendCurrentDocumentOrStack'
import { startOrStopServer } from './commands/startOrStopServer'
import { welcome } from './commands/welcome'
import { handleError } from './helpers/handleError'
import { getGlobalStateManager, initializeGlobalStateManager } from './libs/GlobalStateManager'
import { logger } from './libs/Logger'
import { server } from './libs/Server'
import { stackManager } from './libs/StackManager'
import { stateManager } from './libs/StateManager'

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
      logger.isDevelopment = true
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
      evaluateAndSendCurrentDocumentOrStack,
    )
    const sendCurrentDocumentDisposable = commands.registerCommand(
      'openai-forge.sendCurrentDocument',
      sendCurrentDocument,
    )
    const startOrStopServerDisposable = commands.registerCommand('openai-forge.startOrStopServer', startOrStopServer)

    context.subscriptions.push(addOrRemoveCurrentDocumentDisposable)
    context.subscriptions.push(evaluateAndSendCurrentDocumentOrStackDisposable)
    context.subscriptions.push(sendCurrentDocumentDisposable)
    context.subscriptions.push(startOrStopServerDisposable)

    // -------------------------------------------------------------------------
    // Status Bar Items

    stackManager.updateStatusBarItem()
    stateManager.updateStatusBarItem()

    // -------------------------------------------------------------------------
    // WebSocket Server

    server.start()

    // -------------------------------------------------------------------------
    // Welcome Documentation

    await welcome()
  } catch (err) {
    handleError(err)

    stackManager.hideStatusBarItem()
    server.stop()
  }
}

export async function deactivate() {
  await server.stop()
}
