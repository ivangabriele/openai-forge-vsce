import { window } from 'vscode'

import { DocumentInfo } from '../libs/DocumentInfo'
import { stackManager } from '../libs/stackManager'
import { getCurrentDocumentPath } from '../utils/getCurrentDocumentPath'

type AddOrRemoveCurrentDocumentArgs = {
  absolutePath: string
}

export function addOrRemoveCurrentDocument(args?: AddOrRemoveCurrentDocumentArgs) {
  const currentDocumentAbsolutePath = args ? args.absolutePath : getCurrentDocumentPath()

  const maybeExistingDocumentMatch = stackManager.documentInfos.find(
    ({ absolutePath }) => absolutePath === currentDocumentAbsolutePath,
  )

  if (!maybeExistingDocumentMatch) {
    const currentDocumentInfo = new DocumentInfo()

    stackManager.documentInfos = [...stackManager.documentInfos, currentDocumentInfo]

    window.showInformationMessage(`OpenAI Forge: ${currentDocumentInfo.relativePath} unselected.`)
  } else {
    stackManager.documentInfos = stackManager.documentInfos.filter(
      ({ absolutePath }) => absolutePath !== currentDocumentAbsolutePath,
    )

    window.showInformationMessage(`OpenAI Forge: ${maybeExistingDocumentMatch.relativePath} selected.`)
  }
}
