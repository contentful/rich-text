import { Document, BLOCKS } from '@contentful/rich-text-types';

import { documentToPlainTextString } from '../index';

describe('documentToPlainTextString', () => {
  it('returns empty string when given an empty document', () => {
    const document: Document = {
      nodeType: 'document',
      data: {},
      content: [],
    };

    expect(documentToPlainTextString(document)).toEqual('');
  });

  it('handles a simple case', () => {
    const document: Document = {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              data: {},
              value: 'Trout is a',
              marks: [],
            },
            {
              nodeType: 'text',
              data: {},
              value: ' seafood d',
              marks: [{ type: 'italic' }],
            },
            {
              nodeType: 'text',
              data: {},
              value: 'elicacy.',
              marks: [],
            },
          ],
        },
      ],
    };

    expect(documentToPlainTextString(document)).toEqual('Trout is a seafood delicacy.');
  });

  describe('rendering deeply nested documents', () => {
    const document: Document = {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: BLOCKS.OL_LIST,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.LIST_ITEM,
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      data: {},
                      value: 'Trout is a',
                      marks: [],
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
                              nodeType: 'text',
                              data: {},
                              value: 'seafood d',
                              marks: [{ type: 'italic' }],
                            },
                            {
                              nodeType: 'text',
                              data: {},
                              value: 'elicacy.',
                              marks: [],
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
        },
        {
          nodeType: BLOCKS.HR,
          data: {},
          content: [],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              data: {},
              value: 'It is scrumptious.',
              marks: [],
            },
          ],
        },
      ],
    };

    it('handles nested nodes gracefully', () => {
      expect(documentToPlainTextString(document)).toEqual(
        'Trout is a seafood delicacy. It is scrumptious.',
      );
    });

    it('defers to the user-supplied block divisor', () => {
      expect(documentToPlainTextString(document, '\n\n')).toEqual(
        'Trout is a seafood delicacy.\n\nIt is scrumptious.',
      );
    });
  });
});
