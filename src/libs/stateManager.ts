import type { WebSocket } from 'ws'
import { State } from '../types'

class StateManager {
  clients: Set<WebSocket> = new Set<WebSocket>()
  #state: State = State.STARTING

  get state(): State {
    return this.#state
  }

  set state(state: State) {
    this.#state = state
  }
}

export const stateManager = new StateManager()
