import { window, type StatusBarItem, StatusBarAlignment } from 'vscode'

import { STATE_ICON, STATE_LABEL } from '../constants'
import { InternalError } from '../libs/InternalError'
import { stateManager } from '../libs/stateManager'
import { State } from '../types'

let STATE_STATUS_BAR_ITEM: StatusBarItem

export function updateStateStatusBarItem() {
  if (!STATE_STATUS_BAR_ITEM) {
    STATE_STATUS_BAR_ITEM = window.createStatusBarItem(StatusBarAlignment.Left, 1)

    STATE_STATUS_BAR_ITEM.show()
  }

  switch (stateManager.state) {
    case State.RUNNING:
      STATE_STATUS_BAR_ITEM.text = `$(${STATE_ICON[stateManager.state]}) ${stateManager.clients.size || 'No'} client${
        stateManager.clients.size > 1 ? 's' : ''
      }`
      break

    case State.STARTING:
    case State.STOPPED:
    case State.STOPPING:
      STATE_STATUS_BAR_ITEM.text = `$(${STATE_ICON[stateManager.state]}) ${STATE_LABEL[stateManager.state]}`
      break

    default:
      throw new InternalError(`Unknown state: ${stateManager.state}.`)
  }
}
