import { ascend, prop } from 'ramda'
import { window, type StatusBarItem, StatusBarAlignment, MarkdownString } from 'vscode'

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
  STACK_STATUS_BAR_ITEM.tooltip = stackManager.documentInfos.length
    ? new MarkdownString(
        [
          '**Selected documents:**',
          ...stackManager.documentInfos
            .sort(ascend(prop('relativePath')))
            .map(documentInfo => `- ${documentInfo.relativePath}`),
        ].join('\n'),
      )
    : undefined
}
