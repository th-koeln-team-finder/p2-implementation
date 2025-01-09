'use client'

// @ts-ignore
import { useFieldContext } from '@formsignals/form-react'
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { SelectionAlwaysOnDisplay } from '@lexical/react/LexicalSelectionAlwaysOnDisplay'
// biome-ignore lint/style/useImportType: <explanation>
import { $getRoot, EditorState, LexicalEditor } from 'lexical'
// biome-ignore lint/style/useImportType: <explanation>
import { MutableRefObject, useMemo, useRef } from 'react'
import { EditorToolbar } from '../../components/WysiwygEditor/EditorToolbar'
import { initialWysiwygConfig } from '../../components/WysiwygEditor/wysiwyg.config'
import { URL_MATCHERS } from '../../components/WysiwygEditor/wysiwyg.urls'
import { cn } from '../../lib/utils'

type WysiwygEditorProps = {
  className?: string
  placeholder?: string
  defaultValue?: EditorState
  onChange?: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
  ) => void
  editorRef?: MutableRefObject<LexicalEditor | undefined | null>
}

export function useLexicalEditorRef() {
  return useRef<LexicalEditor>()
}

export type LexicalEditorRef = ReturnType<typeof useLexicalEditorRef>

export function getStringContentFromEditor(editor?: LexicalEditor) {
  return editor
    ? editor.getEditorState().read(() => {
        return $getRoot().getTextContent()
      })
    : ''
}

// TODO Edit Links + Context Menu + subscript + superscript
// For more features, check out: https://github.com/facebook/lexical/tree/main/packages/lexical-playground
export function WysiwygEditor({
  className,
  placeholder,
  defaultValue,
  onChange,
  editorRef,
}: WysiwygEditorProps) {
  const initialConfig = useMemo(
    () => ({ ...initialWysiwygConfig, editorState: defaultValue || undefined }),
    [defaultValue],
  )
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorToolbar />
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={cn(
                'relative z-10 min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                className,
              )}
            />
          }
          placeholder={
            placeholder ? (
              <p className="pointer-events-none absolute top-1 left-3 text-muted-foreground">
                {placeholder}
              </p>
            ) : undefined
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      {onChange && <OnChangePlugin onChange={onChange} />}
      {editorRef && (
        <EditorRefPlugin
          editorRef={(newRef) => {
            editorRef.current = newRef
          }}
        />
      )}
      <HistoryPlugin />
      <MarkdownShortcutPlugin />
      <SelectionAlwaysOnDisplay />
      <ListPlugin />
      <LinkPlugin />
      <AutoLinkPlugin matchers={URL_MATCHERS} />
      <HorizontalRulePlugin />
    </LexicalComposer>
  )
}

export function WysiwygEditorForm(
  props: Omit<WysiwygEditorProps, 'defaultValue'>,
) {
  const field = useFieldContext()
  return (
    <WysiwygEditor
      defaultValue={field.data.value}
      onChange={(state) => field.handleChange(JSON.stringify(state.toJSON()))}
      {...props}
    />
  )
}
