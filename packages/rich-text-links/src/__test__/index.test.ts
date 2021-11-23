import { Document, BLOCKS, INLINES } from '../../node_modules/@contentful/rich-text-types';
import { getRichTextEntityLinks } from '../index';

describe('getRichTextEntityLinks', () => {
  describe('returning top-level rich text links', () => {
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

    it('returns all entity link objects', () => {
      expect(getRichTextEntityLinks(document)).toEqual({
        Entry: [
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'foo',
          },
        ],
        Asset: [
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'bar',
          },
        ],
      });
    });
  });

  describe('returning rich text links at an arbitrary level of depth', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {
            target: {
              sys: {
                linkType: 'Entry',
                type: 'Link',
                id: 'foo',
              },
            },
          },
          content: [
            {
              nodeType: BLOCKS.EMBEDDED_ENTRY,
              data: {
                target: {
                  sys: {
                    linkType: 'Entry',
                    type: 'Link',
                    id: 'bar',
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
                    id: 'qux',
                  },
                },
              },
              content: [],
            },
          ],
        },
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
                  content: [{ data: {}, content: [], nodeType: BLOCKS.PARAGRAPH }],
                },
                {
                  nodeType: BLOCKS.TABLE_HEADER_CELL,
                  data: {},
                  content: [
                    {
                      nodeType: BLOCKS.PARAGRAPH,
                      data: {},
                      content: [
                        {
                          nodeType: INLINES.EMBEDDED_ENTRY,
                          data: {
                            target: {
                              sys: { id: 'inline-header-entry', type: 'Link', linkType: 'Entry' },
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
                          nodeType: INLINES.ENTRY_HYPERLINK,
                          data: {
                            target: {
                              sys: { id: 'hyperlink-cell-entry', type: 'Link', linkType: 'Entry' },
                            },
                          },
                          content: [],
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
                      data: {},
                      content: [
                        {
                          nodeType: BLOCKS.PARAGRAPH,
                          data: {},
                          content: [
                            {
                              nodeType: INLINES.ASSET_HYPERLINK,
                              data: {
                                target: {
                                  sys: {
                                    id: 'hyperlink-cell-asset',
                                    type: 'Link',
                                    linkType: 'Asset',
                                  },
                                },
                              },
                              content: [],
                            },
                          ],
                        },
                      ],
                      nodeType: BLOCKS.PARAGRAPH,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    it('returns all entity link objects', () => {
      expect(getRichTextEntityLinks(document)).toEqual({
        Entry: [
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'foo',
          },
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'baz',
          },
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'bar',
          },
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'hyperlink-cell-entry',
          },
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'inline-header-entry',
          },
        ],
        Asset: [
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'qux',
          },
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'quux',
          },
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'hyperlink-cell-asset',
          },
        ],
      });
    });
  });

  describe('handling redundant links', () => {
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
            {
              nodeType: BLOCKS.OL_LIST,
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
                            linkType: 'Entry',
                            type: 'Link',
                            id: 'foo',
                          },
                        },
                      },
                      content: [],
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
            },
          ],
        },
      ],
    };

    it('ignores all redundant links', () => {
      expect(getRichTextEntityLinks(document)).toEqual({
        Entry: [
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'foo',
          },
        ],
        Asset: [
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'bar',
          },
        ],
      });
    });
  });

  describe('filtering links of given type', () => {
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

    it('ignores all links of different types', () => {
      expect(getRichTextEntityLinks(document, BLOCKS.EMBEDDED_ENTRY)).toEqual({
        Entry: [
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'foo',
          },
        ],
        Asset: [],
      });
    });
  });
});
