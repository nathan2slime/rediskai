import { CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Title and subtitle for the saved connections card.
 * @example
 * <SavedConnectionsHeader />
 */
export const SavedConnectionsHeader = () => {
  return (
    <CardHeader>
      <CardTitle>Saved connections</CardTitle>
      <p className="text-sm text-muted-foreground">Mark one active, test ping, and remove when needed.</p>
    </CardHeader>
  )
}
