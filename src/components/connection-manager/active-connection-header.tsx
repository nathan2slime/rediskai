import { Text } from '@gravity-ui/uikit'

/**
 * Title and subtitle for the active connection panel.
 * @example
 * <ActiveConnectionHeader />
 */
export const ActiveConnectionHeader = () => {
  return (
    <div className="space-y-2">
      <Text as="h3" variant="header-1">
        Active connection
      </Text>
      <Text as="p" className="text-sm text-muted-foreground">
        Pick a database index for the active connection.
      </Text>
    </div>
  )
}
