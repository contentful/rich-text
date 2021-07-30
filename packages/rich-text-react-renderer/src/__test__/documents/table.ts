import { Document, BLOCKS } from '@contentful/rich-text-types';

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
              nodeType: BLOCKS.TABLE_CELL,
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
                      value: 'A 1',
                    },
                  ],
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
                  content: [
                    {
                      nodeType: 'text',
                      data: {},
                      marks: [],
                      value: 'B 1',
                    },
                  ],
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
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      data: {},
                      marks: [],
                      value: 'A 2',
                    },
                  ],
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
                  content: [
                    {
                      nodeType: 'text',
                      data: {},
                      marks: [],
                      value: 'B 2',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} as Document;
