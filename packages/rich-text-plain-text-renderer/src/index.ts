import { Document, Text, Block, Inline } from '@contentful/rich-text-types';

type NonTextNode = Block | Inline;
type Node = Text | NonTextNode;

/**
 * Returns the text value of a rich text document.
 *
 * NB: This can be applied to any block node of a structured text document,
 * hence the flexible typing.
 */
export function documentToPlainTextString(
  rootRichTextNode: Document | Block,
  blockDivisor: string = ' ',
): string {
  /**
   * Algorithm notes: We only want to apply spacing when a node is part of a
   * sequence. This is tricky because nodes can often be deeply nested within
   * non-semantic content arrays. For example, to get the text value of an
   * unordered list, we have to traverse like so:
   *
   * {
   *   nodeType: BLOCKS.UL_LIST,
   *   content: [
   *     {
   *       nodeType: BLOCKS.LIST_ITEM,
   *       content: [{
   *         nodeType: BLOCKS.PARAGRAPH,
   *         content: [
   *           { nodeType: 'text', value: 'List ', marks: [] },
   *           { nodeType: 'text', value: 'item', marks: [{ type: 'bold' }] }
   *         ]
   *       }]
   *     },
   *     {
   *       nodeType: BLOCKS.OL_LIST,
   *       content: [{
   *         nodeType: BLOCKS.PARAGRAPH,
   *         content: [
   *           { nodeType: 'text', value: 'Another list item', marks: [] }
   *         ]
   *       }]
   *     },
   *     {
   *       nodeType: BLOCKS.HR,
   *       data: {},
   *       content: [],
   *     },
   *     {
   *       nodeType: BLOCKS.OL_LIST,
   *       content: [{
   *         nodeType: BLOCKS.PARAGRAPH,
   *         content: [
   *           { nodeType: 'text', value: 'Yet another list item', marks: [] }
   *         ]
   *       }]
   *     },
   *   }]
   * }
   *
   * We want there to be a space between 'List item' and 'Another list item' (to
   * denote a visual line break, which conventionally appears between non-text
   * node sequences) but not a redundant space between 'List ' and 'item'.
   * Moreover, we want just a _singular_ space between 'Another list item' and
   * 'Yet another list item' - the non-semantic HR between the two nodes should
   * not denote an additional space.
   */
  const childNodeList = (rootRichTextNode as Block).content;
  return childNodeList.reduce((textValue: string, node: Node, i: number): string => {
    const nodeIsText: boolean = isText(node);
    const nodeTextValue: string = nodeIsText
      ? (node as Text).value
      : documentToPlainTextString(node as NonTextNode);
    if (!nodeIsText && !nodeTextValue.length) {
      return textValue;
    } else {
      const nextNode: Node = childNodeList[i + 1];
      const nodeIsInBlockSequence: boolean = nextNode && !isText(nextNode);
      const divisor: string = nodeIsInBlockSequence ? blockDivisor : '';
      return textValue + nodeTextValue + divisor;
    }
  }, '');
}

function isText(node: Node): node is Text {
  return node.nodeType === 'text';
}
