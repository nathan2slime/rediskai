import { toaster } from '@gravity-ui/uikit/toaster-singleton'

const getToastId = () => (globalThis.crypto && 'randomUUID' in globalThis.crypto && globalThis.crypto.randomUUID()) || `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`

export const notifyError = (message: string) => {
  toaster.add({
    name: getToastId(),
    content: message,
    title: 'Error',
    theme: 'danger',
    isClosable: true
  })
}

export const notifySuccess = (message: string) => {
  toaster.add({
    name: getToastId(),
    content: message,
    title: 'Success',
    theme: 'success',
    isClosable: true
  })
}

export { toaster }
