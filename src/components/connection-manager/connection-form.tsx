import { Plus } from '@gravity-ui/icons'
import { Button, Icon, Text, TextInput } from '@gravity-ui/uikit'

import type { ConnectionFormProps } from '@/types/connection-manager'

/**
 * Form used to add a new connection.
 * @example
 * <ConnectionForm addAction={action} addPending={false} />
 */
export const ConnectionForm = ({ addAction, addPending, addError }: ConnectionFormProps) => {
  return (
    <div className="space-y-4">
      <form action={addAction} className="space-y-2">
        <div className="space-y-1">
          <TextInput name="name" placeholder="Connection name" />
          <TextInput name="url" placeholder="redis://localhost:6379" />
          {addError ? (
            <Text className="text-xs" color="danger-heavy">
              {addError}
            </Text>
          ) : null}
        </div>
        <Button loading={addPending} type="submit" view="action" size="m">
          Add
          <Icon data={Plus} size={15} />
        </Button>
      </form>
    </div>
  )
}
