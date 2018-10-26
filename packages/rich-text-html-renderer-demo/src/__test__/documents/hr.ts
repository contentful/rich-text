import { Document } from '@contentful/rich-text-types-demo';

export default {
  content: [
    {
      content: [
        {
          marks: [],
          nodeType: 'text',
          value: 'hello world',
        },
      ],
      data: {},
      nodeType: 'paragraph',
    },
    {
      content: [
        {
          marks: [],
          nodeType: 'text',
          value: '',
        },
      ],
      data: {},
      nodeType: 'hr',
    },
    {
      content: [
        {
          marks: [],
          nodeType: 'text',
          value: '',
        },
      ],
      data: {},
      nodeType: 'paragraph',
    },
  ],
  nodeType: 'document',
} as Document;
