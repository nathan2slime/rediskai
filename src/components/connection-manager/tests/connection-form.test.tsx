import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ConnectionForm } from '@/components/connection-manager/connection-form'
import type { ActionResult } from '@/types/connections'

const okState: ActionResult = { ok: true }

describe('ConnectionForm', () => {
  it('submits valid data and calls actions', async () => {
    const addAction = vi.fn()
    const closeAction = vi.fn()

    render(<ConnectionForm addAction={addAction} addPending={false} addState={okState} closeAction={closeAction} />)

    fireEvent.change(screen.getByPlaceholderText(/connection name/i), {
      target: { value: 'Local' }
    })
    fireEvent.change(screen.getByPlaceholderText(/redis:\/\/localhost/i), {
      target: { value: 'redis://localhost:6379' }
    })

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    await waitFor(() => {
      expect(addAction).toHaveBeenCalledTimes(1)
      expect(closeAction).toHaveBeenCalledTimes(1)
    })
  })

  it('does not submit when required fields are missing', () => {
    const addAction = vi.fn()
    const closeAction = vi.fn()

    render(<ConnectionForm addAction={addAction} addPending={false} addState={okState} closeAction={closeAction} />)

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    expect(addAction).not.toHaveBeenCalled()
    expect(closeAction).not.toHaveBeenCalled()
  })
})
