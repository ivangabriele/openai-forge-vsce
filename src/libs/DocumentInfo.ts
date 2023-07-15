import path, { extname } from 'path'
import { Uri, window, workspace } from 'vscode'

import { InternalError } from './InternalError'
import { UserError } from './UserError'
import { getWorkspaceRootPath } from '../utils/getWorkspaceRootPath'

export class DocumentInfo {
  #absolutePath: string
  #extension: string
  #relativePath: string
  #workspaceRootPath: string

  constructor() {
    const editor = window.activeTextEditor
    if (!editor) {
      throw new UserError('No active text editor.')
    }

    const workspaceRootPath = getWorkspaceRootPath()

    this.#absolutePath = editor.document.uri.fsPath
    this.#extension = extname(this.#absolutePath)
    this.#relativePath = path.relative(workspaceRootPath, this.#absolutePath)
    this.#workspaceRootPath = workspaceRootPath
  }

  get absolutePath(): string {
    return this.#absolutePath
  }

  set absolutePath(newAbsolutePath: string) {
    this.#absolutePath = newAbsolutePath
    this.#extension = extname(newAbsolutePath)
    this.#relativePath = path.relative(this.#workspaceRootPath, newAbsolutePath)
  }

  get extension(): string {
    return this.#extension
  }

  get relativePath(): string {
    return this.#relativePath
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
