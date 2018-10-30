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
      nodeClass: 'block',
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
      nodeClass: 'block',
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
      nodeClass: 'block',
    },
  ],
  data: {},
  nodeType: 'document',
  nodeClass: 'block',
} as Document;
