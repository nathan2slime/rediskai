import { render, screen } from '@testing-library/react'

import { SavedConnections } from '@/components/connection-manager/saved-connections'
import type { ConnectionsState } from '@/types/connections'

vi.mock('@/components/connection-manager/connection-card', () => ({
  ConnectionCard: ({ connection }: { connection: { id: string } }) => <div data-testid="connection-card">{connection.id}</div>
}))

const baseState: ConnectionsState = {
  activeId: null,
  activeDb: 0,
  connections: []
}

const noopFormAction = (_formData: FormData) => {}
const noopTestAction = async (_id: string) => {}

describe('SavedConnections', () => {
  it('shows empty state when there are no connections', () => {
    render(
      <SavedConnections
        state={baseState}
        pendingTestId={null}
        setActiveAction={noopFormAction}
        setDatabaseAction={noopFormAction}
        renameAction={noopFormAction}
        testAction={noopTestAction}
        deleteAction={noopFormAction}
        openBrowserAction={noopFormAction}
      />
    )

    expect(screen.getByText('No connections saved yet.')).toBeInTheDocument()
  })

  it('renders one card per connection', () => {
    render(
      <SavedConnections
        state={{
          ...baseState,
          connections: [
            {
              id: '1',
              name: 'Local',
              url: 'redis://localhost:6379',
              createdAt: new Date('2026-01-01').toISOString()
            },
            {
              id: '2',
              name: 'Staging',
              url: 'redis://staging:6379',
              createdAt: new Date('2026-01-02').toISOString()
            }
          ]
        }}
        pendingTestId={null}
        setActiveAction={noopFormAction}
        setDatabaseAction={noopFormAction}
        renameAction={noopFormAction}
        testAction={noopTestAction}
        deleteAction={noopFormAction}
        openBrowserAction={noopFormAction}
      />
    )

    expect(screen.getAllByTestId('connection-card')).toHaveLength(2)
  })
})
