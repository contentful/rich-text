import { Document } from '@contentful/rich-text-types-demo';

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
      nodeType: 'block-quote',
    },
  ],
  nodeType: 'document',
} as Document;
