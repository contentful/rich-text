import { BLOCKS, Document, UnorderedList, ListItem, Text, Node } from '@contentful/rich-text-types';
import { documentToPlainTextString as docToString } from '../../src/index';

/**
 * Implements just a subset of _.times since all we're really doing here is
 * cleanly filling the field with a bunch of junk data.
 */
function times<N extends Node>(n: number, node: N): N[] {
  return new Array(n).fill(node);
}

const richTextField: Document = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: times(8000, {
        nodeType: BLOCKS.UL_LIST,
        data: {},
        content: times(5, {
          nodeType: BLOCKS.LIST_ITEM,
          data: {},
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: times(5, {
                nodeType: 'text',
                data: {},
                marks: [],
                value: 'x',
              }),
            },
          ],
        }),
      }),
    },
  ],
};

export const documentToPlainTextString = () => docToString(richTextField, '');
