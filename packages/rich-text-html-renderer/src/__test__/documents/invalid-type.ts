import { Document } from '@contentful/rich-text-types';

export default {
  nodeType: 'document',
  nodeClass: 'block',
  data: {},
  content: [
    {
      nodeType: 'UNRECOGNIZED_TYPE',
      nodeClass: 'block',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Hello world!',
          marks: [],
          data: {},
        },
      ],
    },
  ],
} as Document;
