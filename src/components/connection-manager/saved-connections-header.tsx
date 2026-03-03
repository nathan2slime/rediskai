import { Plus } from '@gravity-ui/icons'
import { Button, Icon, Text } from '@gravity-ui/uikit'

type Props = {
  setIsAddModalOpen: (open: boolean) => void
}

/**
 * Title and subtitle for the saved connections card.
 * @example
 * <SavedConnectionsHeader />
 */
export const SavedConnectionsHeader = ({ setIsAddModalOpen }: Props) => {
  return (
    <div className="items-start flex justify-between mb-4">
      <div className="flex flex-col">
        <Text as="h3" variant="header-1">
          Connections
        </Text>
        <Text as="p" className="text-sm text-muted-foreground">
          Mark one active, test ping, and remove when needed
        </Text>
      </div>

      <Button pin="round-round" className="absolute right-0 top-0" view="action" size="m" onClick={() => setIsAddModalOpen(true)}>
        <Icon data={Plus} />
        Create
      </Button>
    </div>
  )
}
