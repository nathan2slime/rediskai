/**
 * Empty state for when no connection is active.
 * @example
 * <ActiveConnectionEmpty />
 */
export const ActiveConnectionEmpty = () => {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <p className="text-sm text-muted-foreground">No active connection selected.</p>
    </div>
  )
}
