import { render, screen } from '@testing-library/react'

import { KeyList } from '@/components/redis-browser/key-list'

vi.mock('react', async () => {
  const actual = await vi.importActual<any>('react')
  return {
    ...actual,
    useActionState: () => [{ cursor: '0', items: [], done: true }, vi.fn(), false]
  }
})

vi.mock('@/hooks/use-key-list-state', () => ({
  useKeyListState: () => ({
    pattern: '*',
    setPattern: vi.fn(),
    items: [],
    cursor: '0',
    handleSearch: vi.fn(),
    handleLoadMore: vi.fn()
  })
}))

describe('KeyList', () => {
  it('shows empty state when no active connection', () => {
    render(<KeyList activeConnectionId={null} onSelect={vi.fn()} selectedKey={null} />)

    expect(screen.getByText(/select an active connection/i)).toBeInTheDocument()
  })

  it('shows no keys when active connection is set', () => {
    render(<KeyList activeConnectionId="conn-1" onSelect={vi.fn()} selectedKey={null} />)

    expect(screen.getByText(/no keys found/i)).toBeInTheDocument()
  })
})
