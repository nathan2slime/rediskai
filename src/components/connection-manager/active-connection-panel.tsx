import { ActiveConnectionEmpty } from '@/components/connection-manager/active-connection-empty'
import { ActiveConnectionHeader } from '@/components/connection-manager/active-connection-header'
import { Badge } from '@/components/ui/badge'
import { CardContent } from '@/components/ui/card'
import type { ActiveConnectionPanelProps } from '@/types/connection-manager'

/**
 * Panel that renders the active connection summary.
 * @example
 * <ActiveConnectionPanel state={state} setDatabaseAction={setDb} />
 */
export const ActiveConnectionPanel = ({ state }: ActiveConnectionPanelProps) => {
  const active = state.connections.find(connection => connection.id === state.activeId)

  return (
    <CardContent className="space-y-4">
      <ActiveConnectionHeader />
      {!active ? (
        <ActiveConnectionEmpty />
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{active.name}</p>
              <p className="text-xs text-muted-foreground">{active.url}</p>
            </div>
            <Badge className="border-emerald-300/40 bg-emerald-500/10 text-emerald-400">active · DB {state.activeDb}</Badge>
          </div>
        </div>
      )}
    </CardContent>
  )
}
