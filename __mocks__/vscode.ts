// import type { WorkspaceFolder } from 'vscode'

export const env = {
  openExternal: jest.fn(),
}

export const Uri = {
  parse: jest.fn(value => value),
}

export const workspace = {
  openTextDocument: jest.fn().mockResolvedValue({
    getText: jest.fn().mockReturnValue('Document source.'),
  }),
  workspaceFolders: [
    {
      index: 0,
      name: 'folder',
      uri: {
        fsPath: '/folder',
      },
    },
  ],
}

export const window = {
  createOutputChannel: jest.fn(() => ({
    appendLine: jest.fn(),
  })),
  showErrorMessage: jest.fn(),
}
