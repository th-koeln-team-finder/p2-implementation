import { ThemeProvider, type ThemeProviderProps } from 'next-themes'

type DesignSystemProviderProps = ThemeProviderProps

export const DesignSystemProvider = ({
  children,
  ...props
}: DesignSystemProviderProps) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    {...props}
  >
    {children}
  </ThemeProvider>
)
