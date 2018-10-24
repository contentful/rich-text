import { Document } from '@contentful/rich-text-types';

export default {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'hello world',
          marks: [],
        },
      ],
    },
  ],
} as Document;
