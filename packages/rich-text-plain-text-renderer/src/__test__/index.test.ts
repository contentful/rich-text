import { Document, BLOCKS, INLINES } from '@contentful/rich-text-types';

import { documentToPlainTextString, Options } from '../index';

describe('documentToPlainTextString', () => {
  it('returns empty string when given an empty document', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    expect(documentToPlainTextString(document)).toEqual('');
  });

  it('handles a simple case', () => {
    const document: Document = {
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
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
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
              nodeType: INLINES.HYPERLINK,
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
          nodeType: BLOCKS.UL_LIST,
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
                      nodeType: 'text',
                      value: 'This is a list element in a separate block ',
                      data: {},
                      marks: [],
                    },
                    {
                      nodeType: INLINES.HYPERLINK,
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
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
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

describe('stripEmptyTrailingParagraph', () => {
  it('strips empty trailing paragraph when enabled', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Hello world',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options = {
      stripEmptyTrailingParagraph: true,
    };

    const result = documentToPlainTextString(document, ' ', options);
    expect(result).toEqual('Hello world');
  });

  it('does not strip empty trailing paragraph when disabled', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Hello world',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options = {
      stripEmptyTrailingParagraph: false,
    };

    const result = documentToPlainTextString(document, ' ', options);
    expect(result).toEqual('Hello world ');
  });

  it('does not strip empty trailing paragraph when it is the only child', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options = {
      stripEmptyTrailingParagraph: true,
    };

    const result = documentToPlainTextString(document, ' ', options);
    expect(result).toEqual('');
  });

  it('does not strip non-empty trailing paragraph', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Hello world',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Not empty',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options = {
      stripEmptyTrailingParagraph: true,
    };

    const result = documentToPlainTextString(document, ' ', options);
    expect(result).toEqual('Hello world Not empty');
  });

  it('does not strip trailing paragraph with multiple text nodes', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Hello world',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options = {
      stripEmptyTrailingParagraph: true,
    };

    const result = documentToPlainTextString(document, ' ', options);
    expect(result).toEqual('Hello world ');
  });

  it('does not strip trailing non-paragraph node', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Hello world',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.HEADING_1,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options = {
      stripEmptyTrailingParagraph: true,
    };

    const result = documentToPlainTextString(document, ' ', options);
    expect(result).toEqual('Hello world ');
  });
});

describe('custom renderNode', () => {
  it('allows custom rendering of hyperlinks with uri', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Check out ',
              marks: [],
              data: {},
            },
            {
              nodeType: INLINES.HYPERLINK,
              content: [
                {
                  nodeType: 'text',
                  value: 'this link',
                  marks: [],
                  data: {},
                },
              ],
              data: {
                uri: 'https://example.com',
              },
            },
            {
              nodeType: 'text',
              value: ' for more info.',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options: Options = {
      renderNode: {
        [INLINES.HYPERLINK]: (node, next) => `${next(node.content)}: ${node.data.uri}`,
      },
    };

    const result = documentToPlainTextString(document, ' ', options);
    expect(result).toEqual('Check out this link: https://example.com for more info.');
  });

  it('allows custom rendering of block nodes', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Normal text',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.QUOTE,
          data: {},
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'Quoted text',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      ],
    };

    const options: Options = {
      renderNode: {
        [BLOCKS.QUOTE]: (node, next) => `> ${next(node.content)}`,
      },
    };

    const result = documentToPlainTextString(document, '\n', options);
    expect(result).toEqual('Normal text\n> Quoted text');
  });

  it('uses default rendering for nodes without custom renderer', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'First paragraph',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.HEADING_1,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'A heading',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options: Options = {
      renderNode: {
        [BLOCKS.HEADING_1]: (node, next) => `# ${next(node.content)}`,
      },
    };

    const result = documentToPlainTextString(document, ' ', options);
    expect(result).toEqual('First paragraph # A heading');
  });
});
