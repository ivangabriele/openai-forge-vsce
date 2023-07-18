import { join } from 'path'
import { type ExtensionContext, workspace, commands, window, ViewColumn } from 'vscode'

import { addOrRemoveCurrentDocument } from './commands/addOrRemoveCurrentDocument'
import { evaluateAndSendCurrentDocumentOrStack } from './commands/evaluateAndSendCurrentDocumentOrStack'
import { sendCurrentDocument } from './commands/sendCurrentDocumentOrStack'
import { DocumentationPath } from './constants'
import { handleError } from './helpers/handleError'
import { initializeGlobalStateManager } from './libs/GlobalStateManager'
import { server } from './libs/server'
import { stackManager } from './libs/stackManager'
import { stateManager } from './libs/stateManager'
import { getUserWorkspaceRootPath } from './utils/getUserWorkspaceRootPath'
import { showDocumentation } from './utils/showDocumentation'

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

    // -------------------------------------------------------------------------
    // Welcome Documentation

    await showDocumentation(DocumentationPath.WELCOME)

    const workspaceSettingsPath = join(getUserWorkspaceRootPath(), '.vscode', 'settings.json')
    const settingsDocument = await workspace.openTextDocument(workspaceSettingsPath)
    await window.showTextDocument(settingsDocument, ViewColumn.Two)

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
  } catch (err) {
    handleError(err)

    stackManager.hideStatusBarItem()
    server.stop()
  }
}

export function deactivate() {
  server.stop()
}
