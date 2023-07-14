import { type ExtensionContext, workspace, commands } from 'vscode'
import { type WebSocket, WebSocketServer } from 'ws'

import { fake } from './commands/fake'
import { sendCurrentDocument } from './commands/sendCurrentDocumentOrStack'
import { handleError } from './utils/handleError'
import { updateStackStatusBarItem } from './utils/updateStackStatusBarItem'
import { updateStateStatusBarItem } from './utils/updateStateStatusBarItem'
import { addOrRemoveCurrentDocument } from './commands/addOrRemoveCurrentDocument'
import { stateManager } from './libs/stateManager'
import { State } from './types'

const WEB_SOCKET_CLIENTS = new Set<WebSocket>()

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

    const webSockerServer = new WebSocketServer({ port: 4242 })

    webSockerServer.on('connection', webSocket => {
      stateManager.clients.add(webSocket)
      updateStateStatusBarItem()

      webSocket.on('message', message => {
        console.debug(`New message received: ${message}.`)
      })

      webSocket.on('close', () => {
        stateManager.clients.delete(webSocket)
        updateStateStatusBarItem()
      })
    })

    stateManager.state = State.RUNNING
    updateStateStatusBarItem()

    // -------------------------------------------------------------------------
    // Commands

    const addOrRemoveCurrentDocumentDisposable = commands.registerCommand(
      'extension.openai-forge.addOrRemoveCurrentDocument',
      addOrRemoveCurrentDocument,
    )
    const fakeDisposable = commands.registerCommand('extension.openai-forge.fake', fake)
    const sendCurrentDocumentDisposable = commands.registerCommand('extension.openai-forge.sendCurrentDocument', () => {
      for (const webSocketClient of WEB_SOCKET_CLIENTS) {
        sendCurrentDocument(webSocketClient)
      }
    })

    context.subscriptions.push(addOrRemoveCurrentDocumentDisposable)
    context.subscriptions.push(fakeDisposable)
    context.subscriptions.push(sendCurrentDocumentDisposable)
  } catch (err) {
    handleError(err)
  }
}

export function deactivate() {}
