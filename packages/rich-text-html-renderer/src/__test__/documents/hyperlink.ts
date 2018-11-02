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
          value: 'Some text ',
          marks: [],
          data: {},
        },
        {
          nodeType: 'hyperlink',
          content: [
            {
              nodeType: 'text',
              value: 'link',
              marks: [],
              data: {},
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
          data: {},
        },
      ],
    },
  ],
} as Document;
