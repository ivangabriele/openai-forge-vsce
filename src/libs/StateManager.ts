import { window, type StatusBarItem, StatusBarAlignment } from 'vscode'

import { InternalError } from './InternalError'
import { State } from '../types'

export const STATE_ICON: Record<State, string> = {
  [State.FAILED]: 'error',
  [State.RESTARTING]: 'gear-spin',
  [State.RUNNING]: '',
  [State.STARTING]: 'gear-spin',
  [State.STOPPED]: 'circle-slash',
  [State.STOPPING]: 'gear-spin',
  [State.WILL_RESTART]: 'debug-disconnect',
}

export const STATE_LABEL: Record<State, string> = {
  [State.FAILED]: 'Failed to start',
  [State.RESTARTING]: 'Restarting...',
  [State.RUNNING]: '',
  [State.STARTING]: 'Starting...',
  [State.STOPPED]: 'Stopped',
  [State.STOPPING]: 'Stopping...',
  [State.WILL_RESTART]: 'Restarting in 5s...',
}

class StateManager {
  #clientsCount: number = 0
  #isSatellite: boolean = false
  #state: State = State.STARTING
  #errorMessage: string | undefined = undefined
  #statusBarItem: StatusBarItem

  constructor() {
    this.#statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 1)
    this.#statusBarItem.show()
  }

  set clientCount(clientsCount: number) {
    this.#clientsCount = clientsCount

    this.updateStatusBarItem()
  }

  set errorMessage(errorMessage: string) {
    this.#errorMessage = errorMessage
    this.#state = State.FAILED

    this.updateStatusBarItem()
  }

  set isSatellite(isSatellite: boolean) {
    this.#isSatellite = isSatellite

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
    const label = this.#isSatellite ? 'OAIF Satellite' : 'OAIF Server'

    switch (stateManager.state) {
      case State.FAILED:
        this.#statusBarItem.text = `$(${STATE_ICON[stateManager.state]}) ${label}: ${
          this.#errorMessage || STATE_LABEL.FAILED
        }`
        break

      case State.RUNNING:
        this.#statusBarItem.text = `$(${this.#isSatellite ? 'rss' : 'radio-tower'}) ${label}: ${
          this.#clientsCount || 'No'
        } client${this.#clientsCount > 1 ? 's' : ''}`
        break

      case State.STARTING:
      case State.STOPPING:
        this.#statusBarItem.text = `$(${STATE_ICON[stateManager.state]}) ${label}: ${STATE_LABEL[stateManager.state]}`
        break

      case State.RESTARTING:
      case State.STOPPED:
      case State.WILL_RESTART:
        this.#statusBarItem.text = `$(${STATE_ICON[stateManager.state]}) OAIF: ${STATE_LABEL[stateManager.state]}`
        break

      default:
        throw new InternalError(`Unknown state: ${stateManager.state}.`)
    }
  }
}

export const stateManager = new StateManager()
