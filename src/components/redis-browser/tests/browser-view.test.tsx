import { describe, expect, it, rs } from '@rstest/core'
import { fireEvent, render, screen } from '@testing-library/react'

import { BrowserView } from '@/components/redis-browser/browser-view'

type KeyListProps = {
  onSelect: (key: string) => void
  selectedKey: string | null
  onConnectionLost?: (message: string) => void
}

type KeyDetailPanelProps = {
  selectedKey: string | null
  onConnectionLost?: (message: string) => void
}

rs.mock('next/navigation', () => ({
  useRouter: () => ({
    push: rs.fn(),
    refresh: rs.fn()
  })
}))

rs.mock('@/components/redis-browser/key-list', () => ({
  KeyList: ({ onSelect, selectedKey }: KeyListProps) => (
    <div>
      <button onClick={() => onSelect('key:1')} type="button">
        select key
      </button>
      <span data-testid="selected-key-list">{selectedKey ?? 'none'}</span>
    </div>
  )
}))

rs.mock('@/components/redis-browser/key-detail-panel', () => ({
  KeyDetailPanel: ({ selectedKey }: KeyDetailPanelProps) => <p data-testid="selected-key-detail">{selectedKey ?? 'none'}</p>
}))

describe('BrowserView', () => {
  it('updates selected key across list and detail panel', () => {
    render(<BrowserView activeConnectionId="conn-1" />)

    expect(screen.getByTestId('selected-key-list')).toHaveTextContent('none')
    expect(screen.getByTestId('selected-key-detail')).toHaveTextContent('none')

    fireEvent.click(screen.getByRole('button', { name: /select key/i }))

    expect(screen.getByTestId('selected-key-list')).toHaveTextContent('key:1')
    expect(screen.getByTestId('selected-key-detail')).toHaveTextContent('key:1')
  })

  it('resets selected key when active connection changes', () => {
    const { rerender } = render(<BrowserView activeConnectionId="conn-1" />)

    fireEvent.click(screen.getByRole('button', { name: /select key/i }))
    expect(screen.getByTestId('selected-key-detail')).toHaveTextContent('key:1')

    rerender(<BrowserView activeConnectionId="conn-2" />)
    expect(screen.getByTestId('selected-key-detail')).toHaveTextContent('none')
  })
})
