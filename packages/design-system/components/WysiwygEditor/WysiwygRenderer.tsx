'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { $getRoot, type EditorState } from 'lexical'
import { initialWysiwygConfig } from '../../components/WysiwygEditor/wysiwyg.config'

type WysiwygRendererProps = {
  className?: string
  value?: EditorState | string
  renderAsString?: boolean
}

export function WysiwygRenderer({
  className,
  value,
  renderAsString,
}: WysiwygRendererProps) {
  return (
    <LexicalComposer
      initialConfig={{
        ...initialWysiwygConfig,
        editorState: value,
        editable: false,
      }}
    >
      {!renderAsString && (
        <RichTextPlugin
          contentEditable={<ContentEditable className={className} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
      )}
      {renderAsString && <LexicalTextContent />}
    </LexicalComposer>
  )
}

function LexicalTextContent({ className }: { className?: string }) {
  const [editor] = useLexicalComposerContext()
  const editorStateTextString = editor.read(() => $getRoot().getTextContent())
  return editorStateTextString.split('\n').map((line, index) => {
    return <p key={index}>{line}</p>
  })
}
