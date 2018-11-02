import { Document } from '@contentful/rich-text-types';

export default {
  data: {},
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
                  data: {},
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
                  data: {},
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
      nodeType: 'unordered-list',
    },
    {
      data: {},
      content: [
        {
          data: {},
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
