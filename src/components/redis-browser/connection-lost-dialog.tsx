'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          {title ? <DialogTitle>{title}</DialogTitle> : null}
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={handleBack}>
            Back to home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
