import { Uri, env } from 'vscode'

import { InternalError } from '../libs/InternalError'
import { MessageItemType, type MessageButton, type MessageLink } from '../types'

export function handleMessageItems(items: Array<MessageButton | MessageLink>) {
  return async function handleMessageItem(itemLabel: string | undefined) {
    if (!itemLabel) {
      return
    }

    const item = items.find(({ label }) => label === itemLabel)
    if (!item) {
      throw new InternalError(`This \`item\` does not exist: "${itemLabel}".`)
    }

    switch (item.type) {
      case MessageItemType.BUTTON:
        await item.action()
        break

      case MessageItemType.LINK:
        await env.openExternal(Uri.parse(item.url))
        break

      default:
        throw new InternalError(`Unknown \`MessageItemType\`: "${(item as any).type}".`)
    }
  }
}
