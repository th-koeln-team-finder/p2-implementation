'use client'

import { initialWysiwygConfig } from '@/components/WysiwygEditor/wysiwyg.config'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import type { EditorState } from 'lexical'

type WysiwygRendererProps = {
  className?: string
  value?: EditorState | string
}

export function WysiwygRenderer({ className, value }: WysiwygRendererProps) {
  return (
    <LexicalComposer
      initialConfig={{
        ...initialWysiwygConfig,
        editorState: value,
        editable: false,
      }}
    >
      <RichTextPlugin
        contentEditable={<ContentEditable className={className} />}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  )
}
