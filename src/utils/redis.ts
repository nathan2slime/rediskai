import Redis from 'ioredis'

import type { Connection } from '@/types/connections'

/**
 * Build a Redis client for a specific connection and DB.
 * @property {Connection} connection - Connection metadata.
 * @property {number} db - Database index.
 * @example
 * const client = createRedisClient(connection, 0)
 */
export const createRedisClient = (connection: Connection, db: number) => {
  return new Redis(connection.url, {
    lazyConnect: true,
    connectTimeout: 3000,
    maxRetriesPerRequest: 0,
    enableReadyCheck: true,
    db
  })
}
