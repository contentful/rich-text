import { Document } from '@contentful/rich-text-types';

export default {
  content: [
    {
      data: {},
      content: [
        {
          marks: [],
          value: 'hello',
          nodeType: 'text',
        },
      ],
      nodeType: 'paragraph',
    },
    {
      data: {},
      content: [
        {
          marks: [],
          value: 'world',
          nodeType: 'text',
        },
      ],
      nodeType: 'blockquote',
    },
  ],
  nodeType: 'document',
} as Document;
