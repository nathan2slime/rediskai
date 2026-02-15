import type { SavedConnectionsProps } from '@/types/connection-manager'

import { ConnectionCard } from '@/components/connection-manager/connection-card'
import { EmptyConnections } from '@/components/connection-manager/empty-connections'

/**
 * Render the list of saved connections.
 * @example
 * <SavedConnections state={state} pendingTestId={null} setActiveAction={setActive} setDatabaseAction={setDb} renameAction={rename} testAction={test} deleteAction={remove} openBrowserAction={openBrowser} />
 */
export const SavedConnections = ({
  state,
  pendingTestId,
  setActiveAction,
  setDatabaseAction,
  renameAction,
  testAction,
  deleteAction,
  openBrowserAction
}: SavedConnectionsProps) => {
  if (state.connections.length === 0) {
    return <EmptyConnections />
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {state.connections.map(connection => (
        <ConnectionCard
          key={connection.id}
          connection={connection}
          isActive={state.activeId === connection.id}
          testPending={pendingTestId === connection.id}
          setActiveAction={setActiveAction}
          setDatabaseAction={setDatabaseAction}
          renameAction={renameAction}
          testAction={testAction}
          deleteAction={deleteAction}
          openBrowserAction={openBrowserAction}
          activeDb={state.activeDb}
        />
      ))}
    </div>
  )
}
