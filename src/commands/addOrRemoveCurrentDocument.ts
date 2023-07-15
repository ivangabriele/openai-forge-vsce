import { DocumentInfo } from '../libs/DocumentInfo'
import { stackManager } from '../libs/stackManager'
import { getCurrentDocumentPath } from '../utils/getCurrentDocumentPath'

type AddOrRemoveCurrentDocumentArgs = {
  absolutePath: string
}

export function addOrRemoveCurrentDocument(args?: AddOrRemoveCurrentDocumentArgs) {
  const currentDocumentAbsolutePath = args ? args.absolutePath : getCurrentDocumentPath()

  const isCurrentDocumentSelected = stackManager.documentInfos.some(
    ({ absolutePath }) => absolutePath === currentDocumentAbsolutePath,
  )

  if (!isCurrentDocumentSelected) {
    const currentDocumentInfo = new DocumentInfo()

    stackManager.documentInfos = [...stackManager.documentInfos, currentDocumentInfo]
  } else {
    stackManager.documentInfos = stackManager.documentInfos.filter(
      ({ absolutePath }) => absolutePath !== currentDocumentAbsolutePath,
    )
  }
}
