import { WebSocketServer } from 'ws'

import { InternalError } from './InternalError'
import { stateManager } from './stateManager'
import { State } from '../types'
import { updateStateStatusBarItem } from '../utils/updateStateStatusBarItem'

class Server {
  #webSocketServer: WebSocketServer | undefined

  start() {
    try {
      if (this.#webSocketServer) {
        return
      }

      this.#webSocketServer = new WebSocketServer({ port: 4242 })

      this.#webSocketServer.on('connection', webSocket => {
        stateManager.clients.add(webSocket)
        updateStateStatusBarItem()

        // webSocket.on('message', message => {
        //   console.debug(`New message received: ${message}.`)
        // })

        webSocket.on('close', () => {
          stateManager.clients.delete(webSocket)
          updateStateStatusBarItem()
        })
      })

      stateManager.state = State.RUNNING
      updateStateStatusBarItem()
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
        updateStateStatusBarItem()
      })
    } catch (err) {
      throw new InternalError('WebSocket server failed to stop.', err)
    }
  }
}

export const server = new Server()
