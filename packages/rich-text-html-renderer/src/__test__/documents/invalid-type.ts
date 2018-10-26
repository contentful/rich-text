import { Document } from '@contentful/rich-text-types';

export default {
  nodeType: 'document',
  content: [
    {
      nodeType: 'UNRECOGNIZED_TYPE',
      content: [
        {
          nodeType: 'text',
          value: 'Hello world!',
          marks: [],
        },
      ],
    },
  ],
} as Document;
