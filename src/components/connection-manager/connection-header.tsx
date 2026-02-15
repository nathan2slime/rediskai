import { CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Title and subtitle for the create connection card.
 * @example
 * <ConnectionHeader />
 */
export const ConnectionHeader = () => {
  return (
    <CardHeader>
      <CardTitle>New connection</CardTitle>
      <p className="text-sm text-muted-foreground">Save Redis URLs to switch quickly.</p>
    </CardHeader>
  )
}
