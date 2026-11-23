import { BLOCKS, Document } from '@contentful/rich-text-types';

export default {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.TABLE,
      data: {},
      content: [
        {
          nodeType: BLOCKS.TABLE_ROW,
          data: {},
          content: [
            {
              nodeType: BLOCKS.TABLE_HEADER_CELL,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [{ nodeType: 'text', data: {}, marks: [], value: 'Photo' }],
                },
              ],
            },
            {
              nodeType: BLOCKS.TABLE_HEADER_CELL,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [{ nodeType: 'text', data: {}, marks: [], value: 'Caption' }],
                },
              ],
            },
          ],
        },
        {
          nodeType: BLOCKS.TABLE_ROW,
          data: {},
          content: [
            {
              nodeType: BLOCKS.TABLE_CELL,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.EMBEDDED_ASSET,
                  data: {
                    target: {
                      sys: { id: 'asset-id', type: 'Link', linkType: 'Asset' },
                      fields: {
                        file: { url: '//images.ctfassets.net/space/asset.jpg' },
                        description: 'A mountain at sunset',
                      },
                    },
                  },
                  content: [],
                },
              ],
            },
            {
              nodeType: BLOCKS.TABLE_CELL,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [{ nodeType: 'text', data: {}, marks: [], value: 'Sunset' }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} as Document;
