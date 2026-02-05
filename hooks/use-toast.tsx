"use client"

import * as React from "react"

export type ToastItem = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

type ToastContextValue = {
  toasts: ToastItem[]
  toast: (t: Omit<ToastItem, "id">) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

let counter = 0

export function ToastProviderInternal({
  children,
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const toast = (t: Omit<ToastItem, "id">) => {
    setToasts([{ ...t, id: String(counter++) }])
  }

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) {
    return { toasts: [] }
  }
  return ctx
}
