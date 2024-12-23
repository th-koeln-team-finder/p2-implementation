'use client'

import { WysiwygEditor } from '@repo/design-system/components/WysiwygEditor'

export function LoggingWysiwygEditor() {
  return (
    <WysiwygEditor
      placeholder="Write your description here..."
      onChange={(editorState) =>
        console.log('Changed WYSIWYG', editorState.toJSON())
      }
    />
  )
}
