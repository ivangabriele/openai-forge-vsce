import { window, type StatusBarItem, StatusBarAlignment } from 'vscode'

import { InternalError } from './InternalError'
import { State } from '../types'

import type { WebSocket } from 'ws'

export const STATE_ICON: Record<State, string> = {
  [State.FAILED]: 'error',
  [State.RUNNING]: 'radio-tower',
  [State.STARTING]: 'gear-spin',
  [State.STOPPED]: 'circle-slash',
  [State.STOPPING]: 'gear-spin',
}

export const STATE_LABEL: Record<State, string> = {
  [State.FAILED]: 'Failed to start',
  [State.RUNNING]: '',
  [State.STARTING]: 'Starting...',
  [State.STOPPED]: 'Stopped',
  [State.STOPPING]: 'Stopping...',
}

class StateManager {
  clients: Set<WebSocket> = new Set<WebSocket>()
  #state: State = State.STARTING
  #errorMessage: string | undefined = undefined
  #statusBarItem: StatusBarItem

  constructor() {
    this.#statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 1)
    this.#statusBarItem.show()
  }

  set errorMessage(errorMessage: string) {
    this.#errorMessage = errorMessage
    this.#state = State.FAILED

    this.updateStatusBarItem()
  }

  get state(): State {
    return this.#state
  }

  set state(state: State) {
    this.#errorMessage = undefined
    this.#state = state

    this.updateStatusBarItem()
  }

  updateStatusBarItem(): void {
    switch (stateManager.state) {
      case State.FAILED:
        this.#statusBarItem.text = `$(${STATE_ICON[stateManager.state]}) OAIF Server: ${
          this.#errorMessage || STATE_LABEL.FAILED
        }`
        break

      case State.RUNNING:
        this.#statusBarItem.text = `$(${STATE_ICON[stateManager.state]}) OAIF Server: ${
          stateManager.clients.size || 'No'
        } client${stateManager.clients.size > 1 ? 's' : ''}`
        break

      case State.STARTING:
      case State.STOPPED:
      case State.STOPPING:
        this.#statusBarItem.text = `$(${STATE_ICON[stateManager.state]}) OAIF Server: ${
          STATE_LABEL[stateManager.state]
        }`
        break

      default:
        throw new InternalError(`Unknown state: ${stateManager.state}.`)
    }
  }
}

export const stateManager = new StateManager()
