import { stackManager } from '../libs/stackManager'
import { getCurrentDocumentInfo } from '../utils/getCurrentDocumentInfo'
import { updateStackStatusBarItem } from '../utils/updateStackStatusBarItem'

export function addOrRemoveCurrentDocument() {
  const currentDocumentInfo = getCurrentDocumentInfo()

  const isCurrentDocumentSelected = stackManager.documentInfos.some(
    ({ absolutePath }) => absolutePath === currentDocumentInfo.absolutePath,
  )

  if (!isCurrentDocumentSelected) {
    stackManager.documentInfos = [...stackManager.documentInfos, currentDocumentInfo]
  } else {
    stackManager.documentInfos = stackManager.documentInfos.filter(
      ({ absolutePath }) => absolutePath !== currentDocumentInfo.absolutePath,
    )
  }

  updateStackStatusBarItem()
}
