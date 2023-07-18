import { type ExtensionContext, type Memento } from 'vscode'

import { InternalError } from './InternalError'

export enum GlobalStateKey {
  EXTENSION__ROOT_PATH = 'EXTENSION__ROOT_PATH',
  NOTIFICATION__HIDE_SERVER_PORT_IN_USE_ERROR = 'NOTIFICATION__HIDE_SERVER_PORT_IN_USE_ERROR',
}

type GlobalState = {
  [GlobalStateKey.EXTENSION__ROOT_PATH]: string
  [GlobalStateKey.NOTIFICATION__HIDE_SERVER_PORT_IN_USE_ERROR]: boolean
}

let globalStateManager: GlobalStateManager | undefined

class GlobalStateManager {
  #globalState: Memento

  constructor(extensionContext: ExtensionContext) {
    this.#globalState = extensionContext.globalState
  }

  async get<T extends GlobalStateKey>(key: T): Promise<GlobalState[T] | undefined> {
    return this.#globalState.get(key)
  }

  async set<T extends GlobalStateKey>(key: T, value: GlobalState[T]): Promise<void> {
    await this.#globalState.update(key, value)
  }
}

export async function initializeGlobalStateManager(extensionContext: ExtensionContext): Promise<void> {
  globalStateManager = new GlobalStateManager(extensionContext)

  await globalStateManager.set(GlobalStateKey.EXTENSION__ROOT_PATH, extensionContext.extensionUri.fsPath)
}

export function getGlobalStateManager(): GlobalStateManager {
  if (!globalStateManager) {
    throw new InternalError('`globalStateManager` is undefined.')
  }

  return globalStateManager
}
