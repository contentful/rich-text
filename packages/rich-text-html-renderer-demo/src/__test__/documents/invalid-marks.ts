import { Document } from '@contentful/rich-text-types-demo';

export default {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'Hello world!',
          marks: [
            {
              type: 'UNRECOGNIZED_MARK',
            },
          ],
        },
      ],
    },
  ],
} as Document;
