import { extname, normalize, relative } from 'path'
import { Uri, workspace } from 'vscode'

import { InternalError } from './InternalError'
import { getCurrentDocumentPath } from '../utils/getCurrentDocumentPath'
import { getUserWorkspaceRootPath } from '../utils/getUserWorkspaceRootPath'

export class DocumentInfo {
  #absolutePath: string
  #extension: string
  #relativePath: string
  #workspaceRootPath: string

  constructor(abosultePath?: string) {
    const workspaceRootPath = getUserWorkspaceRootPath()

    this.#absolutePath = abosultePath ? normalize(abosultePath) : getCurrentDocumentPath()
    this.#extension = extname(this.#absolutePath)
    this.#relativePath = relative(workspaceRootPath, this.#absolutePath)
    this.#workspaceRootPath = workspaceRootPath
  }

  get absolutePath(): string {
    return this.#absolutePath
  }

  set absolutePath(newAbsolutePath: string) {
    this.#absolutePath = newAbsolutePath
    this.#extension = extname(newAbsolutePath)
    this.#relativePath = relative(this.#workspaceRootPath, newAbsolutePath)
  }

  get extension(): string {
    return this.#extension
  }

  get relativePath(): string {
    return this.#relativePath
  }

  get workspaceRootPath(): string {
    return this.#workspaceRootPath
  }

  async getSource(): Promise<string> {
    try {
      const textDocument = await workspace.openTextDocument(Uri.file(this.absolutePath))

      return textDocument.getText()
    } catch (err) {
      throw new InternalError(`Error reading document: ${this.absolutePath}`, err)
    }
  }
}
