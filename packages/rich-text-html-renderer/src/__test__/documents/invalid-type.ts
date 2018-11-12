import { Document, BLOCKS } from '@contentful/rich-text-types';

export default {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: 'UNRECOGNIZED_TYPE' as BLOCKS,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Hello world!',
          marks: [],
          data: {},
        },
      ],
    },
  ],
} as Document;
