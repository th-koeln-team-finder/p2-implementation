'use client'

import { ShortcutTooltip } from '@/components/ShortcutTooltip'
import { LinkForm } from '@/components/WysiwygEditor/LinkForm'
import { useWysiwygStates } from '@/components/WysiwygEditor/wysiwyg.state'
import {
  toggleHeading,
  toggleList,
  toggleQuote,
} from '@/components/WysiwygEditor/wysiwyg.utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Toggle, toggleVariants } from '@/components/ui/toggle'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import type { HeadingTagType } from '@lexical/rich-text'
import { useSignals } from '@preact/signals-react/runtime'
import {
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  PilcrowIcon,
  QuoteIcon,
  RedoIcon,
  UnderlineIcon,
  UndoIcon,
} from 'lucide-react'

type EditorToolbarProps = {
  className?: string
}

export function EditorToolbar({ className }: EditorToolbarProps) {
  useSignals()
  const [editor] = useLexicalComposerContext()
  const editorStates = useWysiwygStates(editor)

  const blockType = editorStates.peek().blockType.value
  const blockTypeSelectValue =
    blockType === 'quote' || blockType === 'bullet' || blockType === 'number'
      ? 'paragraph'
      : blockType

  return (
    <TooltipProvider>
      <div className={cn('flex flex-row items-center gap-1 p-1', className)}>
        <ShortcutTooltip shortcut="Ctrl + Z">
          <Button
            disabled={!editorStates.peek().canUndo.value}
            className={toggleVariants()}
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          >
            <UndoIcon />
          </Button>
        </ShortcutTooltip>
        <ShortcutTooltip shortcut="Ctrl + Y">
          <Button
            disabled={!editorStates.peek().canRedo.value}
            className={toggleVariants()}
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          >
            <RedoIcon />
          </Button>
        </ShortcutTooltip>
        <Separator orientation="vertical" className="self-stretch" />
        <ShortcutTooltip shortcut="Ctrl + B">
          <Toggle
            pressed={editorStates.peek().isBold.value}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          >
            <BoldIcon />
          </Toggle>
        </ShortcutTooltip>
        <ShortcutTooltip shortcut="Ctrl + I">
          <Toggle
            pressed={editorStates.peek().isItalic.value}
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
            }
          >
            <ItalicIcon />
          </Toggle>
        </ShortcutTooltip>
        <ShortcutTooltip shortcut="Ctrl + U">
          <Toggle
            pressed={editorStates.peek().isUnderline.value}
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
            }
          >
            <UnderlineIcon />
          </Toggle>
        </ShortcutTooltip>
        <ShortcutTooltip shortcut="Ctrl + E">
          <Toggle
            pressed={editorStates.peek().isCode.value}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          >
            <CodeIcon />
          </Toggle>
        </ShortcutTooltip>
        <Separator orientation="vertical" className="self-stretch" />
        <Select
          value={blockTypeSelectValue}
          onValueChange={(value) =>
            toggleHeading(editor, value as HeadingTagType)
          }
        >
          <SelectTrigger className="mx-2 w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="h1">
              <div className="flex flex-row items-center gap-1">
                <Heading1Icon />
                <p>Heading 1</p>
              </div>
            </SelectItem>
            <SelectItem value="h2">
              <div className="flex flex-row items-center gap-1">
                <Heading2Icon />
                <p>Heading 2</p>
              </div>
            </SelectItem>
            <SelectItem value="h3">
              <div className="flex flex-row items-center gap-1">
                <Heading3Icon />
                <p>Heading 3</p>
              </div>
            </SelectItem>
            <SelectItem value="h4">
              <div className="flex flex-row items-center gap-1">
                <Heading4Icon />
                <p>Heading 4</p>
              </div>
            </SelectItem>
            <SelectItem value="h5">
              <div className="flex flex-row items-center gap-1">
                <Heading5Icon />
                <p>Heading 5</p>
              </div>
            </SelectItem>
            <SelectItem value="h6">
              <div className="flex flex-row items-center gap-1">
                <Heading6Icon />
                <p>Heading 6</p>
              </div>
            </SelectItem>
            <SelectItem value="paragraph">
              <div className="flex flex-row items-center gap-1">
                <PilcrowIcon />
                <p>Paragraph</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Separator orientation="vertical" className="self-stretch" />
        <ShortcutTooltip shortcut="⇧ + Ctrl + 7">
          <Toggle
            pressed={editorStates.peek().blockType.value === 'number'}
            onClick={() => toggleList(editor, editorStates, 'ordered')}
          >
            <ListOrderedIcon />
          </Toggle>
        </ShortcutTooltip>
        <ShortcutTooltip shortcut="⇧ + Ctrl + 8">
          <Toggle
            pressed={editorStates.peek().blockType.value === 'bullet'}
            onClick={() => toggleList(editor, editorStates, 'unordered')}
          >
            <ListIcon />
          </Toggle>
        </ShortcutTooltip>
        <ShortcutTooltip shortcut="⇧ + Ctrl + 9">
          <Toggle
            pressed={editorStates.peek().blockType.value === 'quote'}
            onClick={() => {
              toggleQuote(editor, editorStates)
            }}
          >
            <QuoteIcon />
          </Toggle>
        </ShortcutTooltip>
        <Popover>
          <PopoverTrigger
            className={toggleVariants()}
            data-state={editorStates.peek().isLink.value ? 'on' : 'off'}
          >
            <LinkIcon />
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <LinkForm
              isEditing={editorStates.peek().isLink.value}
              editor={editor}
            />
          </PopoverContent>
        </Popover>
        <Button
          className={toggleVariants()}
          onClick={() =>
            editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
          }
        >
          <MinusIcon />
        </Button>
        <Separator orientation="vertical" className="self-stretch" />
        <Toggle
          pressed={
            editorStates.peek().elementFormat.value === 'left' ||
            !editorStates.peek().elementFormat.value
          }
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        >
          <AlignLeftIcon />
        </Toggle>
        <Toggle
          pressed={editorStates.peek().elementFormat.value === 'center'}
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
          }
        >
          <AlignCenterIcon />
        </Toggle>
        <Toggle
          pressed={editorStates.peek().elementFormat.value === 'right'}
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
          }
        >
          <AlignRightIcon />
        </Toggle>
        <Toggle
          pressed={editorStates.peek().elementFormat.value === 'justify'}
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
          }
        >
          <AlignJustifyIcon />
        </Toggle>
      </div>
    </TooltipProvider>
  )
}
