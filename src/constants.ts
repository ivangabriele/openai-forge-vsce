import { State } from './types'

export const IGNORED_DIRECTORY_GLOBS = [
  '.git',
  '.github',
  '.idea',
  '.vscode',
  '.yarn',
  '__pycache__',
  'build',
  'dist',
  'node_modules',
  'target',
  'vendor',
].map(directory => `!**/${directory}/**`)

export const STATE_ICON: Record<State, string> = {
  [State.FAILED]: 'error',
  [State.RUNNING]: 'radio-tower',
  [State.STARTING]: 'gear-spin',
  [State.STOPPED]: 'circle-slash',
  [State.STOPPING]: 'gear-spin',
}

export const STATE_LABEL: Record<State, string> = {
  [State.FAILED]: 'Failed',
  [State.RUNNING]: '',
  [State.STARTING]: 'Starting...',
  [State.STOPPED]: 'Stopped',
  [State.STOPPING]: 'Stopping...',
}
