"use client"

import * as React from "react"

export function Toast({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="rounded-md border bg-background p-4 shadow">
      {children}
    </div>
  )
}

export function ToastTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="font-medium">{children}</div>
}

export function ToastDescription({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="text-sm opacity-80">{children}</div>
}

export function ToastClose() {
  return null
}

export function ToastViewport() {
  return null
}

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
