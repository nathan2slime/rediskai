import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { ConnectionFormProps } from '@/types/connection-manager'

/**
 * Form used to add a new connection.
 * @example
 * <ConnectionForm addAction={action} addPending={false} />
 */
export const ConnectionForm = ({ addAction, addPending, addError }: ConnectionFormProps) => {
  return (
    <CardContent className="space-y-4">
      <form action={addAction} className="space-y-3">
        <Input name="name" placeholder="Connection name" required />
        <Input name="url" placeholder="redis://localhost:6379" required />
        {addError ? <p className="text-sm text-destructive">{addError}</p> : null}
        <Button type="submit" disabled={addPending} size="sm">
          <Plus className="size-4" />
          {addPending ? 'Saving...' : 'Add'}
        </Button>
      </form>
    </CardContent>
  )
}
