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
