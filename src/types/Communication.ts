export namespace Communication {
  export enum MessageAction {
    ASK = 'ASK',
    CONVEY = 'CONVEY',
    DECLARE = 'DECLARE',
    ORDER = 'ORDER',
  }

  export enum MessageMessage {
    AS_SATELLITE = 'AS_SATELLITE',
    PASS_MESSAGE = 'AS_SATELLITE',
    SET_CLIENTS_COUNT = 'SET_CLIENTS_COUNT',
    SET_ID = 'SET_ID',
  }

  export type Message =
    | {
        action: MessageAction.ASK
        message: string
      }
    | {
        $id: string | undefined
        action: MessageAction.CONVEY
        value: {
          action: MessageAction.ASK
          message: string
        }
      }
    | {
        action: MessageAction.DECLARE
        message: MessageMessage.AS_SATELLITE
      }
    | {
        action: MessageAction.ORDER
        message: MessageMessage.SET_CLIENTS_COUNT
        value: number
      }
    | {
        action: MessageAction.ORDER
        message: MessageMessage.SET_ID
        value: string
      }
}
