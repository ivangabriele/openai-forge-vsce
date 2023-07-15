import { adjust, ascend, prop } from 'ramda'
import {
  workspace,
  type FileSystemWatcher,
  Uri,
  type StatusBarItem,
  window,
  StatusBarAlignment,
  ThemeColor,
  MarkdownString,
} from 'vscode'

import type { DocumentInfo } from './DocumentInfo'

class StackManager {
  #documentInfos: DocumentInfo[] = []
  #fileSystemWatcher: FileSystemWatcher
  #statusBarItem: StatusBarItem

  constructor() {
    this.#statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 1)

    this.#statusBarItem.show()

    this.#fileSystemWatcher = workspace.createFileSystemWatcher('**', false, true, true)

    this.#fileSystemWatcher.onDidChange(this.#handleFileChange.bind(this))
    this.#fileSystemWatcher.onDidDelete(this.#handleFileDelete.bind(this))
  }

  get documentInfos(): DocumentInfo[] {
    return this.#documentInfos
  }

  set documentInfos(documentInfos: DocumentInfo[]) {
    this.#documentInfos = documentInfos

    this.updateStatusBarItem()
  }

  updateStatusBarItem(isFailure: boolean = false) {
    if (isFailure) {
      this.#statusBarItem.color = new ThemeColor('statusBarItem.errorForeground')
      this.#statusBarItem.text = '$(x) OpenAI Forge failed to run.'

      return
    }

    this.#statusBarItem.color = undefined
    this.#statusBarItem.text = `$(list-unordered) ${this.#documentInfos.length || 'No'} document${
      this.#documentInfos.length > 1 ? 's' : ''
    } selected`
    this.#statusBarItem.tooltip = new MarkdownString(
      this.#documentInfos.length
        ? [
            '| Document | |',
            '| - | - |',
            ...this.#documentInfos.sort(ascend(prop('relativePath'))).map(
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
    this.#statusBarItem.tooltip.isTrusted = true
    this.#statusBarItem.tooltip.supportHtml = true
  }

  #handleFileChange(uri: Uri) {
    const documentInfoIndex = this.#documentInfos.findIndex(documentInfo => documentInfo.absolutePath === uri.fsPath)
    if (documentInfoIndex === -1) {
      return
    }

    this.#documentInfos = adjust(
      documentInfoIndex,
      (documentInfo: DocumentInfo) => {
        // eslint-disable-next-line no-param-reassign
        documentInfo.absolutePath = uri.fsPath

        return documentInfo
      },
      this.#documentInfos,
    )

    this.updateStatusBarItem()
  }

  #handleFileDelete(uri: Uri) {
    this.#documentInfos = this.#documentInfos.filter(info => info.absolutePath !== uri.fsPath)

    this.updateStatusBarItem()
  }
}

export const stackManager = new StackManager()
