import { Document, BLOCKS, INLINES } from '@contentful/rich-text-types';
import { getRichTextEntityLinks, getRichTextResourceLinks } from '../index';

function makeResourceLink(spaceId: string, entryId: string) {
  return {
    sys: {
      type: 'ResourceLink',
      linkType: 'Contentful:Entry',
      urn: `crn:contentful:::content:spaces/${spaceId}/entries/${entryId}`,
    },
  };
}

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

    it('returns an empty array if document parameter is `null`', () => {
      /**
       * This test is important! Not all consumers of this library have correct typescript types,
       * we know that not handling `null` gracefully will cause issues in production.
       */

      const documentThatIsNull: Document | null = null;

      expect(getRichTextEntityLinks(documentThatIsNull!)).toEqual({ Asset: [], Entry: [] });
    });
  });

  describe('returning rich text links at an arbitrary level of depth', () => {
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

    it('returns all entity link objects in the same order as defined in the document', () => {
      expect(getRichTextEntityLinks(document)).toEqual({
        Entry: [
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'bar',
          },
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'baz',
          },
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'inline-header-entry',
          },
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'hyperlink-cell-entry',
          },
        ],
        Asset: [
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'quux',
          },
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'qux',
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

describe(`getRichTextResourceLinks`, () => {
  it('returns top-level rich text resource-links', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: BLOCKS.EMBEDDED_RESOURCE,
              data: {
                target: makeResourceLink('foo', 'bar'),
              },
              content: [],
            },
          ],
        },
      ],
    };

    expect(getRichTextResourceLinks(document, BLOCKS.EMBEDDED_RESOURCE)).toEqual([
      makeResourceLink('foo', 'bar'),
    ]);
  });

  it('returns an empty array if document parameter is `null`', () => {
    const document: Document | null = null;

    expect(getRichTextResourceLinks(document!, BLOCKS.EMBEDDED_RESOURCE)).toEqual([]);
  });

  it(`returns all ResourceLinks from multiple levels in the same order as defined in the document`, () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: BLOCKS.EMBEDDED_RESOURCE,
              data: {
                target: makeResourceLink('space-1', 'entry-1'),
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
                              nodeType: BLOCKS.EMBEDDED_RESOURCE,
                              data: {
                                target: makeResourceLink('space-1', 'entry-2'),
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
                      nodeType: BLOCKS.EMBEDDED_RESOURCE,
                      data: {
                        target: makeResourceLink('space-2', 'entry-1'),
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
                          nodeType: BLOCKS.EMBEDDED_RESOURCE,
                          data: {
                            target: makeResourceLink('space-2', 'entry-2'),
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
                          nodeType: BLOCKS.EMBEDDED_RESOURCE,
                          data: {
                            target: makeResourceLink('space-2', 'entry-3'),
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
        },
      ],
    };

    expect(getRichTextResourceLinks(document, BLOCKS.EMBEDDED_RESOURCE)).toEqual([
      makeResourceLink('space-1', 'entry-1'),
      makeResourceLink('space-1', 'entry-2'),
      makeResourceLink('space-2', 'entry-1'),
      makeResourceLink('space-2', 'entry-2'),
      makeResourceLink('space-2', 'entry-3'),
    ]);
  });

  it(`de-duplicates links based on urn`, () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: BLOCKS.EMBEDDED_RESOURCE,
              data: {
                target: makeResourceLink('space-1', 'entry-1'),
              },
              content: [],
            },
            {
              nodeType: BLOCKS.EMBEDDED_RESOURCE,
              data: {
                target: makeResourceLink('space-1', 'entry-2'),
              },
              content: [],
            },
            {
              nodeType: BLOCKS.EMBEDDED_RESOURCE,
              data: {
                target: makeResourceLink('space-1', 'entry-1'),
              },
              content: [],
            },
          ],
        },
      ],
    };
    expect(getRichTextResourceLinks(document, BLOCKS.EMBEDDED_RESOURCE)).toEqual([
      makeResourceLink('space-1', 'entry-1'),
      makeResourceLink('space-1', 'entry-2'),
    ]);
  });

  it(`should return duplicate links if the deduplicate option value is passed as false`, () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: BLOCKS.EMBEDDED_RESOURCE,
              data: {
                target: makeResourceLink('space-1', 'entry-1'),
              },
              content: [],
            },
            {
              nodeType: BLOCKS.EMBEDDED_RESOURCE,
              data: {
                target: makeResourceLink('space-1', 'entry-2'),
              },
              content: [],
            },
            {
              nodeType: BLOCKS.EMBEDDED_RESOURCE,
              data: {
                target: makeResourceLink('space-1', 'entry-1'),
              },
              content: [],
            },
          ],
        },
      ],
    };
    expect(
      getRichTextResourceLinks(document, BLOCKS.EMBEDDED_RESOURCE, { deduplicate: false }),
    ).toEqual([
      makeResourceLink('space-1', 'entry-1'),
      makeResourceLink('space-1', 'entry-2'),
      makeResourceLink('space-1', 'entry-1'),
    ]);
  });
});
