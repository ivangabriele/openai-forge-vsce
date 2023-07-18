import { InternalError } from '../libs/InternalError'
import { UserError } from '../libs/UserError'

export function handleError(err: unknown) {
  if (err instanceof InternalError || err instanceof UserError) {
    return
  }

  throw new UserError(undefined, err)
}
