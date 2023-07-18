export enum State {
  'FAILED' = 'FAILED',
  'RUNNING' = 'RUNNING',
  'STARTING' = 'STARTING',
  'STOPPED' = 'STOPPED',
  'STOPPING' = 'STOPPING',
}

export enum WebSocketDataAction {
  ASK = 'ASK',
}

export type WebSocketData = {
  action: WebSocketDataAction
  message: string
}

export { type UserSettings } from './UserSettings'
export { UserWorkspace } from './UserWorkspace'
