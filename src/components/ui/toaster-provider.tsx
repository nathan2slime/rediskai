'use client'

import { ToasterProvider as GravityToasterProvider, ToasterComponent } from '@gravity-ui/uikit'
import type { PropsWithChildren } from 'react'

import { toaster } from '@/lib/toaster'

export const ToasterProvider = ({ children }: PropsWithChildren) => {
  return (
    <GravityToasterProvider toaster={toaster}>
      {children}
      <ToasterComponent className="shadow-none" />
    </GravityToasterProvider>
  )
}
