import { window, type OutputChannel } from 'vscode'

export enum LogLevel {
  ERROR = 'ERROR',
  INFO = 'INFO',
  WARNING = 'WARNING',
}

const LOG_LEVELS: string[] = Object.values(LogLevel)

function parseLogArgs(dataOrLevel: any, maybeLevel: LogLevel | undefined): [LogLevel, string | undefined] {
  if (typeof dataOrLevel === 'string' && LOG_LEVELS.includes(dataOrLevel)) {
    return [dataOrLevel as LogLevel, undefined]
  }

  if (maybeLevel !== undefined && maybeLevel) {
    return [maybeLevel, JSON.stringify(dataOrLevel)]
  }

  return [LogLevel.INFO, undefined]
}

class Logger {
  #outputChannel: OutputChannel

  constructor() {
    this.#outputChannel = window.createOutputChannel('OpenAI Forge')
  }

  log(message: string): void
  log(message: string, level: LogLevel): void
  log(message: string, data: any): void
  log(message: string, data: any, level: LogLevel): void
  log(message: string, dataOrLevel?: any, maybeLevel?: LogLevel): void {
    const [level, dataAsString] = parseLogArgs(dataOrLevel, maybeLevel)

    this.#outputChannel.appendLine(`[${level}] ${message}`)
    if (dataAsString) {
      this.#outputChannel.appendLine(`⮡ ${JSON.stringify(dataAsString)}`)
    }
  }
}

export const logger = new Logger()
