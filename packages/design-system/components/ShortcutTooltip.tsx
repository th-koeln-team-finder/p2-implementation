import { CommandShortcut } from '@/components/ui/command'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { PropsWithChildren } from 'react'

type ShortcutTooltipProps = {
  shortcut: string
}
export function ShortcutTooltip({
  shortcut,
  children,
}: PropsWithChildren<ShortcutTooltipProps>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* This span is needed, because shadcn has an issue with nested toggles and tooltips (https://github.com/shadcn-ui/ui/issues/4185#issuecomment-2219924023)*/}
        <span>{children}</span>
      </TooltipTrigger>
      <TooltipContent>
        <CommandShortcut className="text-primary-foreground">
          {shortcut}
        </CommandShortcut>
      </TooltipContent>
    </Tooltip>
  )
}
