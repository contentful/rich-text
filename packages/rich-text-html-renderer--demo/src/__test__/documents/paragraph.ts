import { Document } from '@contentful/rich-text-types--demo';

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
