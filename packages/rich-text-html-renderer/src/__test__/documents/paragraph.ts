import { Document } from '@contentful/rich-text-types';

export default {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'hello world',
          marks: [],
          data: {},
        },
      ],
    },
  ],
} as Document;
