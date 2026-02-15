'use client'

import { useActionState, useState } from 'react'
import { toast } from 'sonner'

import { addConnection, deleteConnection, openBrowser, renameConnection, setActiveConnection, setActiveDatabase, testConnection } from '@/app/actions/connection-actions'
import { ConnectionForm } from '@/components/connection-manager/connection-form'
import { ConnectionHeader } from '@/components/connection-manager/connection-header'
import { SavedConnections } from '@/components/connection-manager/saved-connections'
import { SavedConnectionsHeader } from '@/components/connection-manager/saved-connections-header'
import { Card, CardContent } from '@/components/ui/card'
import type { ConnectionManagerProps } from '@/types/connection-manager'
import type { ActionResult } from '@/types/connections'

const initialResult: ActionResult = { ok: true }

/**
 * Manage saved Redis connections.
 * @example
 * <ConnectionManager state={state} />
 */
export const ConnectionManager = ({ state }: ConnectionManagerProps) => {
  const [addState, addAction, addPending] = useActionState(addConnection, initialResult)
  const [renameState, renameAction] = useActionState(renameConnection, initialResult)
  const [pendingTestId, setPendingTestId] = useState<string | null>(null)

  const handleTest = async (id: string) => {
    setPendingTestId(id)
    const formData = new FormData()
    formData.set('id', id)
    const result = await testConnection(initialResult, formData)
    if (!result.ok) {
      toast.error('Connection is closed.')
    }
    setPendingTestId(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Card className="h-fit">
          <ConnectionHeader />
          <ConnectionForm addAction={addAction} addPending={addPending} addError={addState.error} />
        </Card>
      </div>

      <Card>
        <SavedConnectionsHeader />
        <CardContent className="space-y-4 mt-4">
          <SavedConnections
            state={state}
            pendingTestId={pendingTestId}
            setActiveAction={setActiveConnection}
            setDatabaseAction={setActiveDatabase}
            renameAction={renameAction}
            testAction={handleTest}
            deleteAction={deleteConnection}
            openBrowserAction={openBrowser}
          />
          {renameState.ok ? null : <p className="text-sm text-destructive">{renameState.error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
