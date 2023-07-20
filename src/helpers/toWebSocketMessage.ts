import type { Communication } from '../types'

export function toWebSocketMessage(message: Communication.Message): string {
  return JSON.stringify(message)
}
