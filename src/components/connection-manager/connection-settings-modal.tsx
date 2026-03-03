'use client'

import { Pencil, TrashBin, Xmark } from '@gravity-ui/icons'
import { Button, Divider, Icon, Modal, Text, TextInput } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

type ConnectionSettingsModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  connectionId: string
  name: string
  onNameChange: (value: string) => void
  renameAction: (formData: FormData) => void
  deleteAction: (formData: FormData) => void
}

const connectionSettingsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required')
})

type ConnectionSettingsValues = z.infer<typeof connectionSettingsSchema>

/**
 * Modal for editing or deleting a connection.
 * @example
 * <ConnectionSettingsModal isOpen={open} onOpenChange={setOpen} connectionId="id" name="Local" onNameChange={setName} renameAction={rename} deleteAction={remove} />
 */
export const ConnectionSettingsModal = ({ isOpen, onOpenChange, connectionId, name, onNameChange, renameAction, deleteAction }: ConnectionSettingsModalProps) => {
  const renameFormId = `rename-${connectionId}`
  const deleteFormId = `delete-${connectionId}`
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<ConnectionSettingsValues>({
    resolver: zodResolver(connectionSettingsSchema),
    mode: 'onChange',
    defaultValues: { name }
  })
  const [isTransitionPending, startTransition] = useTransition()

  useEffect(() => {
    reset({ name })
  }, [name, reset])

  const handleRename = handleSubmit(values => {
    const formData = new FormData()
    formData.set('id', connectionId)
    formData.set('name', values.name)
    onNameChange(values.name)
    startTransition(() => {
      renameAction(formData)
    })
  })

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange} contentClassName="p-4 w-[min(520px,92vw)]!">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Text as="p" variant="body-3">
            Manage
          </Text>
          <Button type="button" view="flat" size="s" onClick={() => onOpenChange(false)}>
            <Icon data={Xmark} size={14} />
          </Button>
        </div>
        <Divider className="mb-2" />

        <form id={renameFormId} onSubmit={handleRename} className="space-y-3">
          <Controller
            control={control}
            name="name"
            render={({ field }) => {
              const { ref, onChange, ...inputField } = field

              return (
                <TextInput
                  {...inputField}
                  error={Boolean(errors.name?.message)}
                  errorMessage={errors.name?.message}
                  validationState={errors.name?.message ? 'invalid' : undefined}
                  controlRef={ref}
                  onUpdate={onChange}
                />
              )
            }}
          />
        </form>

        <form id={deleteFormId} action={deleteAction} className="hidden">
          <input type="hidden" name="id" value={connectionId} />
        </form>

        <div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button type="submit" view="outlined-danger" form={deleteFormId}>
              <Icon data={TrashBin} size={15} />
              Delete
            </Button>
            <Button type="submit" view="action" form={renameFormId} disabled={!isValid} loading={isTransitionPending}>
              <Icon data={Pencil} size={15} />
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
