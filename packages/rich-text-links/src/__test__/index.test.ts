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

    describe('when the link type is "Entry"', () => {
      it('returns the matching link objects', () => {
        expect(getRichTextEntityLinks(document, 'Entry')).toEqual([
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'foo',
          },
        ]);
      });
    });

    describe('when the link type is "Asset"', () => {
      it('returns the matching link objects', () => {
        expect(getRichTextEntityLinks(document, 'Asset')).toEqual([
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'bar',
          },
        ]);
      });
    });

    describe('when no link type is provided', () => {
      it('returns all entity link objects', () => {
        expect(getRichTextEntityLinks(document)).toEqual([
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'bar',
          },
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'foo',
          },
        ]);
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

    describe('when the link type is "Entry"', () => {
      it('returns all unique matching links', () => {
        expect(getRichTextEntityLinks(document, 'Entry')).toEqual([
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
      });
    });

    describe('when the link type is "Asset"', () => {
      it('returns all unique matching links', () => {
        expect(getRichTextEntityLinks(document, 'Asset')).toEqual([
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

    describe('when no link type is provided', () => {
      it('returns all entity link objects', () => {
        expect(getRichTextEntityLinks(document)).toEqual([
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'bar',
          },
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'baz',
          },
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'quux',
          },
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'foo',
          },
        ]);
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

    describe('when the link type is "Entry"', () => {
      it('ignores redundant entry links', () => {
        expect(getRichTextEntityLinks(document, 'Entry')).toEqual([
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'foo',
          },
        ]);
      });
    });

    describe('when the link type is "Asset"', () => {
      it('ignores redundant asset links', () => {
        expect(getRichTextEntityLinks(document, 'Asset')).toEqual([
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'bar',
          },
        ]);
      });
    });

    describe('when no link type is provided', () => {
      it('ignores all redundant links', () => {
        expect(getRichTextEntityLinks(document)).toEqual([
          {
            linkType: 'Asset',
            type: 'Link',
            id: 'bar',
          },
          {
            linkType: 'Entry',
            type: 'Link',
            id: 'foo',
          },
        ]);
      });
    });
  });
});
