import { Document } from '@contentful/rich-text-types';

export default {
  content: [
    {
      content: [
        {
          marks: [],
          nodeType: 'text',
          value: 'hello world',
          data: {},
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
          data: {},
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
          data: {},
        },
      ],
      data: {},
      nodeType: 'paragraph',
    },
  ],
  data: {},
  nodeType: 'document',
} as Document;
