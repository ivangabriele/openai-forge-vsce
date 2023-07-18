import type { UserWorkspace } from './UserWorkspace'

export namespace UserSettings {
  export type Settings = {
    customEvaluators: CustomEvaluator[]
    prompt: {
      excludeProjectInfo: boolean
    }
  }

  export type CustomEvaluator = Omit<UserWorkspace.Evaluator, 'workingDirectoryAbsolutePath'> & {
    workingDirectoryRelativePath: string
  }
}
