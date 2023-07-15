import { ascend, prop } from 'ramda'
import { window, type StatusBarItem, StatusBarAlignment, MarkdownString, ThemeColor } from 'vscode'

import { stackManager } from '../libs/stackManager'

let STACK_STATUS_BAR_ITEM: StatusBarItem | undefined

export function updateStackStatusBarItem(isFailure: boolean = false) {
  if (!STACK_STATUS_BAR_ITEM) {
    STACK_STATUS_BAR_ITEM = window.createStatusBarItem(StatusBarAlignment.Left, 1)

    STACK_STATUS_BAR_ITEM.show()
  }

  if (isFailure) {
    STACK_STATUS_BAR_ITEM.color = new ThemeColor('statusBarItem.errorForeground')
    STACK_STATUS_BAR_ITEM.text = '$(x) OpenAI Forge failed to run.'

    return
  }

  STACK_STATUS_BAR_ITEM.color = undefined
  STACK_STATUS_BAR_ITEM.text = `$(list-unordered) ${stackManager.documentInfos.length || 'No'} document${
    stackManager.documentInfos.length > 1 ? 's' : ''
  } selected`
  STACK_STATUS_BAR_ITEM.tooltip = new MarkdownString(
    stackManager.documentInfos.length
      ? [
          '| Document | |',
          '| - | - |',
          ...stackManager.documentInfos.sort(ascend(prop('relativePath'))).map(
            documentInfo =>
              `| [${documentInfo.relativePath}](command:openai-forge.addOrRemoveCurrentDocument?${encodeURIComponent(
                JSON.stringify({
                  absolutePath: documentInfo.absolutePath,
                }),
              )}) | [$(eye)](${documentInfo.absolutePath}) | `,
          ),
        ].join('\n')
      : 'No document',
    true,
  )
  STACK_STATUS_BAR_ITEM.tooltip.isTrusted = true
  STACK_STATUS_BAR_ITEM.tooltip.supportHtml = true
}
