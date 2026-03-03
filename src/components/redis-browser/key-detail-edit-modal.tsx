'use client'

import { Pencil, TrashBin, Xmark } from '@gravity-ui/icons'
import { Button, Divider, Icon, Modal, Text, TextInput } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

type KeyDetailEditModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  keyName: string
  draftValue: string
  draftTtl: string
  setDraftValue: (value: string) => void
  setDraftTtl: (value: string) => void
  onSubmit: (formData: FormData) => void
  onDelete: () => void
  deletePending: boolean
  updatePending: boolean
}

const editSchema = z.object({
  ttl: z.string().trim(),
  value: z.string()
})

type EditValues = z.infer<typeof editSchema>

/**
 * Modal for editing a key value and TTL.
 */
export const KeyDetailEditModal = ({
  isOpen,
  onOpenChange,
  keyName,
  draftValue,
  draftTtl,
  setDraftValue,
  setDraftTtl,
  onSubmit,
  onDelete,
  deletePending,
  updatePending
}: KeyDetailEditModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid }
  } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    mode: 'onChange',
    defaultValues: { ttl: draftTtl, value: draftValue }
  })
  const [isTransitionPending, startTransition] = useTransition()

  useEffect(() => {
    reset({ ttl: draftTtl, value: draftValue })
  }, [draftTtl, draftValue, reset])

  const handleSave = handleSubmit(values => {
    const formData = new FormData()
    formData.set('key', keyName)
    formData.set('ttl', values.ttl)
    formData.set('value', values.value)
    setDraftTtl(values.ttl)
    setDraftValue(values.value)
    startTransition(() => {
      onSubmit(formData)
    })
  })

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange} contentClassName="p-4 w-[min(560px,92vw)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Text as="p" variant="body-3">
            Edit value
          </Text>
          <Button type="button" view="flat" size="s" onClick={() => onOpenChange(false)}>
            <Icon data={Xmark} size={14} />
          </Button>
        </div>
        <Divider />
        <form id="key-detail-edit-form" onSubmit={handleSave} className="space-y-3">
          <Controller
            control={control}
            name="ttl"
            render={({ field }) => {
              const { ref, onChange, ...inputField } = field

              return (
                <TextInput
                  {...inputField}
                  placeholder="TTL (seconds, 0=persist)"
                  label="TTL"
                  controlRef={ref}
                  onUpdate={value => {
                    onChange(value)
                    setDraftTtl(value)
                  }}
                />
              )
            }}
          />
          <Controller
            control={control}
            name="value"
            render={({ field }) => {
              const { ref, onChange, ...inputField } = field

              return (
                <TextInput
                  {...inputField}
                  label="Value"
                  controlRef={ref}
                  onUpdate={value => {
                    onChange(value)
                    setDraftValue(value)
                  }}
                />
              )
            }}
          />
        </form>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button type="button" view="outlined-danger" onClick={onDelete} disabled={deletePending}>
            <Icon data={TrashBin} size={15} />
            {deletePending ? 'Deleting...' : 'Delete'}
          </Button>
          <Button type="submit" view="action" form="key-detail-edit-form" disabled={!isValid} loading={updatePending || isTransitionPending}>
            <Icon data={Pencil} size={15} />
            {updatePending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
