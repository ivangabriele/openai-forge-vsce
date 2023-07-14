import { window, type StatusBarItem, StatusBarAlignment } from 'vscode'
import { stackManager } from '../libs/stackManager'

let STACK_STATUS_BAR_ITEM: StatusBarItem

export function updateStackStatusBarItem() {
  if (!STACK_STATUS_BAR_ITEM) {
    STACK_STATUS_BAR_ITEM = window.createStatusBarItem(StatusBarAlignment.Left, 2)

    STACK_STATUS_BAR_ITEM.show()
  }

  STACK_STATUS_BAR_ITEM.text = `$(list-unordered) ${stackManager.documentInfos.length || 'No'} document${
    stackManager.documentInfos.length > 1 ? 's' : ''
  } selected`
}
