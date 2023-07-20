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
  'RESTARTING' = 'RESTARTING',
  'RUNNING' = 'RUNNING',
  'STARTING' = 'STARTING',
  'STOPPED' = 'STOPPED',
  'STOPPING' = 'STOPPING',
  'WILL_RESTART' = 'WILL_RESTART',
}

export { Communication } from './Communication'
export { type UserSettings } from './UserSettings'
export { UserWorkspace } from './UserWorkspace'
