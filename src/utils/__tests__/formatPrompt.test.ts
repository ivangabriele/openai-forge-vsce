import { ProjectFramework, ProjectLanguage, type WorkspaceInfo, type DocumentInfo } from '../../types'
import { formatPrompt } from '../formatPrompt'

describe('utils/formatPrompt()', () => {
  it('should return a string', () => {
    const project: WorkspaceInfo = {
      name: 'FooBar',
      languages: [ProjectLanguage.RUST, ProjectLanguage.TYPESCRIPT],
      subFrameworks: [ProjectFramework.REACT],
      mainFramework: ProjectFramework.TAURI,
      source: '',
      rootPath: '/home/user/acme/foobar',
    }

    const documents: DocumentInfo[] = [
      {
        absolutePath: '/home/user/acme/foobar',
        relativePath: 'src/index.tsx',
        source: 'Some TypeScript',
      },
      {
        absolutePath: '/home/user/acme/foobar',
        relativePath: 'src-tauri/src/main.rs',
        source: 'Some Rust',
      },
    ]

    const result = formatPrompt(project, documents)

    expect(result).toMatchSnapshot()
  })
})
