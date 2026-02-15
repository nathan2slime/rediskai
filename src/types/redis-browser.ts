/**
 * Redis key metadata returned by the browser listing.
 * @property {string} key - Raw key name.
 * @property {string} type - Redis data type.
 * @property {number} ttl - TTL in seconds (-1 no expiry, -2 missing).
 * @example
 * const item: RedisKeyInfo = { key: 'user:1', type: 'hash', ttl: -1 }
 */
export type RedisKeyInfo = {
  key: string
  type: string
  ttl: number
}

/**
 * Result payload for a SCAN operation.
 * @property {string} cursor - Cursor to continue scanning.
 * @property {RedisKeyInfo[]} items - Keys and metadata for the current page.
 * @property {boolean} done - True when cursor is 0.
 * @example
 * const result: RedisScanResult = { cursor: '0', items: [], done: true }
 */
export type RedisScanResult = {
  cursor: string
  items: RedisKeyInfo[]
  done: boolean
}

/**
 * Request payload for scanning keys.
 * @property {string} [cursor] - Cursor from previous scan.
 * @property {string} [pattern] - Match pattern (glob).
 * @property {number} [count] - Suggested number of keys to scan.
 * @example
 * const request: RedisScanRequest = { pattern: 'user:*', count: 100 }
 */
export type RedisScanRequest = {
  cursor?: string
  pattern?: string
  count?: number
}

/**
 * Result payload for fetching key details.
 * @property {boolean} ok - Indicates if the fetch succeeded.
 * @property {string} key - Key name requested.
 * @property {string} [type] - Redis data type.
 * @property {number} [ttl] - TTL in seconds.
 * @property {unknown} [value] - Value payload (format varies by type).
 * @property {string} [valueText] - Formatted value as string.
 * @property {string} [highlightedHtml] - HTML for syntax-highlighted value.
 * @property {string} [error] - Error message if the fetch failed.
 * @example
 * const detail: RedisKeyDetailResult = { ok: true, key: 'user:1', type: 'hash', ttl: -1, value: { name: 'Ana' } }
 */
export type RedisKeyDetailResult = {
  ok: boolean
  key: string
  type?: string
  ttl?: number
  value?: unknown
  valueText?: string
  highlightedHtml?: string
  error?: string
}

/**
 * Result payload for updating a key.
 * @property {boolean} ok - Indicates if the update succeeded.
 * @property {string} key - Key name requested.
 * @property {string} [error] - Error message if the update failed.
 * @example
 * const result: RedisKeyUpdateResult = { ok: true, key: 'user:1' }
 */
export type RedisKeyUpdateResult = {
  ok: boolean
  key: string
  error?: string
}

/**
 * Props for the KeyList component.
 * @property {string | null} activeConnectionId - Active connection id.
 * @property {(key: string) => void} onSelect - Callback for key selection.
 * @property {string | null} selectedKey - Currently selected key.
 * @example
 * <KeyList activeConnectionId={state.activeId} onSelect={setKey} selectedKey={key} />
 */
export type KeyListProps = {
  activeConnectionId: string | null
  onSelect: (key: string) => void
  selectedKey: string | null
}

/**
 * Props for the RedisBrowserPanel component.
 * @property {string | null} activeConnectionId - Active connection id.
 * @example
 * <RedisBrowserPanel activeConnectionId={state.activeId} />
 */
export type RedisBrowserPanelProps = {
  activeConnectionId: string | null
}
