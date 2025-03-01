// biome-ignore lint/suspicious/noExplicitAny: any is needed here because the data can be anything
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  timeout: number,
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}
