import { sep } from 'path'

export function sortPathByDepth(a: string, b: string) {
  const aDepth = a.split(sep).length
  const bDepth = b.split(sep).length

  return aDepth - bDepth
}
