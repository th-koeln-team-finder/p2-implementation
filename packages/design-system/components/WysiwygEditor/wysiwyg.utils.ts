import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import {
  $createHeadingNode,
  $createQuoteNode,
  type HeadingTagType,
} from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  type LexicalEditor,
} from 'lexical'
import type { WysiwygSignalsState } from '../../components/WysiwygEditor/wysiwyg.signals'

export function toggleHeading(editor: LexicalEditor, level?: HeadingTagType) {
  editor.update(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }

    if (!level) {
      $setBlocksType(selection, $createParagraphNode)
    } else {
      $setBlocksType(selection, () => $createHeadingNode(level))
    }
  })
}

export function toggleQuote(
  editor: LexicalEditor,
  states: WysiwygSignalsState,
) {
  editor.update(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }

    if (states.peek().blockType.peek() === 'quote') {
      $setBlocksType(selection, $createParagraphNode)
    } else {
      $setBlocksType(selection, $createQuoteNode)
    }
  })
}

export function toggleList(
  editor: LexicalEditor,
  states: WysiwygSignalsState,
  listType: 'ordered' | 'unordered',
) {
  editor.update(() => {
    if (listType === 'ordered') {
      states.peek().blockType.value === 'number'
        ? editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        : editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      states.peek().blockType.value === 'bullet'
        ? editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        : editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    }
  })
}
