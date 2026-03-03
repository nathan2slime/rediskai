import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { KeyDetailEditModal } from '@/components/redis-browser/key-detail-edit-modal'

describe('KeyDetailEditModal', () => {
  it('submits form and triggers delete', async () => {
    const onSubmit = vi.fn()
    const onDelete = vi.fn()

    render(
      <KeyDetailEditModal
        isOpen
        onOpenChange={vi.fn()}
        keyName="key:1"
        draftValue="value"
        draftTtl="10"
        setDraftValue={vi.fn()}
        setDraftTtl={vi.fn()}
        onSubmit={onSubmit}
        onDelete={onDelete}
        deletePending={false}
        updatePending={false}
      />
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
