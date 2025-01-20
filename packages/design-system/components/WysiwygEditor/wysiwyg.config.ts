import { CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import type { InitialConfigType } from '@lexical/react/LexicalComposer'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import type { EditorThemeClasses } from 'lexical'

const theme: EditorThemeClasses = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    code: 'font-mono bg-muted text-foreground py-0.5 px-2 rounded',
  },
  heading: {
    h1: 'text-3xl font-bold mb-2',
    h2: 'text-2xl font-semibold mb-2',
    h3: 'text-xl font-medium mb-2',
    h4: 'text-lg font-medium mb-2',
    h5: 'text-base font-medium mb-2',
    h6: 'text-sm font-medium mb-2',
  },
  paragraph: 'mb-1',
  hr: 'border-t border-border mt-4 mb-4',
  list: {
    nested: {
      listitem: 'pl-6',
    },
    ol: 'list-decimal pl-6',
    ul: 'list-disc pl-6',
    listitem: 'mb-1',
  },
  quote:
    'border-l-4 border-muted-foreground bg-muted pl-4 italic text-foreground',
  link: 'text-primary underline cursor-pointer',
}

export const initialWysiwygConfig: InitialConfigType = {
  namespace: 'collaborize',
  theme,
  nodes: [
    HorizontalRuleNode,
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    AutoLinkNode,
    LinkNode,
    CodeNode,
  ],
  onError: (error) => console.error('WysiwygEditor error', error),
}
