import { DocumentInfo } from '../../libs/DocumentInfo'
import { type UserWorkspace } from '../../types'
import { getTopEvaluator } from '../getTopEvaluator'

describe('getTopEvaluator', () => {
  const jsEvaluator: UserWorkspace.Evaluator = {
    command: 'eslint',
    commandArgs: ['.'],
    extensions: ['.js', '.jsx'],
    workingDirectoryAbsolutePath: '/path/to/js/project',
  }

  const tsEvaluator: UserWorkspace.Evaluator = {
    command: 'tsc',
    commandArgs: ['--noEmit'],
    extensions: ['.ts', '.tsx'],
    workingDirectoryAbsolutePath: '/path/to/ts/project',
  }

  const rustEvaluator: UserWorkspace.Evaluator = {
    command: 'cargo',
    commandArgs: ['build'],
    extensions: ['.rs'],
    workingDirectoryAbsolutePath: '/path/to/rust/project',
  }

  it('should return the correct evaluator for JavaScript files', () => {
    const documentInfos = [new DocumentInfo('/path/to/js/project/index.js')]
    const bestEvaluator = getTopEvaluator(documentInfos, [jsEvaluator, tsEvaluator, rustEvaluator])
    expect(bestEvaluator).toBe(jsEvaluator)
  })

  it('should return the correct evaluator for TypeScript files', () => {
    const documentInfos = [new DocumentInfo('/path/to/ts/project/index.ts')]
    const bestEvaluator = getTopEvaluator(documentInfos, [jsEvaluator, tsEvaluator, rustEvaluator])
    expect(bestEvaluator).toBe(tsEvaluator)
  })

  it('should return the correct evaluator for Rust files', () => {
    const documentInfos = [new DocumentInfo('/path/to/rust/project/main.rs')]
    const bestEvaluator = getTopEvaluator(documentInfos, [jsEvaluator, tsEvaluator, rustEvaluator])
    expect(bestEvaluator).toBe(rustEvaluator)
  })

  it('should return null if no matching evaluator found', () => {
    const documentInfos = [new DocumentInfo('/path/to/python/project/main.py')]
    const bestEvaluator = getTopEvaluator(documentInfos, [jsEvaluator, tsEvaluator, rustEvaluator])
    expect(bestEvaluator).toBeUndefined()
  })
})
