import { promises as fs } from 'node:fs'
import path from 'node:path'

import type { Connection, ConnectionPatch, ConnectionsState } from '@/types/connections'

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'connections.json')

/**
 * Ensure the local store exists on disk.
 */
const ensureStore = async () => {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(dataFile)
  } catch {
    const initial: ConnectionsState = { activeId: null, activeDb: 0, connections: [] }
    await fs.writeFile(dataFile, JSON.stringify(initial, null, 2))
  }
}

/**
 * Read persisted connections state.
 */
export const getConnectionsState = async (): Promise<ConnectionsState> => {
  await ensureStore()
  const raw = await fs.readFile(dataFile, 'utf8')
  const parsed = JSON.parse(raw) as Partial<ConnectionsState>

  return {
    activeId: parsed.activeId ?? null,
    activeDb: typeof parsed.activeDb === 'number' ? parsed.activeDb : 0,
    connections: parsed.connections ?? []
  }
}

/**
 * Persist the entire connections state.
 */
export const saveConnectionsState = async (state: ConnectionsState) => {
  await ensureStore()
  await fs.writeFile(dataFile, JSON.stringify(state, null, 2))
}

/**
 * Create a new connection entry.
 */
export const createConnection = (input: {
  name: string
  url: string
  createdAt?: string
}): Connection => {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: input.name,
    url: input.url,
    createdAt: input.createdAt ?? now
  }
}

/**
 * Update a connection in-memory by id.
 */
export const patchConnectionById = (state: ConnectionsState, id: string, patch: ConnectionPatch): ConnectionsState => {
  return {
    activeId: state.activeId,
    activeDb: state.activeDb,
    connections: state.connections.map(item =>
      item.id === id
        ? {
            ...item,
            ...patch
          }
        : item
    )
  }
}

/**
 * Remove a connection by id.
 */
export const removeConnectionById = (state: ConnectionsState, id: string): ConnectionsState => {
  return {
    activeId: state.activeId === id ? null : state.activeId,
    activeDb: state.activeId === id ? 0 : state.activeDb,
    connections: state.connections.filter(item => item.id !== id)
  }
}
