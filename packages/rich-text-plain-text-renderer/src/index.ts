import { Block, Inline, Node, helpers, BLOCKS, Document } from '@contentful/rich-text-types';

export interface Options {
  /**
   * Strip empty trailing paragraph from the document
   */
  stripEmptyTrailingParagraph?: boolean;
}

/**
 * Returns the text value of a rich text document.
 *
 * NB: This can be applied to non text node of a structured text document,
 * hence the flexible typing.
 */
export function documentToPlainTextString(
  rootNode: Block | Inline,
  blockDivisor: string = ' ',
  options: Options = {},
): string {
  if (!rootNode || !rootNode.content || !Array.isArray(rootNode.content)) {
    /**
     * Handles edge cases, such as when the value is not set in the CMA or the
     * field has not been properly validated, e.g. because of a user extension.
     * Note that we are nevertheless strictly type-casting `rootNode` as
     * Block | Inline. Valid rich text documents (and their branch block nodes)
     * should never lack a Node[] `content` property.
     */
    return '';
  }

  // Strip empty trailing paragraph if enabled and rootNode is a Document
  let processedRootNode = rootNode;
  if (rootNode.nodeType === BLOCKS.DOCUMENT && options.stripEmptyTrailingParagraph) {
    processedRootNode = helpers.stripEmptyTrailingParagraphFromDocument(rootNode as Document);
  }

  /**
   * Algorithm notes: We only want to apply spacing when a node is part of a
   * sequence. This is tricky because nodes can often be deeply nested within
   * non-semantic content arrays. For example, to get the text value of an
   * unordered list, we have to traverse like so:
   *
   * {
   *   nodeType: BLOCKS.UL_LIST,
   *   data: {},
   *   content: [
   *     {
   *       nodeType: BLOCKS.LIST_ITEM,
   *       data: {},
   *       content: [{
   *         nodeType: BLOCKS.PARAGRAPH,
   *         data: {},
   *         content: [
   *           { nodeType: 'text', data: {}, value: 'List ', marks: [] },
   *           { nodeType: 'text', data: {}, value: 'item', marks: [{ type: 'bold' }] }
   *         ]
   *       }]
   *     },
   *     {
   *       nodeType: BLOCKS.LIST_ITEM,
   *       data: {},
   *       content: [{
   *         nodeType: BLOCKS.PARAGRAPH,
   *         data: {},
   *         content: [
   *           { nodeType: 'text', data: {}, value: 'Another list item', marks: [] }
   *         ]
   *       }]
   *     },
   *     {
   *       nodeType: BLOCKS.LIST_ITEM,
   *       data: {},
   *       content: [{
   *         nodeType: BLOCKS.HR,
   *         data: {},
   *         content: [],
   *       }]
   *     },
   *     {
   *       nodeType: BLOCKS.LIST_ITEM,
   *       data: {},
   *       content: [{
   *         nodeType: BLOCKS.PARAGRAPH,
   *         data:
   *         content: [
   *           { nodeType: 'text', data: {}, value: 'Yet another list item', marks: [] }
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
  return (processedRootNode as Block).content.reduce(
    (acc: string, node: Node, i: number): string => {
      let nodeTextValue: string;

      if (helpers.isText(node)) {
        nodeTextValue = node.value;
      } else if (helpers.isBlock(node) || helpers.isInline(node)) {
        nodeTextValue = documentToPlainTextString(node, blockDivisor, options);
        if (!nodeTextValue.length) {
          return acc;
        }
      }

      const nextNode = processedRootNode.content[i + 1];
      const isNextNodeBlock = nextNode && helpers.isBlock(nextNode);
      const divisor = isNextNodeBlock ? blockDivisor : '';
      return acc + nodeTextValue + divisor;
    },
    '',
  );
}
