import { Link } from '@/features/i18n/routing'
import { ExternalLinkIcon } from 'lucide-react'

type ExternalLinkProps = {
  href: string
  label?: string
}

export function ExternalLink({ href, label }: ExternalLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex flex-row items-center gap-1 text-primary underline underline-offset-2"
    >
      <ExternalLinkIcon className="size-4" />
      {label ?? href}
    </Link>
  )
}
