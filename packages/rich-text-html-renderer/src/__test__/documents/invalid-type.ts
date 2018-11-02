import { Document } from '@contentful/rich-text-types';

export default {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'UNRECOGNIZED_TYPE',
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
