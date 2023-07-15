import type { DocumentInfo } from './DocumentInfo'

class StackManager {
  #documentInfos: DocumentInfo[] = []

  get documentInfos(): DocumentInfo[] {
    return this.#documentInfos
  }

  set documentInfos(documentInfos: DocumentInfo[]) {
    this.#documentInfos = documentInfos
  }
}

export const stackManager = new StackManager()
