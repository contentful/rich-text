import { BLOCKS, Document, INLINES } from '@contentful/rich-text-types';

import * as richTextLinks from '../../src/index';

const richTextField: Document = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          data: {},
          marks: [],
          value: '',
        },
        {
          nodeType: INLINES.ASSET_HYPERLINK,
          data: {
            target: {
              sys: {
                id: 'cover',
                type: 'Link',
                linkType: 'Asset',
              },
            },
          },
          content: [
            {
              nodeType: 'text',
              data: {},
              marks: [],
              value: 'Cover',
            },
          ],
        },
        {
          nodeType: 'text',
          data: {},
          marks: [],
          value: '',
        },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          data: {},
          marks: [],
          value: 'This book by author ',
        },
        {
          nodeType: INLINES.EMBEDDED_ENTRY,
          data: {
            target: {
              sys: {
                id: 'author',
                type: 'Link',
                linkType: 'Entry',
              },
            },
          },
          content: [
            {
              nodeType: 'text',
              data: {},
              marks: [],
              value: '',
            },
          ],
        },
        {
          nodeType: 'text',
          data: {},
          marks: [],
          value: 'was an instant classic.',
        },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          data: {},
          marks: [],
          value: 'The first chapter is free to read: ',
        },
      ],
    },
    {
      nodeType: BLOCKS.EMBEDDED_ENTRY,
      data: {
        target: {
          sys: {
            id: 'chapter-1',
            type: 'Link',
            linkType: 'Entry',
          },
        },
      },
      content: [
        {
          nodeType: 'text',
          data: {},
          marks: [],
          value: '',
        },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          data: {},
          marks: [],
          value: '',
        },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          data: {},
          marks: [],
          value: '',
        },
      ],
    },
    {
      nodeType: BLOCKS.UL_LIST,
      data: {},
      content: [
        {
          nodeType: BLOCKS.LIST_ITEM,
          data: {},
          content: [
            {
              nodeType: BLOCKS.EMBEDDED_ENTRY,
              data: {
                target: {
                  sys: {
                    id: 'chapter-2',
                    type: 'Link',
                    linkType: 'Entry',
                  },
                },
              },
              content: [
                {
                  nodeType: 'text',
                  data: {},
                  marks: [],
                  value: '',
                },
              ],
            },
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [
                {
                  nodeType: 'text',
                  data: {},
                  marks: [],
                  value: '',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const getRichTextEntityLinks = () => richTextLinks.getRichTextEntityLinks(richTextField);
