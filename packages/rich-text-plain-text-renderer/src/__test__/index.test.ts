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
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'This is text. ',
              data: {},
              marks: [{ type: 'bold' }],
            },
            {
              nodeType: 'text',
              value: '',
              data: {},
              marks: [],
            },
            {
              nodeType: 'text',
              value: 'This is text with some marks.',
              data: {},
              marks: [{ type: 'italic' }],
            },
            {
              nodeType: 'text',
              value: ' ',
              data: {},
              marks: [],
            },
            {
              nodeType: 'hyperlink',
              content: [
                {
                  nodeType: 'text',
                  value: 'This is text from a bolded hyperlink.',
                  data: {},
                  marks: [{ type: 'bold' }],
                },
              ],
              data: {
                url: 'https://example.com',
                title: 'qux',
              },
            },
          ],
        },
        {
          nodeType: 'unordered-list',
          data: {},
          content: [
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'This is a list element in a separate block ',
                      data: {},
                      marks: [],
                    },
                    {
                      nodeType: 'hyperlink',
                      content: [
                        {
                          nodeType: 'text',
                          value: 'with a link with marks.',
                          data: {},
                          marks: [],
                        },
                      ],
                      data: {
                        url: 'https://google.com',
                        title: 'woo',
                      },
                    },
                  ],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'This is a separate list element in the same block.',
                      data: {},
                      marks: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    it('handles nested nodes gracefully', () => {
      expect(documentToPlainTextString(document)).toEqual(
        [
          'This is text.',
          'This is text with some marks.',
          'This is text from a bolded hyperlink.',
          'This is a list element in a separate block with a link with marks.',
          'This is a separate list element in the same block.',
        ].join(' '),
      );
    });

    it('defers to the user-supplied block divisor', () => {
      expect(documentToPlainTextString(document, '\n\n')).toEqual(
        [
          'This is text. This is text with some marks. This is text from a bolded hyperlink.',
          'This is a list element in a separate block with a link with marks.',
          'This is a separate list element in the same block.',
        ].join('\n\n'),
      );
    });
  });
});
