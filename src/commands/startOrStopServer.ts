import { server } from '../libs/Server'

export function startOrStopServer() {
  if (server.isStarted) {
    server.stop()
  } else {
    server.start()
  }
}
