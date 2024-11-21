import type { FullLanguage } from '@repo/i18n'

declare global {
  interface IntlMessages extends FullLanguage {}
}
