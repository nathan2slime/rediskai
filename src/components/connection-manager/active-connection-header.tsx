import { CardDescription, CardTitle } from '@/components/ui/card'

/**
 * Title and subtitle for the active connection panel.
 * @example
 * <ActiveConnectionHeader />
 */
export const ActiveConnectionHeader = () => {
  return (
    <div className="space-y-2">
      <CardTitle>Active connection</CardTitle>
      <CardDescription>Pick a database index for the active connection.</CardDescription>
    </div>
  )
}
