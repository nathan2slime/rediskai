'use client'

import { Xmark } from '@gravity-ui/icons'
import { Button, Card, Divider, Icon, Modal } from '@gravity-ui/uikit'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { addConnection, deleteConnection, openBrowser, renameConnection, setActiveConnection, setActiveDatabase } from '@/app/actions/connection-actions'
import { ConnectionForm } from '@/components/connection-manager/connection-form'
import { ConnectionHeader } from '@/components/connection-manager/connection-header'
import { SavedConnections } from '@/components/connection-manager/saved-connections'
import { SavedConnectionsHeader } from '@/components/connection-manager/saved-connections-header'
import { useConnectionTestAction } from '@/hooks/use-connection-test-action'
import type { ConnectionManagerProps } from '@/types/connection-manager'
import type { ActionResult } from '@/types/connections'

const initialResult: ActionResult = { ok: true }

const useActionErrorToast = (state: ActionResult) => {
  useEffect(() => {
    if (state.ok) return
    if (!state.error) return
    toast.error(state.error)
  }, [state.error, state.ok])
}

/**
 * Manage saved Redis connections.
 * @example
 * <ConnectionManager state={state} />
 */
export const ConnectionManager = ({ state }: ConnectionManagerProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addState, addAction, addPending] = useActionState(addConnection, initialResult)
  const [renameState, renameAction] = useActionState(renameConnection, initialResult)
  const { pendingTestId, handleTest } = useConnectionTestAction({
    notify: {
      error: toast.error
    }
  })

  useActionErrorToast(addState)
  useActionErrorToast(renameState)

  const renderAddConnectionCard = () => (
    <div className="h-fit flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <ConnectionHeader />
        <Button type="button" view="flat" size="s" onClick={() => setIsAddModalOpen(false)}>
          <Icon data={Xmark} size={14} />
        </Button>
      </div>
      <Divider className="mb-2" />
      <ConnectionForm closeAction={() => setIsAddModalOpen(false)} addAction={addAction} addPending={addPending} addState={addState} />
    </div>
  )

  return (
    <div className="space-y-6 relative">
      <Card className="p-3">
        <SavedConnectionsHeader setIsAddModalOpen={setIsAddModalOpen} />
        <Divider className="my-2" />
        <div className="space-y-4 mt-4">
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
        </div>
      </Card>

      <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} contentClassName="p-4 w-[min(520px,92vw)]">
        {renderAddConnectionCard()}
      </Modal>
    </div>
  )
}
