'use client'

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'

export const queryClient = new QueryClient()

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  )
}
