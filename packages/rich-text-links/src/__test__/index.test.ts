import { Document, BLOCKS, INLINES } from '../../node_modules/@contentful/rich-text-types';
import richTextLinks from '../index';

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
      expect(richTextLinks.getRichTextEntityLinks(document)).toEqual({
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

    it('returns all entity link objects', () => {
      expect(richTextLinks.getRichTextEntityLinks(document)).toEqual({
        Entry: [
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
        ],
        Asset: [
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
      expect(richTextLinks.getRichTextEntityLinks(document)).toEqual({
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
});
