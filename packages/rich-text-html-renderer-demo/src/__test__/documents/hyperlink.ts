import { Document } from '@contentful/rich-text-types-demo';

export default {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'Some text ',
          marks: [],
        },
        {
          nodeType: 'hyper-link',
          content: [
            {
              nodeType: 'text',
              value: 'link',
              marks: [],
            },
          ],
          data: {
            uri: 'https://url.org',
          },
        },
        {
          nodeType: 'text',
          value: ' text.',
          marks: [],
        },
      ],
      data: {},
    },
  ],
} as Document;
