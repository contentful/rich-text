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
      nodeClass: 'block',
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
      nodeClass: 'block',
    },
  ],
  nodeType: 'document',
  nodeClass: 'block',
} as Document;
