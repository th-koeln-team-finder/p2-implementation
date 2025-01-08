import { ExternalLink } from '@/features/brainstorm/components/brainstorm-details/ExternalLink'

type BrainstormLinksResourcesProps = {
  links: Array<{ href: string; label?: string }>
}

export function BrainstormLinksResources({
  links,
}: BrainstormLinksResourcesProps) {
  return (
    <ul>
      {links.map((link) => (
        <li key={link.href}>
          <ExternalLink href={link.href} label={link.label} />
        </li>
      ))}
    </ul>
  )
}
