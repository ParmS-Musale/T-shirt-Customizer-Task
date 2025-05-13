'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
// Export the ThemeProvider component from next-themes
// and add the 'use client' directive to indicate that this component
// should be rendered on the client side
// This is necessary because the next-themes library relies on the browser's
// localStorage API to persist the user's theme preference
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
