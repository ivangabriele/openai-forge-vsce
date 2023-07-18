import { workspace } from 'vscode'

import { type UserSettings } from '../types'

export function getUserSetting<K extends keyof UserSettings.Settings>(key: K): UserSettings.Settings[K] | undefined
export function getUserSetting<K extends keyof UserSettings.Settings, J extends keyof UserSettings.Settings[K]>(
  key: K,
  subKey: J,
): UserSettings.Settings[K][J] | undefined
export function getUserSetting(key: string, subKey?: string): any {
  return workspace.getConfiguration('openai-forge').get(`${key}${subKey ? `.${subKey}` : ''}`)
}
