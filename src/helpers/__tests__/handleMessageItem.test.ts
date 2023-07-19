import { Uri, env } from 'vscode'

import { MessageItemType, type MessageButton, type MessageLink } from '../../types'
import { handleMessageItems } from '../handleMessageItems'

describe('handleMessageItems', () => {
  const mockButtonAction = jest.fn()
  const mockItems: Array<MessageButton | MessageLink> = [
    { action: mockButtonAction, label: 'button', type: MessageItemType.BUTTON },
    { label: 'link', type: MessageItemType.LINK, url: 'https://example.org' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should do nothing if itemLabel is undefined', async () => {
    const handleItem = handleMessageItems(mockItems)
    await handleItem(undefined)
    expect(mockButtonAction).not.toHaveBeenCalled()
  })

  it('should throw an error if no item matches the itemLabel', async () => {
    const handleItem = handleMessageItems(mockItems)
    await expect(handleItem('unknown label')).rejects.toThrowError()
  })

  it('should execute the action if the item type is BUTTON', async () => {
    const handleItem = handleMessageItems(mockItems)
    await handleItem('button')
    expect(mockButtonAction).toHaveBeenCalled()
  })

  it('should open an external link if the item type is LINK', async () => {
    const handleItem = handleMessageItems(mockItems)
    await handleItem('link')
    expect(Uri.parse).toHaveBeenCalledWith('https://example.org')
    expect(env.openExternal).toHaveBeenCalledWith('https://example.org')
  })

  it('should throw an error if the item type is unknown', async () => {
    const handleItem = handleMessageItems([...mockItems, { label: 'unknown', type: 'UNKNOWN' } as any])
    await expect(handleItem('unknown')).rejects.toThrowError()
  })
})
