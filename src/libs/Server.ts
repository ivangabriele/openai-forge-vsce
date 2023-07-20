import cuid from 'cuid'
import { dissoc } from 'ramda'
import { WebSocket, WebSocketServer, type RawData } from 'ws'

import { InternalError } from './InternalError'
import { logger } from './Logger'
import { stateManager } from './StateManager'
import { UserError } from './UserError'
import { fromWebSocketMessage } from '../helpers/fromWebSocketMessage'
import { toWebSocketMessage } from '../helpers/toWebSocketMessage'
import { waitFor } from '../helpers/waitFor'
import { Communication, State } from '../types'

class Server {
  #clients: Record<string, WebSocket> = {}
  // @ts-ignore
  #id: string | undefined
  #isStarted: boolean = false
  #wasManualStop: boolean = false
  #satellites: Record<string, WebSocket> = {}
  #webSocketServer: WebSocketServer | undefined = undefined
  #webSocketServerAsClient: WebSocket | undefined = undefined

  get #clientsCount(): number {
    return Object.entries(this.#clients).length
  }

  get #satelitesCount(): number {
    return Object.entries(this.#satellites).length
  }

  get isStarted(): boolean {
    return this.#isStarted
  }

  send(message: { action: Communication.MessageAction.ASK; message: string }) {
    logger.debug('Server.send()', { message })

    if (!this.#isStarted) {
      throw new UserError(
        [
          'OAIF Server/Satellite is stopped.',
          'You can start it again from the command palette: "OpenAI Forge: Start/Stop OAIF Server/Satellite".',
        ].join(' '),
      )
    }

    if (this.#webSocketServer) {
      Object.values(this.#clients).forEach(client => client.send(toWebSocketMessage(message)))
    } else if (this.#webSocketServerAsClient) {
      this.#webSocketServerAsClient.send(
        toWebSocketMessage({
          $id: this.#id,
          action: Communication.MessageAction.CONVEY,
          value: message,
        }),
      )
    } else {
      throw new InternalError('Both `this.#webSocketServer` and `this.#webSocketServerAsClient` are undefined.')
    }
  }

  start(isClient: boolean = false) {
    logger.debug('Server.start()', { isClient })

    if (stateManager.state !== State.RESTARTING) {
      stateManager.state = State.STARTING
    }

    try {
      if (!isClient) {
        this.#webSocketServer = new WebSocketServer({ port: 4242 })

        this.#webSocketServer.on('connection', this.#handleServerConnection.bind(this))
        this.#webSocketServer.on('error', this.#handleServerError.bind(this))

        stateManager.isSatellite = false
      } else {
        this.#webSocketServerAsClient = new WebSocket('ws://localhost:4242')

        this.#webSocketServerAsClient.on('close', this.#handleSatelliteClose.bind(this))
        this.#webSocketServerAsClient.on('error', this.#handleSatelliteError.bind(this))
        this.#webSocketServerAsClient.on('message', this.#handleSatelliteMessage.bind(this))
        this.#webSocketServerAsClient.on('open', this.#handleSatelliteOpen.bind(this))

        stateManager.isSatellite = true
      }

      this.#isStarted = true

      stateManager.state = State.RUNNING
    } catch (err) {
      throw new InternalError('WebSocket server failed to start.', err)
    }
  }

  async stop() {
    logger.debug('Server.stop()')

    try {
      if (this.#webSocketServer) {
        stateManager.state = State.STOPPING

        Object.values(this.#clients).forEach(client => client.close())
        Object.values(this.#satellites).forEach(client => client.close())

        await this.#waitForClientsAndSatellitesToCloseAndStop()
      } else if (this.#webSocketServerAsClient) {
        this.#wasManualStop = true

        this.#webSocketServerAsClient.close()
      } else {
        throw new InternalError('Both `this.#webSocketServer` and `this.#webSocketServerAsClient` are undefined.')
      }
    } catch (err) {
      throw new InternalError('WebSocket server failed to stop.', err)
    }
  }

  #handleSatelliteClose(error: Error) {
    logger.debug('Server.#handleSatelliteError()', error)
    logger.log('Soft WebSocket Server-as-Client error.', error)

    this.#reset()

    if (this.#wasManualStop) {
      this.#wasManualStop = false

      stateManager.state = State.STOPPED

      return
    }

    stateManager.state = State.WILL_RESTART

    setTimeout(() => {
      stateManager.state = State.RESTARTING

      this.start()
    }, 5000)
  }

  // eslint-disable-next-line class-methods-use-this
  #handleSatelliteError(error: Error) {
    logger.debug('Server.#handleSatelliteError()', { error })

    this.#reset()

    stateManager.state = State.FAILED

    throw new InternalError(`WebSocket Client received an unknow error: \`${(error as any).code}\`.`, error)
  }

  #handleSatelliteMessage(rawData: RawData) {
    logger.debug('Server.#handleSatelliteMessage()', { rawData })

    const message = fromWebSocketMessage(rawData)

    if (message.action === Communication.MessageAction.ORDER) {
      if (message.message === Communication.MessageMessage.SET_CLIENTS_COUNT) {
        this.#updateClientsCount(message.value)

        return
      }

      if (message.message === Communication.MessageMessage.SET_ID) {
        this.#id = message.value

        return
      }
    }

    throw new InternalError(`WebSocket server-as-client received an unknow message ("${JSON.stringify(message)}").`)
  }

  #handleSatelliteOpen() {
    logger.debug('Server.#handleSatelliteOpen()')

    if (!this.#webSocketServerAsClient) {
      throw new InternalError('WebSocket server-as-client failed to start.')
    }

    this.#webSocketServerAsClient.send(
      toWebSocketMessage({
        action: Communication.MessageAction.DECLARE,
        message: Communication.MessageMessage.AS_SATELLITE,
      }),
    )
  }

  #handleServerConnection(webSocket: WebSocket) {
    logger.debug('Server.#handleServerConnection()')

    const clientId = cuid()

    this.#clients = {
      ...this.#clients,
      [clientId]: webSocket,
    }

    this.#updateClientsCount()

    webSocket.on('message', rawData => {
      const message = fromWebSocketMessage(rawData)

      if (message.action === Communication.MessageAction.CONVEY) {
        this.send(message.value)

        return
      }

      if (message.action === Communication.MessageAction.DECLARE) {
        if (message.message === Communication.MessageMessage.AS_SATELLITE) {
          if (this.#clients[clientId]) {
            this.#clients = dissoc(clientId, this.#clients)
          } else {
            throw new InternalError(`WebSocket client with id \`${clientId}\` doesn't exist.`)
          }

          this.#clients = dissoc(clientId, this.#clients)
          this.#satellites = {
            ...this.#satellites,
            [clientId]: webSocket,
          }

          this.#updateClientsCount()

          return
        }
      }

      throw new InternalError(`WebSocket server received an unknow message ("${JSON.stringify(message)}").`)
    })

    webSocket.on('close', () => {
      if (this.#clients[clientId]) {
        this.#clients = dissoc(clientId, this.#clients)
      } else if (this.#satellites[clientId]) {
        this.#satellites = dissoc(clientId, this.#satellites)
      } else {
        throw new InternalError(`WebSocket client or satellite with id \`${clientId}\` doesn't exist.`)
      }

      this.#updateClientsCount()
    })
  }

  #handleServerError(error: Error) {
    logger.debug('Server.#handleServerError()', { error })

    this.#reset()

    if ((error as any).code === 'EADDRINUSE') {
      this.start(true)

      return
    }

    stateManager.state = State.FAILED

    throw new InternalError(`WebSocket Server received an unknow error: \`${(error as any).code}\`.`, error)
  }

  #reset() {
    logger.debug('Server.#reset()')

    this.#clients = {}
    this.#id = undefined
    this.#isStarted = false
    this.#clients = {}
    this.#satellites = {}
    this.#webSocketServer = undefined
    this.#webSocketServerAsClient = undefined

    this.#updateClientsCount(0)
  }

  #updateClientsCount(clientsCount?: number) {
    logger.debug('Server.#updateClientsCount()', { clientsCount })

    if (!this.#webSocketServer && clientsCount === undefined) {
      throw new InternalError('Both `this.#webSocketServer` and `clientsCount` are undefined.')
    }

    const controlledClientsCount = clientsCount || this.#clientsCount

    if (this.#webSocketServer) {
      this.#webSocketServer.clients.forEach(client => {
        client.send(
          toWebSocketMessage({
            action: Communication.MessageAction.ORDER,
            message: Communication.MessageMessage.SET_CLIENTS_COUNT,
            value: controlledClientsCount,
          }),
        )
      })
    }

    stateManager.clientCount = controlledClientsCount
  }

  async #waitForClientsAndSatellitesToCloseAndStop() {
    logger.debug('Server.#updateClientsCount()')

    if (!this.#webSocketServer) {
      throw new InternalError('`this.#webSocketServer` is undefined.')
    }

    if (this.#clientsCount || this.#satelitesCount) {
      await waitFor(500)

      this.#waitForClientsAndSatellitesToCloseAndStop()

      return
    }

    this.#webSocketServer.close(error => {
      logger.debug('Server.#webSocketServer.close()', { error })

      if (error) {
        throw new InternalError('WebSocket server failed to stop.', error)
      }

      this.#reset()

      stateManager.state = State.STOPPED
    })
  }
}

export const server = new Server()
