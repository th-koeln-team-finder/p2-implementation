'use client'

import { FieldError } from '@/components/FormErrors'
import { getSelectedNode } from '@/components/WysiwygEditor/wysiwyg.state'
import { sanitizeUrl } from '@/components/WysiwygEditor/wysiwyg.urls'
import { Button } from '@/components/ui/button'
import { CheckboxForm } from '@/components/ui/checkbox'
import { InputForm } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from '@formsignals/form-react'
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link'
import { $findMatchingParent } from '@lexical/utils'
import { useSignals } from '@preact/signals-react/runtime'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { $getSelection, $isRangeSelection, type LexicalEditor } from 'lexical'
import { LinkIcon, UnlinkIcon } from 'lucide-react'
import { useEffect } from 'react'
import { z } from 'zod'

type LinkFormProps = {
  editor: LexicalEditor
  isEditing?: boolean
}

export function LinkForm({ editor, isEditing }: LinkFormProps) {
  useSignals()

  const form = useForm({
    validatorAdapter: ZodAdapter,
    defaultValues: {
      url: sanitizeUrl('https://'),
      openInNewTab: false,
    },
    onSubmit: (values: { url: string; openInNewTab: boolean }) => {
      editor.update(() => {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
          url: sanitizeUrl(values.url),
          target: values.openInNewTab ? '_blank' : null,
        })
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) {
          return
        }

        const parent = getSelectedNode(selection).getParent()
        if (!$isAutoLinkNode(parent)) {
          return
        }

        const linkNode = $createLinkNode(parent.getURL(), {
          rel: parent.__rel,
          target: parent.__target,
          title: parent.__title,
        })
        parent.replace(linkNode, true)
      })
    },
  })

  useEffect(() => {
    editor.read(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) {
        return
      }
      const node = getSelectedNode(selection)
      const linkParent = $findMatchingParent(node, $isLinkNode)

      if (linkParent) {
        form.handleChange('url', linkParent.getURL())
        form.handleChange('openInNewTab', linkParent.getTarget() === '_blank')
      } else if ($isLinkNode(node)) {
        form.handleChange('url', node.getURL())
        form.handleChange('openInNewTab', node.getTarget() === '_blank')
      } else {
        form.handleChange('url', sanitizeUrl('https://'))
        form.handleChange('openInNewTab', false)
      }
    })
  }, [editor])

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        await form.handleSubmit()
        form.reset()
      }}
    >
      <form.FieldProvider name="url" validator={z.string().url().min(1)}>
        <div className="grid gap-2">
          <Label htmlFor="url">URL</Label>
          <InputForm id="url" autoFocus />
          <FieldError />
        </div>
      </form.FieldProvider>
      <form.FieldProvider
        name="openInNewTab"
        transformFromBinding={(value: CheckedState) => !!value}
      >
        <Label className="flex flex-row items-center gap-1">
          <CheckboxForm name="openInNewTab" />
          Open in new tab
        </Label>
      </form.FieldProvider>
      <div className="flex flex-row gap-2">
        {isEditing && (
          <Button
            type="button"
            className="flex-1"
            variant="destructive"
            onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)}
          >
            <UnlinkIcon />
            Break
          </Button>
        )}
        <Button type="submit" className="flex-1">
          <LinkIcon />
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
