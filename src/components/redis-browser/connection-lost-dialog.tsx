'use client'

import { useRouter } from 'next/navigation'

import { Button, Divider, Modal, Text } from '@gravity-ui/uikit'

export type ConnectionLostDialogProps = {
  open: boolean
  title?: string
  description?: string
  redirectTo?: string
}

export const ConnectionLostDialog = ({ open, title, description, redirectTo = '/' }: ConnectionLostDialogProps) => {
  const router = useRouter()

  const handleBack = () => {
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <Modal open={open} onOpenChange={() => null} contentClassName="p-4 w-[min(520px,92vw)]!">
      <div className="space-y-4">
        <div className="space-y-2">
          {title ? (
            <Text as="h3" variant="header-1">
              {title}
            </Text>
          ) : null}
          {description ? (
            <Text as="p" className="text-sm text-muted-foreground">
              {description}
            </Text>
          ) : null}
        </div>
        <Divider />
        <div className="flex justify-end">
          <Button type="button" view="action" onClick={handleBack}>
            Back to home
          </Button>
        </div>
      </div>
    </Modal>
  )
}
