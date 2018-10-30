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
              nodeClass: 'block',
            },
          ],
          nodeType: 'list-item',
          nodeClass: 'block',
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
              nodeClass: 'block',
            },
          ],
          nodeType: 'list-item',
          nodeClass: 'block',
        },
      ],
      nodeType: 'ordered-list',
      nodeClass: 'block',
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
      nodeClass: 'block',
    },
  ],
  nodeType: 'document',
  nodeClass: 'block',
} as Document;
