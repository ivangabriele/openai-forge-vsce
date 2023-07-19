import { window, type ExtensionContext } from 'vscode'
import { WebSocketServer } from 'ws'

import { GlobalStateKey, getGlobalStateManager } from './GlobalStateManager'
import { InternalError } from './InternalError'
import { stackManager } from './stackManager'
import { stateManager } from './stateManager'
import { NotificationAction } from '../constants'
import { State } from '../types'

class Server {
  #webSocketServer: WebSocketServer | undefined

  start(context: ExtensionContext) {
    try {
      if (this.#webSocketServer) {
        return
      }

      this.#webSocketServer = new WebSocketServer({ port: 4242 })

      this.#webSocketServer.on('connection', webSocket => {
        stateManager.clients.add(webSocket)

        // webSocket.on('message', message => {
        //   console.debug(`New message received: ${message}.`)
        // })

        webSocket.on('close', () => {
          stateManager.clients.delete(webSocket)
        })
      })

      this.#webSocketServer.on('error', async error => {
        stateManager.state = State.FAILED

        if ((error as any).code === 'EADDRINUSE') {
          const isNotificationHidden = await getGlobalStateManager().get(
            GlobalStateKey.NOTIFICATION__HIDE_SERVER_PORT_IN_USE_ERROR,
          )

          stackManager.hideStatusBarItem()
          stateManager.errorMessage = 'Port 4242 is already in use'

          context.subscriptions.forEach(disposable => disposable.dispose())

          if (!isNotificationHidden) {
            const answer = await window.showErrorMessage(
              [
                'OpenAI Forge: Handling multiple Visual Studio Code instances is not yet supported.',
                'Only the first Visual Studio Code instance will be able to communicate with ChatGPT.',
                'You can close other instances and reload this instance from the command palette:',
                '"Developer: Reload Window".',
                // 'You can close other instances and restart it from the command palette:',
                // '"OpenAI Forge: Restart WebSocket Server".',
              ].join(' '),
              // NotificationAction.SHOW_HELP,
              NotificationAction.NEVER_SHOW_AGAIN,
            )

            if (answer === NotificationAction.NEVER_SHOW_AGAIN) {
              await getGlobalStateManager().set(GlobalStateKey.NOTIFICATION__HIDE_SERVER_PORT_IN_USE_ERROR, true)
            }
          }

          return
        }

        throw new InternalError(`WebSocket started with an unknow error: \`${(error as any).code}\`.`, error)
      })

      stateManager.state = State.RUNNING
    } catch (err) {
      throw new InternalError('WebSocket server failed to start.', err)
    }
  }

  stop() {
    try {
      if (!this.#webSocketServer) {
        return
      }

      this.#webSocketServer.close(err => {
        if (err) {
          throw new InternalError('WebSocket server failed to stop.', err)
        }

        this.#webSocketServer = undefined
        stateManager.state = State.STOPPED
      })
    } catch (err) {
      throw new InternalError('WebSocket server failed to stop.', err)
    }
  }
}

export const server = new Server()
