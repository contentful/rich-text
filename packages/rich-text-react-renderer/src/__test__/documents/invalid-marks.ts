import { Document } from '@contentful/rich-text-types';

export default {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Hello world!',
          marks: [
            {
              type: 'UNRECOGNIZED_MARK',
            },
          ],
          data: {},
        },
      ],
    },
  ],
} as Document;
