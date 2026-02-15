import { BrowserView } from '@/components/redis-browser'
import type { RedisBrowserPanelProps } from '@/types/redis-browser'

/**
 * Container for the Redis key browser.
 * @example
 * <RedisBrowserPanel activeConnectionId={state.activeId} />
 */
export const RedisBrowserPanel = ({ activeConnectionId }: RedisBrowserPanelProps) => {
  return <BrowserView activeConnectionId={activeConnectionId} />
}
