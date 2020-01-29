import { Document } from './types';
import BLOCKS from './blocks';

/**
 * A rich text document considered to be empty.
 * Any other document structure than this is not considered empty.
 */
const EMPTY_DOCUMENT: Document = {
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

export default EMPTY_DOCUMENT;
