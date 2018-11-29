import { Document } from '@contentful/rich-text-types';

export default {
  data: {},
  content: [
    {
      data: {},
      content: [
        {
          data: {},
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
          data: {},
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
