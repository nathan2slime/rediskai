/**
 * Result of a connection ping or action.
 * @property {boolean} ok - Indicates if the action was successful.
 * @property {string} [error] - Optional error message if the action failed.
 * @property {number} [latencyMs] - Optional latency in milliseconds for the action.
 * @example
 * const result: ActionResult = { ok: true, latencyMs: 32 }
 */
export type ActionResult = {
  ok: boolean
  error?: string
  latencyMs?: number
}

/**
 * Redis connection metadata stored locally.
 * @property {string} id - Unique identifier for the connection.
 * @property {string} name - User-friendly name for the connection.
 * @property {string} url - Connection URL (e.g., redis://localhost:6379).
 * @property {string} createdAt - ISO timestamp of when the connection was created.
 * @property {string} [lastTestedAt] - ISO timestamp of the last test attempt.
 * @property {'ok' | 'error'} [lastTestStatus] - Result of the last test attempt.
 * @property {number} [lastTestLatencyMs] - Latency in milliseconds of the last test attempt.
 * @property {string} [lastTestError] - Error message from the last test attempt, if any.
 * @example
 * const connection: Connection = {
 *   id: 'uuid',
 *   name: 'Local',
 *   url: 'redis://localhost:6379',
 *   createdAt: new Date().toISOString()
 * }
 */
export type Connection = {
  id: string
  name: string
  url: string
  createdAt: string
  lastTestedAt?: string
  lastTestStatus?: 'ok' | 'error'
  lastTestLatencyMs?: number
  lastTestError?: string
}

/**
 * Persisted application state for Redis connections.
 * @property {string | null} activeId - The ID of the currently active connection, or null if none is active.
 * @property {number} activeDb - Active database index for the selected connection.
 * @property {Connection[]} connections - An array of all saved connections.
 * @example
 * const state: ConnectionsState = { activeId: null, activeDb: 0, connections: [] }
 */
export type ConnectionsState = {
  activeId: string | null
  activeDb: number
  connections: Connection[]
}

/**
 * Partial update payload for a connection.
 * @property {string} [name] - Optional name override.
 * @property {string} [url] - Optional URL override.
 * @property {string} [lastTestedAt] - ISO timestamp of the last test attempt.
 * @property {'ok' | 'error'} [lastTestStatus] - Result of the last test attempt.
 * @property {number} [lastTestLatencyMs] - Latency in milliseconds of the last test attempt.
 * @property {string} [lastTestError] - Error message from the last test attempt, if any.
 * @example
 * const patch: ConnectionPatch = { lastTestStatus: 'ok', lastTestLatencyMs: 18 }
 */
export type ConnectionPatch = Partial<Pick<Connection, 'name' | 'url' | 'lastTestedAt' | 'lastTestStatus' | 'lastTestLatencyMs' | 'lastTestError'>>
