import { isEmpty as ramdaIsEmpty } from 'ramda'

export function isEmpty(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim() === ''
  }

  return ramdaIsEmpty(value)
}
