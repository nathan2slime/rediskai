import { act, renderHook } from '@testing-library/react'

import { useBrowserSelection } from '@/hooks/use-browser-selection'

describe('useBrowserSelection', () => {
  it('resets selected key when active connection changes', () => {
    const { result, rerender } = renderHook(({ activeConnectionId }) => useBrowserSelection({ activeConnectionId }), {
      initialProps: {
        activeConnectionId: 'conn-1'
      }
    })

    act(() => {
      result.current.setSelectedKey('user:1')
    })

    expect(result.current.selectedKey).toBe('user:1')

    rerender({ activeConnectionId: 'conn-2' })

    expect(result.current.selectedKey).toBeNull()
  })
})
