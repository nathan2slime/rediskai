'use client'

import { Xmark } from '@gravity-ui/icons'
import { Button, Divider, Icon, Modal } from '@gravity-ui/uikit'
import { useActionState, useEffect, useState } from 'react'

import { addConnection, deleteConnection, openBrowser, renameConnection, setActiveConnection, setActiveDatabase } from '@/app/actions/connection-actions'
import { ConnectionForm } from '@/components/connection-manager/connection-form'
import { ConnectionHeader } from '@/components/connection-manager/connection-header'
import { SavedConnections } from '@/components/connection-manager/saved-connections'
import { SavedConnectionsHeader } from '@/components/connection-manager/saved-connections-header'
import { useConnectionTestAction } from '@/hooks/use-connection-test-action'
import { notifyError } from '@/lib/toaster'
import type { ConnectionManagerProps } from '@/types/connection-manager'
import type { ActionResult } from '@/types/connections'

const initialResult: ActionResult = { ok: true }

const useActionErrorToast = (state: ActionResult) => {
  useEffect(() => {
    if (state.ok) return
    if (!state.error) return
    notifyError(state.error)
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
      error: notifyError
    }
  })

  useActionErrorToast(addState)
  useActionErrorToast(renameState)

  const renderAddConnectionCard = () => (
    <div className="h-fit flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3 w-full">
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
      <div className="p-3">
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
      </div>

      <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} contentClassName="p-4 w-[min(520px,92vw)]!">
        {renderAddConnectionCard()}
      </Modal>
    </div>
  )
}
