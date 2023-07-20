import { type MessageEvent, type RawData } from 'ws'

import { type Communication } from '../types'

export function fromWebSocketMessage(rawDataOrMessageEvent: RawData | MessageEvent): Communication.Message {
  const message: Communication.Message = JSON.parse(rawDataOrMessageEvent.toString())

  return message
}
