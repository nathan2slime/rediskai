import { Text } from '@gravity-ui/uikit'

/**
 * Title and subtitle for the create connection card.
 * @example
 * <ConnectionHeader />
 */
export const ConnectionHeader = () => {
  return (
    <div className="flex flex-col">
      <Text variant="body-3">New connection</Text>
      <Text variant="body-1">Save Redis URLs to switch quickly</Text>
    </div>
  )
}
