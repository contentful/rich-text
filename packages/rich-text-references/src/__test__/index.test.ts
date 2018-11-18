import { Document, BLOCKS, INLINES } from '../../node_modules/@contentful/rich-text-types';
import { getRichTextReferences } from '../index';

describe('getRichTextReferences', () => {
  const document: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: BLOCKS.EMBEDDED_ENTRY,
            data: {
              target: {
                sys: {
                  linkType: 'Entry',
                  type: 'Link',
                  id: 'foo',
                },
              },
            },
            content: [],
          },
          {
            nodeType: BLOCKS.OL_LIST,
            data: {},
            content: [
              {
                nodeType: BLOCKS.LIST_ITEM,
                data: {},
                content: [
                  {
                    nodeType: BLOCKS.PARAGRAPH,
                    data: {},
                    content: [
                      {
                        nodeType: BLOCKS.LIST_ITEM,
                        data: {},
                        content: [
                          {
                            nodeType: BLOCKS.EMBEDDED_ASSET,
                            data: {
                              target: {
                                sys: {
                                  linkType: 'Asset',
                                  type: 'Link',
                                  id: 'quux',
                                },
                              },
                            },
                            content: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                nodeType: BLOCKS.LIST_ITEM,
                data: {},
                content: [
                  {
                    nodeType: INLINES.ENTRY_HYPERLINK,
                    data: {
                      target: {
                        sys: {
                          linkType: 'Entry',
                          type: 'Link',
                          id: 'baz',
                        },
                      },
                    },
                    content: [],
                  },
                ],
              },
            ],
          },
          {
            nodeType: BLOCKS.EMBEDDED_ASSET,
            data: {
              target: {
                sys: {
                  linkType: 'Asset',
                  type: 'Link',
                  id: 'bar',
                },
              },
            },
            content: [],
          },
        ],
      },
    ],
  };

  it('returns rich text references at an arbitrary level of depth', () => {
    expect(getRichTextReferences(document, 'Entry')).toEqual([
      {
        linkType: 'Entry',
        type: 'Link',
        id: 'baz',
      },
      {
        linkType: 'Entry',
        type: 'Link',
        id: 'foo',
      },
    ]);

    expect(getRichTextReferences(document, 'Asset')).toEqual([
      {
        linkType: 'Asset',
        type: 'Link',
        id: 'bar',
      },
      {
        linkType: 'Asset',
        type: 'Link',
        id: 'quux',
      },
    ]);
  });
});
