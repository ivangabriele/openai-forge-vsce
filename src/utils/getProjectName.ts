import path from 'path'

export function getProjectName(workspacePath: string): string {
  const rawName = path.basename(workspacePath)
  const rawNameWords = rawName.split(/[-_]|(?=[A-Z])/)
  const name = rawNameWords.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')

  return name
}
