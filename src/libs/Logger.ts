/* eslint-disable no-console */

import { window, type OutputChannel } from 'vscode'

export enum LogLevel {
  ERROR = 'ERROR',
  INFO = 'INFO',
  WARNING = 'WARNING',
}

const LOG_LEVELS: string[] = Object.values(LogLevel)

function parseLogArgs(dataOrLevel: any, maybeLevel: LogLevel | undefined): [LogLevel, string | undefined, any] {
  if (typeof dataOrLevel === 'string' && LOG_LEVELS.includes(dataOrLevel)) {
    return [dataOrLevel as LogLevel, undefined, undefined]
  }

  if (maybeLevel !== undefined && maybeLevel) {
    return [maybeLevel, JSON.stringify(dataOrLevel), dataOrLevel]
  }

  return [LogLevel.INFO, undefined, undefined]
}

class Logger {
  #isDevelopment: boolean = false
  #outputChannel: OutputChannel

  constructor() {
    this.#outputChannel = window.createOutputChannel('OpenAI Forge')
  }

  set isDevelopment(isDevelopment: boolean) {
    this.#isDevelopment = isDevelopment
  }

  debug(...args: any[]): void {
    if (!this.#isDevelopment) {
      return
    }

    console.debug(...args)
  }

  log(message: string): void
  log(message: string, level: LogLevel): void
  log(message: string, data: any): void
  log(message: string, data: any, level: LogLevel): void
  log(message: string, dataOrLevel?: any, maybeLevel?: LogLevel): void {
    const [level, dataAsString, data] = parseLogArgs(dataOrLevel, maybeLevel)

    console.debug(`[${level}] ${message}`)
    this.#outputChannel.appendLine(`[${level}] ${message}`)
    if (dataAsString) {
      console.debug(data)
      this.#outputChannel.appendLine(`⮡ ${JSON.stringify(dataAsString)}`)
    }
  }
}

export const logger = new Logger()
