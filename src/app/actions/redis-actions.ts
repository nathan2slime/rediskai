'use server'

import type { BundledLanguage } from 'shiki'
import { codeToHtml } from 'shiki'

import { getConnectionsState } from '@/lib/connections-store'
import type { RedisKeyDetailResult, RedisKeyInfo, RedisKeyUpdateResult, RedisScanResult } from '@/types/redis-browser'
import { createRedisClient } from '@/utils/redis'

const isConnectionError = (message: string) => {
  return /ECONN|EHOSTUNREACH|ETIMEDOUT|ENOTFOUND|connect|Connection/i.test(message)
}

/**
 * Fetch a page of keys using SCAN and return metadata.
 */
export const scanKeys = async (_prevState: RedisScanResult | null, formData: FormData): Promise<RedisScanResult> => {
  const cursor = String(formData.get('cursor') || '0')
  const pattern = String(formData.get('pattern') || '*')
  const countRaw = String(formData.get('count') || '100')
  const count = Math.min(Math.max(Number(countRaw) || 100, 10), 500)

  const state = await getConnectionsState()
  if (!state.activeId) {
    return { cursor: '0', items: [], done: true }
  }

  const active = state.connections.find(connection => connection.id === state.activeId)
  if (!active) {
    return { cursor: '0', items: [], done: true }
  }

  const client = createRedisClient(active, state.activeDb)

  try {
    await client.connect()
    const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', count)

    const items: RedisKeyInfo[] = []
    for (const key of keys) {
      const [type, ttl] = await Promise.all([client.type(key), client.ttl(key)])
      items.push({ key, type, ttl })
    }

    return { cursor: nextCursor, items, done: nextCursor === '0' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to scan keys'
    return { cursor: '0', items: [], done: true, error: message, connectionLost: isConnectionError(message) }
  } finally {
    client.disconnect()
  }
}

const resolveLanguage = (type?: string): BundledLanguage => {
  if (!type) return 'json'
  if (type === 'string') return 'json'
  return 'json'
}

const formatValue = (value: unknown) => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return value
    }
  }
  return JSON.stringify(value, null, 2)
}

/**
 * Fetch a key value and metadata.
 */
export const fetchKeyDetail = async (_prevState: RedisKeyDetailResult | null, formData: FormData): Promise<RedisKeyDetailResult> => {
  const key = String(formData.get('key') || '')
  if (!key) {
    return { ok: false, key: '', error: 'Key is required' }
  }

  const state = await getConnectionsState()
  if (!state.activeId) {
    return { ok: false, key, error: 'No active connection' }
  }

  const active = state.connections.find(connection => connection.id === state.activeId)
  if (!active) {
    return { ok: false, key, error: 'Active connection not found' }
  }

  const client = createRedisClient(active, state.activeDb)

  try {
    await client.connect()
    const type = await client.type(key)
    if (type === 'none') {
      return { ok: false, key, error: 'Key not found' }
    }

    const ttl = await client.ttl(key)
    let value: unknown = null

    if (type === 'string') {
      value = await client.get(key)
    } else if (type === 'hash') {
      value = await client.hgetall(key)
    } else if (type === 'list') {
      value = await client.lrange(key, 0, 200)
    } else if (type === 'set') {
      value = await client.smembers(key)
    } else if (type === 'zset') {
      value = await client.zrange(key, 0, 200, 'WITHSCORES')
    } else if (type === 'stream') {
      value = await client.xrange(key, '-', '+', 'COUNT', 200)
    } else {
      value = '[unsupported type]'
    }

    const valueText = formatValue(value)
    const highlightedHtml = await codeToHtml(valueText, {
      lang: resolveLanguage(type),
      theme: 'github-dark'
    })

    return { ok: true, key, type, ttl, value, valueText, highlightedHtml }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch key'
    return { ok: false, key, error: message, connectionLost: isConnectionError(message) }
  } finally {
    client.disconnect()
  }
}

/**
 * Update a string key and optional TTL.
 */
export const updateStringKey = async (_prevState: RedisKeyUpdateResult | null, formData: FormData): Promise<RedisKeyUpdateResult> => {
  const key = String(formData.get('key') || '')
  const value = String(formData.get('value') ?? '')
  const ttlRaw = String(formData.get('ttl') || '')
  const ttl = ttlRaw ? Number(ttlRaw) : null

  if (!key) return { ok: false, key: '', error: 'Key is required' }

  const state = await getConnectionsState()
  if (!state.activeId) return { ok: false, key, error: 'No active connection' }

  const active = state.connections.find(connection => connection.id === state.activeId)
  if (!active) return { ok: false, key, error: 'Active connection not found' }

  const client = createRedisClient(active, state.activeDb)

  try {
    await client.connect()
    const type = await client.type(key)
    if (type !== 'string' && type !== 'none') {
      return { ok: false, key, error: `Cannot edit type ${type}` }
    }

    await client.set(key, value)

    if (ttl !== null) {
      if (!Number.isFinite(ttl) || ttl < 0) {
        return { ok: false, key, error: 'TTL must be >= 0' }
      }
      if (ttl === 0) {
        await client.persist(key)
      } else {
        await client.expire(key, ttl)
      }
    }

    return { ok: true, key }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update key'
    return { ok: false, key, error: message, connectionLost: isConnectionError(message) }
  } finally {
    client.disconnect()
  }
}

/**
 * Delete a key.
 */
export const deleteKey = async (_prevState: RedisKeyUpdateResult | null, formData: FormData): Promise<RedisKeyUpdateResult> => {
  const key = String(formData.get('key') || '')
  if (!key) return { ok: false, key: '', error: 'Key is required' }

  const state = await getConnectionsState()
  if (!state.activeId) return { ok: false, key, error: 'No active connection' }

  const active = state.connections.find(connection => connection.id === state.activeId)
  if (!active) return { ok: false, key, error: 'Active connection not found' }

  const client = createRedisClient(active, state.activeDb)

  try {
    await client.connect()
    await client.del(key)
    return { ok: true, key }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete key'
    return { ok: false, key, error: message, connectionLost: isConnectionError(message) }
  } finally {
    client.disconnect()
  }
}
