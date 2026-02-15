import type { ConnectionsState } from '@/types/connections'

/**
 * Props for the ConnectionManager component.
 * @property {ConnectionsState} state - Connections state loaded from the server.
 * @example
 * <ConnectionManager state={state} />
 */
export type ConnectionManagerProps = {
  state: ConnectionsState
}

/**
 * Props for the ConnectionForm component.
 * @property {(formData: FormData) => void} addAction - Server action handler for adding connections.
 * @property {boolean} addPending - Indicates whether the add action is pending.
 * @property {string} [addError] - Optional error message from the add action.
 * @example
 * <ConnectionForm addAction={action} addPending={false} />
 */
export type ConnectionFormProps = {
  addAction: (formData: FormData) => void
  addPending: boolean
  addError?: string
}

/**
 * Props for the ConnectionCard component.
 * @property {ConnectionsState['connections'][number]} connection - A single connection item to render.
 * @property {boolean} isActive - Whether this connection is active.
 * @property {boolean} testPending - True when test action is running for this connection.
 * @property {(formData: FormData) => void} setActiveAction - Action to set active connection.
 * @property {(formData: FormData) => void} setDatabaseAction - Action to set active database index.
 * @property {(formData: FormData) => void} renameAction - Action to rename connection.
 * @property {(id: string) => Promise<void>} testAction - Action to test connection.
 * @property {(formData: FormData) => void} deleteAction - Action to delete connection.
 * @property {(formData: FormData) => void} openBrowserAction - Action to open browser view.
 * @property {number} activeDb - Active database index.
 * @example
 * <ConnectionCard connection={item} isActive={false} testPending={false} setActiveAction={setActive} setDatabaseAction={setDb} renameAction={rename} testAction={test} deleteAction={remove} openBrowserAction={openBrowser} activeDb={0} />
 */
export type ConnectionCardProps = {
  connection: ConnectionsState['connections'][number]
  isActive: boolean
  testPending: boolean
  setActiveAction: (formData: FormData) => void
  setDatabaseAction: (formData: FormData) => void
  renameAction: (formData: FormData) => void
  testAction: (id: string) => Promise<void>
  deleteAction: (formData: FormData) => void
  openBrowserAction: (formData: FormData) => void
  activeDb: number
}

/**
 * Props for the SavedConnections list component.
 * @property {ConnectionsState} state - Current connections state.
 * @property {string | null} pendingTestId - Connection id currently being tested.
 * @property {(formData: FormData) => void} setActiveAction - Action to set active connection.
 * @property {(formData: FormData) => void} setDatabaseAction - Action to set active database index.
 * @property {(formData: FormData) => void} renameAction - Action to rename connection.
 * @property {(id: string) => Promise<void>} testAction - Action to test connection.
 * @property {(formData: FormData) => void} deleteAction - Action to delete connection.
 * @property {(formData: FormData) => void} openBrowserAction - Action to open browser view.
 * @example
 * <SavedConnections state={state} pendingTestId={null} setActiveAction={setActive} setDatabaseAction={setDb} renameAction={rename} testAction={test} deleteAction={remove} openBrowserAction={openBrowser} />
 */
export type SavedConnectionsProps = {
  state: ConnectionsState
  pendingTestId: string | null
  setActiveAction: (formData: FormData) => void
  setDatabaseAction: (formData: FormData) => void
  renameAction: (formData: FormData) => void
  testAction: (id: string) => Promise<void>
  deleteAction: (formData: FormData) => void
  openBrowserAction: (formData: FormData) => void
}

/**
 * Props for the ActiveConnectionPanel component.
 * @property {ConnectionsState} state - Current connections state.
 * @property {(formData: FormData) => void} setDatabaseAction - Action to set the active database.
 * @example
 * <ActiveConnectionPanel state={state} setDatabaseAction={setDb} />
 */
export type ActiveConnectionPanelProps = {
  state: ConnectionsState
  setDatabaseAction: (formData: FormData) => void
}
