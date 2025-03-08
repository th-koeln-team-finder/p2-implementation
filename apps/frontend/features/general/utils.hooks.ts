import { useCallback, useEffect, useRef, useState } from 'react'

export function useDebouncedValue<T>(value: T, debounceTimeout = 300) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const [isDebouncing, setIsDebouncing] = useState(false)

  const clearDebounce = useCallback(() => {
    if (!debounceRef.current) return
    clearTimeout(debounceRef.current)
  }, [])

  useEffect(() => {
    if (debouncedValue === value) return clearDebounce
    setIsDebouncing(true)
    clearDebounce()
    debounceRef.current = setTimeout(() => {
      setDebouncedValue(value)
      setIsDebouncing(false)
    }, debounceTimeout)

    return clearDebounce
  }, [value, debouncedValue, clearDebounce, debounceTimeout])

  return [debouncedValue, isDebouncing] as const
}

// biome-ignore lint/suspicious/noExplicitAny: Here it really does not matter what the input is, since the input is just forwarded to the function
export function useDebounceFunction<T extends (...args: any[]) => any>(
  func: T,
  debounceTimeout = 300,
) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const [isDebouncing, setIsDebouncing] = useState(false)

  const clearDebounce = useCallback(() => {
    if (!debounceRef.current) return
    clearTimeout(debounceRef.current)
  }, [])

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      setIsDebouncing(true)
      clearDebounce()
      debounceRef.current = setTimeout(async () => {
        const res = func(...args)
        if (res instanceof Promise) await res
        setIsDebouncing(false)
      }, debounceTimeout)
    },
    [func, debounceTimeout, clearDebounce],
  )

  return [debouncedFunction, isDebouncing] as const
}
