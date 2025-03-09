'use client'

import { Link, usePathname } from '@/features/i18n/routing'
import { buttonVariants } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'flex space-x-2 overflow-x-auto lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'flex flex-1 justify-center lg:justify-start',
          )}
        >
          {item.icon}
          <span className="text-xs lg:text-sm">{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
