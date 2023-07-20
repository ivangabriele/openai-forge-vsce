import { window } from 'vscode'

import { DocumentationPath } from '../constants'
import { handleMessageItems } from '../helpers/handleMessageItems'
import { GlobalStateKey, getGlobalStateManager } from '../libs/GlobalStateManager'
import { MessageItemType, type MessageButton } from '../types'
import { showDocumentation } from '../utils/showDocumentation'

const HIDE_MESSAGE_BUTTON: MessageButton = {
  action: async () => {
    await getGlobalStateManager().set(GlobalStateKey.ONBOARDING__HIDE_WELCOME_PAGE, true)
  },
  label: 'Never show welcome page again',
  type: MessageItemType.BUTTON,
}

export async function welcome() {
  const isWelcomePageHidden = await getGlobalStateManager().get(GlobalStateKey.ONBOARDING__HIDE_WELCOME_PAGE)
  if (isWelcomePageHidden) {
    return
  }

  await showDocumentation(DocumentationPath.WELCOME)

  window
    .showInformationMessage("Once you've read the welcome page:", HIDE_MESSAGE_BUTTON.label)
    .then(handleMessageItems([HIDE_MESSAGE_BUTTON]))
}
