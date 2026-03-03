import { Template } from '@gravity-ui/illustrations'

/**
 * Empty state content for saved connections.
 * @example
 * <EmptyConnections />
 */
export const EmptyConnections = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <Template className="w-44 h-44" />
      <p className="text-sm text-muted-foreground">No connections saved yet</p>
    </div>
  )
}
