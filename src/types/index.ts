import type { Promisable } from 'type-fest'

export enum MessageItemType {
  BUTTON = 'BUTTON',
  LINK = 'LINK',
}

export type MessageButton = {
  action: () => Promisable<void>
  label: string
  type: MessageItemType.BUTTON
}

export type MessageLink = {
  label: string
  type: MessageItemType.LINK
  url: string
}

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
