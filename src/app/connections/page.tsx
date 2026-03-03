import { ConnectionManager } from '@/components/connection-manager'
import { AppShell } from '@/components/layout/app-shell'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { getConnectionsState } from '@/lib/connections-store'

const ConnectionsPage = async () => {
  const state = await getConnectionsState()

  return (
    <AppShell>
      <div className="space-y-6">
        <ThemeToggle />
        <ConnectionManager state={state} />
      </div>
    </AppShell>
  )
}

export default ConnectionsPage
