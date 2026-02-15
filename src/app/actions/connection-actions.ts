'use server'

import Redis from 'ioredis'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createConnection, getConnectionsState, patchConnectionById, removeConnectionById, saveConnectionsState } from '@/lib/connections-store'
import type { ActionResult, ConnectionsState } from '@/types/connections'

/**
 * Build a consistent error response.
 */
const buildError = (message: string): ActionResult => ({
  ok: false,
  error: message
})

/**
 * Extract a string field from FormData.
 */
const getField = (formData: FormData, key: string) => String(formData.get(key) || '').trim()

/**
 * Ensure a connection exists for a given id.
 */
const findConnection = (state: ConnectionsState, id: string) => state.connections.find(item => item.id === id)

/**
 * Persist and refresh the home page.
 */
const saveAndRevalidate = async (state: ConnectionsState) => {
  await saveConnectionsState(state)
  revalidatePath('/')
}

/**
 * Add a new saved Redis connection.
 */
export const addConnection = async (_prevState: ActionResult, formData: FormData): Promise<ActionResult> => {
  const name = getField(formData, 'name')
  const url = getField(formData, 'url')

  if (!name || !url) {
    return buildError('Name and URL are required')
  }

  const state = await getConnectionsState()
  const next = {
    ...state,
    connections: [...state.connections, createConnection({ name, url })]
  } satisfies ConnectionsState

  await saveAndRevalidate(next)
  return { ok: true }
}

/**
 * Rename a saved Redis connection.
 */
export const renameConnection = async (_prevState: ActionResult, formData: FormData): Promise<ActionResult> => {
  const id = getField(formData, 'id')
  const name = getField(formData, 'name')
  if (!id || !name) return buildError('Name is required')

  const state = await getConnectionsState()
  const exists = state.connections.some(item => item.id === id)
  if (!exists) return buildError('Connection not found')

  const updated = patchConnectionById(state, id, { name })
  await saveAndRevalidate(updated)
  return { ok: true }
}

/**
 * Remove a saved Redis connection.
 */
export const deleteConnection = async (formData: FormData) => {
  const id = getField(formData, 'id')
  if (!id) return

  const state = await getConnectionsState()
  const next = removeConnectionById(state, id)
  await saveAndRevalidate(next)
}

/**
 * Mark a connection as active.
 */
export const setActiveConnection = async (formData: FormData) => {
  const id = getField(formData, 'id')
  if (!id) return

  const state = await getConnectionsState()
  const exists = state.connections.some(item => item.id === id)
  if (!exists) return

  await saveAndRevalidate({
    activeId: id,
    activeDb: state.activeId === id ? state.activeDb : 0,
    connections: state.connections
  })
}

/**
 * Update the active database index for the active connection.
 */
export const setActiveDatabase = async (formData: FormData) => {
  const id = getField(formData, 'id')
  const dbRaw = getField(formData, 'db')
  const db = Number(dbRaw)

  if (!id || Number.isNaN(db)) return
  if (db < 0 || db > 15) return

  const state = await getConnectionsState()
  if (state.activeId !== id) {
    await saveAndRevalidate({
      activeId: id,
      activeDb: db,
      connections: state.connections
    })
    return
  }

  await saveAndRevalidate({
    activeId: state.activeId,
    activeDb: db,
    connections: state.connections
  })
}

/**
 * Activate a connection and redirect to browser.
 */
export const openBrowser = async (formData: FormData) => {
  const id = getField(formData, 'id')
  if (!id) return

  const state = await getConnectionsState()
  const exists = state.connections.some(item => item.id === id)
  if (!exists) return

  await saveConnectionsState({
    activeId: id,
    activeDb: state.activeId === id ? state.activeDb : 0,
    connections: state.connections
  })

  redirect('/browser')
}

/**
 * Test Redis connectivity and store the last ping result.
 */
export const testConnection = async (_prevState: ActionResult, formData: FormData): Promise<ActionResult> => {
  const id = getField(formData, 'id')
  if (!id) return buildError('Invalid connection')

  const state = await getConnectionsState()
  const target = findConnection(state, id)
  if (!target) return buildError('Connection not found')

  const startedAt = Date.now()
  try {
    const client = new Redis(target.url, {
      lazyConnect: true,
      connectTimeout: 3000,
      maxRetriesPerRequest: 0,
      enableReadyCheck: true
    })

    await client.connect()
    await client.ping()
    client.disconnect()

    const latencyMs = Date.now() - startedAt
    const updated = patchConnectionById(state, id, {
      lastTestedAt: new Date().toISOString(),
      lastTestStatus: 'ok',
      lastTestLatencyMs: latencyMs,
      lastTestError: undefined
    })

    await saveAndRevalidate(updated)
    return { ok: true, latencyMs }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to connect'
    const updated = patchConnectionById(state, id, {
      lastTestedAt: new Date().toISOString(),
      lastTestStatus: 'error',
      lastTestError: message
    })

    await saveAndRevalidate(updated)
    return buildError(message)
  }
}
