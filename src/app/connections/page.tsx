import { Card } from '@gravity-ui/uikit'

import { ConnectionManager } from '@/components/connection-manager'
import { AppShell } from '@/components/layout/app-shell'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { getConnectionsState } from '@/lib/connections-store'

const ConnectionsPage = async () => {
  const state = await getConnectionsState()

  return (
    <AppShell>
      <div className="space-y-6">
        <Card className="items-center hidden justify-between mb-4 p-3">
          <ThemeToggle />
        </Card>
        <ConnectionManager state={state} />
      </div>
    </AppShell>
  )
}

export default ConnectionsPage
