import { describe, expect, it, rs } from '@rstest/core'
import { render, screen } from '@testing-library/react'
import * as React from 'react'

import { KeyList } from '@/components/redis-browser/key-list'

rs.mock('@/hooks/use-key-list-state', () => ({
  useKeyListState: () => ({
    pattern: '*',
    setPattern: rs.fn(),
    items: [],
    cursor: '0',
    handleSearch: rs.fn(),
    handleLoadMore: rs.fn()
  })
}))

describe('KeyList', () => {
  rs.spyOn(React, 'useActionState').mockImplementation(() => [{ cursor: '0', items: [], done: true }, rs.fn(), false] as any)

  it('shows empty state when no active connection', () => {
    render(<KeyList activeConnectionId={null} onSelect={rs.fn()} selectedKey={null} />)

    expect(screen.getByText(/select an active connection/i)).toBeInTheDocument()
  })

  it('shows no keys when active connection is set', () => {
    render(<KeyList activeConnectionId="conn-1" onSelect={rs.fn()} selectedKey={null} />)

    expect(screen.getByText(/no keys found/i)).toBeInTheDocument()
  })
})
