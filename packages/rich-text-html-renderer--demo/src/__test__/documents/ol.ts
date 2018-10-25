import { Document } from '@contentful/rich-text-types--demo';

export default {
  content: [
    {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              content: [
                {
                  marks: [],
                  value: 'Hello',
                  nodeType: 'text',
                },
              ],
              nodeType: 'paragraph',
            },
          ],
          nodeType: 'list-item',
        },
        {
          data: {},
          content: [
            {
              data: {},
              content: [
                {
                  marks: [],
                  value: 'world',
                  nodeType: 'text',
                },
              ],
              nodeType: 'paragraph',
            },
          ],
          nodeType: 'list-item',
        },
      ],
      nodeType: 'ordered-list',
    },
    {
      data: {},
      content: [
        {
          marks: [],
          value: '',
          nodeType: 'text',
        },
      ],
      nodeType: 'paragraph',
    },
  ],
  nodeType: 'document',
} as Document;
