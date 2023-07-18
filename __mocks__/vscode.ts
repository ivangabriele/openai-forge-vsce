// import type { WorkspaceFolder } from 'vscode'

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
  showErrorMessage: jest.fn(),
}
