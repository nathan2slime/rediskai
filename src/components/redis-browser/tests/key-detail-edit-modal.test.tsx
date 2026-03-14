import { describe, expect, it, rs } from '@rstest/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { KeyDetailEditModal } from '@/components/redis-browser/key-detail-edit-modal'
import { ThemeProvider } from '@/components/theme/theme-provider'

describe('KeyDetailEditModal', () => {
  it('submits form and triggers delete', async () => {
    const onSubmit = rs.fn()
    const onDelete = rs.fn()

    render(
      <ThemeProvider>
        <KeyDetailEditModal
          isOpen
          onOpenChange={rs.fn()}
          keyName="key:1"
          draftValue="value"
          draftTtl="10"
          setDraftValue={rs.fn()}
          setDraftTtl={rs.fn()}
          onSubmit={onSubmit}
          onDelete={onDelete}
          deletePending={false}
          updatePending={false}
        />
      </ThemeProvider>
    )

    fireEvent.change(screen.getByPlaceholderText(/ttl/i), {
      target: { value: '20' }
    })
    fireEvent.change(screen.getByDisplayValue('value'), {
      target: { value: 'next' }
    })

    const saveButton = screen.getByRole('button', { name: /save/i })
    await waitFor(() => expect(saveButton).not.toBeDisabled())
    fireEvent.click(saveButton)
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
