import { isEmpty } from '../isEmpty'

describe('isEmpty', () => {
  it('should return true if the value is an empty string', () => {
    expect(isEmpty('')).toBe(true)
  })

  it('should return true if the value is a string with spaces', () => {
    expect(isEmpty('   ')).toBe(true)
  })

  it('should return false if the value is a non-empty string', () => {
    expect(isEmpty('hello')).toBe(false)
  })
})
