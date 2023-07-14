import { WebSocketServer } from 'ws'

import { updateStateStatusBarItem } from './updateStateStatusBarItem'
import { stateManager } from '../libs/stateManager'
import { State } from '../types'

let WEB_SOCKET_SERVER: WebSocketServer

export function startWebSocketServer() {
  if (!WEB_SOCKET_SERVER) {
    WEB_SOCKET_SERVER = new WebSocketServer({ port: 4242 })

    WEB_SOCKET_SERVER.on('connection', webSocket => {
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
  }
}
