import { existsSync } from 'fs'
import { join } from 'path'
import { Position, Range, Uri, ViewColumn, WorkspaceEdit, window, workspace } from 'vscode'

import { DocumentationPath } from '../constants'
import { handleMessageItems } from '../helpers/handleMessageItems'
import { isEmpty } from '../helpers/isEmpty'
import { GlobalStateKey, getGlobalStateManager } from '../libs/GlobalStateManager'
import { MessageItemType, type MessageButton } from '../types'
import { getUserWorkspaceRootPath } from '../utils/getUserWorkspaceRootPath'
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

  const workspaceSettingsPath = join(getUserWorkspaceRootPath(), '.vscode', 'settings.json')
  if (!existsSync(workspaceSettingsPath)) {
    await workspace.fs.writeFile(Uri.file(workspaceSettingsPath), Buffer.from('{}'))
  }
  const workspaceSettingsDocument = await workspace.openTextDocument(workspaceSettingsPath)
  const workspaceSettingsText = workspaceSettingsDocument.getText()

  if (!workspaceSettingsText.includes('openai-forge.customEvaluators')) {
    const workspaceSettings = !isEmpty(workspaceSettingsText) ? JSON.parse(workspaceSettingsText) : {}
    const suggestedWorkspaceSettings = JSON.stringify(
      {
        ...workspaceSettings,
        'openai-forge.customEvaluators': [
          {
            command: 'npm',
            commandArgs: ['run', 'build'],
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        ],
      },
      // eslint-disable-next-line no-null/no-null
      null,
      2,
    )
    const workspaceSettingsEdit = new WorkspaceEdit()
    workspaceSettingsEdit.replace(
      workspaceSettingsDocument.uri,
      new Range(
        new Position(0, 0),
        workspaceSettingsDocument.lineAt(workspaceSettingsDocument.lineCount - 1).range.end,
      ),
      suggestedWorkspaceSettings,
    )

    await window.showTextDocument(workspaceSettingsDocument, ViewColumn.Two)
    await workspace.applyEdit(workspaceSettingsEdit)

    window
      .showInformationMessage("Once you've read the welcome page:", HIDE_MESSAGE_BUTTON.label)
      .then(handleMessageItems([HIDE_MESSAGE_BUTTON]))
  }
}
