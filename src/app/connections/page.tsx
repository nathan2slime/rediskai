import { ConnectionManager } from '@/components/connection-manager'
import { AppShell } from '@/components/layout/app-shell'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { getConnectionsState } from '@/lib/connections-store'

const ConnectionsPage = async () => {
  const state = await getConnectionsState()

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex items-center justify-between border-b border-border pb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Rediskai</p>
          <ThemeToggle />
        </header>
        <ConnectionManager state={state} />
      </div>
    </AppShell>
  )
}

export default ConnectionsPage
