import {
  toggleList,
  toggleQuote,
} from '@/components/WysiwygEditor/wysiwyg.utils'
import {
  type SignalifiedData,
  deepSignalifyValue,
} from '@formsignals/form-core'
import { $isLinkNode } from '@lexical/link'
import { $isListNode, ListNode } from '@lexical/list'
import { $isHeadingNode } from '@lexical/rich-text'
import { $isAtNodeEnd } from '@lexical/selection'
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils'
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  type ElementFormatType,
  type ElementNode,
  FORMAT_TEXT_COMMAND,
  KEY_DOWN_COMMAND,
  type LexicalEditor,
  type RangeSelection,
  SELECTION_CHANGE_COMMAND,
  type TextFormatType,
  type TextNode,
} from 'lexical'
import { useCallback, useEffect, useMemo } from 'react'

export const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
}

const WysiwygStateInitial = {
  blockType: 'paragraph' as keyof typeof blockTypeToBlockName,
  canRedo: false,
  canUndo: false,
  elementFormat: 'left' as ElementFormatType,
  isBold: false,
  isCode: false,
  isItalic: false,
  isLink: false,
  isSubscript: false,
  isSuperscript: false,
  isUnderline: false,
  isLowercase: false,
  isUppercase: false,
  isCapitalize: false,
}
export type WysiwygState = SignalifiedData<typeof WysiwygStateInitial>

// Inspired by https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx#L469
export function useWysiwygStates(editor: LexicalEditor) {
  const states = useMemo(() => deepSignalifyValue(WysiwygStateInitial), [])

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }
    const anchorNode = selection.anchor.getNode()
    let element =
      anchorNode.getKey() === 'root'
        ? anchorNode
        : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent()
            return (
              parent !== null &&
              ($isRootNode(parent) ||
                ($isElementNode(parent) && parent.isShadowRoot()))
            )
          })
    if (element === null) {
      element = anchorNode.getTopLevelElementOrThrow()
    }

    const elementKey = element.getKey()
    const elementDOM = editor.getElementByKey(elementKey)

    // Update links
    const node = getSelectedNode(selection)
    const parent = node.getParent()
    states.peek().isLink.value = $isLinkNode(parent) || $isLinkNode(node)

    if (elementDOM !== null) {
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
        const type = parentList
          ? parentList.getListType()
          : element.getListType()

        states.peek().blockType.value = type
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType()
        if (type in blockTypeToBlockName) {
          states.peek().blockType.value =
            type as keyof typeof blockTypeToBlockName
        }
      }
    }
    let matchingParent
    if ($isLinkNode(parent)) {
      // If node is a link, we need to fetch the parent paragraph node to set format
      matchingParent = $findMatchingParent(
        node,
        (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
      )
    }

    // If matchingParent is a valid node, pass it's format type
    states.peek().elementFormat.value = $isElementNode(matchingParent)
      ? matchingParent.getFormatType()
      : $isElementNode(node)
        ? node.getFormatType()
        : parent?.getFormatType() || 'left'

    // Update text format
    states.peek().isBold.value = selection.hasFormat('bold')
    states.peek().isItalic.value = selection.hasFormat('italic')
    states.peek().isUnderline.value = selection.hasFormat('underline')
    states.peek().isSubscript.value = selection.hasFormat('subscript')
    states.peek().isSuperscript.value = selection.hasFormat('superscript')
    states.peek().isCode.value = selection.hasFormat('code')
    states.peek().isLowercase.value = selection.hasFormat(
      'lowercase' as TextFormatType,
    )
    states.peek().isUppercase.value = selection.hasFormat(
      'uppercase' as TextFormatType,
    )
    states.peek().isCapitalize.value = selection.hasFormat(
      'capitalize' as TextFormatType,
    )
  }, [states])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => $updateToolbar())
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar()
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          states.peek().canUndo.value = payload
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          states.peek().canRedo.value = payload
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) {
            return false
          }
          const node = selection.anchor.getNode()
          const linkNode = $findMatchingParent(node, $isLinkNode)
          if (
            !($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey))
          ) {
            return false
          }

          window.open(linkNode.getURL(), '_blank')
          return true
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DOWN_COMMAND,
        (event) => {
          if (!event.ctrlKey) {
            return false
          }

          if (!event.shiftKey) {
            if (event.key === 'e') {
              event.preventDefault()
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
              return true
            }
            return false
          }

          switch (event.code) {
            case 'Digit7':
              event.preventDefault()
              toggleList(editor, states, 'ordered')
              return true
            case 'Digit8':
              event.preventDefault()
              toggleList(editor, states, 'unordered')
              return true
            case 'Digit9':
              event.preventDefault()
              toggleQuote(editor, states)
              return true
            default:
              return false
          }
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, $updateToolbar])

  return states
}

export function getSelectedNode(
  selection: RangeSelection,
): TextNode | ElementNode {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  }
  return $isAtNodeEnd(anchor) ? anchorNode : focusNode
}
