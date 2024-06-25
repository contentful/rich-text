import { BLOCKS } from './blocks';
import { Document } from './types';

/**
 * A rich text document considered to be empty.
 * Any other document structure than this is not considered empty.
 */
export const EMPTY_DOCUMENT: Document = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: '',
          marks: [],
          data: {},
        },
      ],
    },
  ],
};
