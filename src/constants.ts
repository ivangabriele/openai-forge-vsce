import { State } from './types'

export const STATE_ICON: Record<State, string> = {
  [State.RUNNING]: 'radio-tower',
  [State.STARTING]: 'gear-spin',
  [State.STOPPED]: 'circle-slash',
  [State.STOPPING]: 'gear-spin',
}

export const STATE_LABEL: Record<State, string> = {
  [State.RUNNING]: '',
  [State.STARTING]: 'Starting...',
  [State.STOPPED]: 'Stopped',
  [State.STOPPING]: 'Stopping...',
}
