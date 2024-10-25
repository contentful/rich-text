import { BLOCKS } from '../blocks';
import { INLINES } from '../inlines';
import type { Document } from '../types';
import { validateRichTextDocument } from '../validator';

describe('validation', () => {
  it('fails if it is not document node', () => {
    // @ts-expect-error we force a wrong node type to check that it fails
    const document: Document = { nodeType: BLOCKS.PARAGRAPH, content: [], data: {} };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: ['document'],
        name: 'in',
        path: ['nodeType'],
        value: 'paragraph',
      },
    ]);
  });

  it('fails if it has an invalid shape', () => {
    // @ts-expect-error we force a wrong node type to check that it fails
    const document: Document = { nodeType: BLOCKS.DOCUMENT };

    expect(validateRichTextDocument(document)).toEqual([
      {
        name: 'required',
        path: ['content'],
        details: 'The property "content" is required here',
      },
      {
        name: 'required',
        path: ['data'],
        details: 'The property "data" is required here',
      },
    ]);
  });

  it('fails if it has nested documents', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      // @ts-expect-error we force a wrong node type to check that it fails
      content: [{ nodeType: BLOCKS.DOCUMENT, content: [], data: {} }],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: [
          'blockquote',
          'embedded-asset-block',
          'embedded-entry-block',
          'embedded-resource-block',
          'heading-1',
          'heading-2',
          'heading-3',
          'heading-4',
          'heading-5',
          'heading-6',
          'hr',
          'ordered-list',
          'paragraph',
          'table',
          'unordered-list',
        ],
        name: 'in',
        path: ['content', 0, 'nodeType'],
        value: 'document',
      },
    ]);
  });

  it('fails without a nodeType property', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      // @ts-expect-error we force a wrong node type to check that it fails
      content: [{ content: [], data: {} }],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: [
          'blockquote',
          'embedded-asset-block',
          'embedded-entry-block',
          'embedded-resource-block',
          'heading-1',
          'heading-2',
          'heading-3',
          'heading-4',
          'heading-5',
          'heading-6',
          'hr',
          'ordered-list',
          'paragraph',
          'table',
          'unordered-list',
        ],
        name: 'in',
        path: ['content', 0, 'nodeType'],
        value: undefined,
      },
    ]);
  });

  it('fails on custom nodeTypes (unknown nodeType)', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      // @ts-expect-error we force a wrong node type to check that it fails
      content: [{ nodeType: 'custom-node-type', content: [], data: {} }],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: [
          'blockquote',
          'embedded-asset-block',
          'embedded-entry-block',
          'embedded-resource-block',
          'heading-1',
          'heading-2',
          'heading-3',
          'heading-4',
          'heading-5',
          'heading-6',
          'hr',
          'ordered-list',
          'paragraph',
          'table',
          'unordered-list',
        ],
        name: 'in',
        path: ['content', 0, 'nodeType'],
        value: 'custom-node-type',
      },
    ]);
  });

  it('fails without a content property', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      // @ts-expect-error we force a wrong node type to check that it fails
      content: [{ nodeType: BLOCKS.PARAGRAPH, data: {} }],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'The property "content" is required here',
        name: 'required',
        path: ['content', 0, 'content'],
        value: undefined,
      },
    ]);
  });

  it('fails with a invalid content property', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      // @ts-expect-error we force a wrong type to check that it fails
      content: [{ nodeType: BLOCKS.PARAGRAPH, content: 'Hello World', data: {} }],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'The type of "content" is incorrect, expected type: Array',
        name: 'type',
        path: ['content', 0, 'content'],
        type: 'Array',
        value: 'Hello World',
      },
    ]);
  });

  it('fails without data property', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      // @ts-expect-error we force a wrong node type to check that it fails
      content: [{ nodeType: BLOCKS.PARAGRAPH, content: [] }],
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'The property "data" is required here',
        name: 'required',
        path: ['data'],
      },
    ]);
  });

  it('fails with invalid data property', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [{ nodeType: BLOCKS.PARAGRAPH, content: [], data: null }],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'The type of "data" is incorrect, expected type: Object',
        name: 'type',
        path: ['content', 0, 'data'],
        type: 'Object',
        value: null,
      },
    ]);
  });

  it('fails if undefined is in the content list', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [{ nodeType: BLOCKS.PARAGRAPH, content: [], data: {} }, undefined],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'The type of "1" is incorrect, expected type: Object',
        name: 'type',
        path: ['content', 1],
        type: 'Object',
        value: undefined,
      },
    ]);
  });

  it('fails if undefined is in the content list of child nodes', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.UL_LIST,
          content: [
            {
              nodeType: BLOCKS.LIST_ITEM,
              content: [{ nodeType: BLOCKS.PARAGRAPH, content: [], data: {} }, undefined],
              data: {},
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'The type of "1" is incorrect, expected type: Object',
        name: 'type',
        path: ['content', 0, 'content', 0, 'content', 1],
        type: 'Object',
        value: undefined,
      },
    ]);
  });

  it('fails with unknown properties', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [],
      data: {},
      // @ts-expect-error we force a wrong property to check that it fails
      myCustomProperty: 'Hello World',
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'The property "myCustomProperty" is not expected',
        name: 'unexpected',
        path: ['myCustomProperty'],
      },
    ]);
  });

  it.each([BLOCKS.LIST_ITEM, BLOCKS.TABLE_ROW, BLOCKS.TABLE_HEADER_CELL, BLOCKS.TABLE_CELL])(
    'fails with a invalid block node as children (nodeType: %s) of the root node',
    (nodeType) => {
      const document: Document = {
        nodeType: BLOCKS.DOCUMENT,
        content: [
          {
            // @ts-expect-error we force a wrong node type to check that it fails
            nodeType,
            content: [],
            data: {},
          },
        ],
        data: {},
      };

      expect(validateRichTextDocument(document)).toEqual([
        {
          details: 'Value must be one of expected values',
          expected: [
            'blockquote',
            'embedded-asset-block',
            'embedded-entry-block',
            'embedded-resource-block',
            'heading-1',
            'heading-2',
            'heading-3',
            'heading-4',
            'heading-5',
            'heading-6',
            'hr',
            'ordered-list',
            'paragraph',
            'table',
            'unordered-list',
          ],
          name: 'in',
          path: ['content', 0, 'nodeType'],
          value: nodeType,
        },
      ]);
    },
  );

  it.each(Object.values(INLINES))(
    'fails with a inline node (%s) as direct children of the root node',
    (nodeType) => {
      const document: Document = {
        nodeType: BLOCKS.DOCUMENT,
        content: [
          {
            // @ts-expect-error we force a wrong node type to check that it fails
            nodeType,
            content: [],
            data: {},
          },
        ],
        data: {},
      };

      expect(validateRichTextDocument(document)).toEqual([
        {
          details: 'Value must be one of expected values',
          expected: [
            'blockquote',
            'embedded-asset-block',
            'embedded-entry-block',
            'embedded-resource-block',
            'heading-1',
            'heading-2',
            'heading-3',
            'heading-4',
            'heading-5',
            'heading-6',
            'hr',
            'ordered-list',
            'paragraph',
            'table',
            'unordered-list',
          ],
          name: 'in',
          path: ['content', 0, 'nodeType'],
          value: nodeType,
        },
      ]);
    },
  );

  it('fails with text as a direct children of the root node', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          // @ts-expect-error we force a wrong node type to check that it fails
          nodeType: 'text',
          data: {},
          marks: [],
          value: 'Hello World',
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: [
          'blockquote',
          'embedded-asset-block',
          'embedded-entry-block',
          'embedded-resource-block',
          'heading-1',
          'heading-2',
          'heading-3',
          'heading-4',
          'heading-5',
          'heading-6',
          'hr',
          'ordered-list',
          'paragraph',
          'table',
          'unordered-list',
        ],
        name: 'in',
        path: ['content', 0, 'nodeType'],
        value: 'text',
      },
    ]);
  });

  it('fails with inline node and text as a direct children of the root node', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          // @ts-expect-error we force a wrong node type to check that it fails
          nodeType: 'text',
          data: {},
          marks: [],
          value: 'Hello World',
        },
        {
          // @ts-expect-error we force a wrong node type to check that it fails
          nodeType: INLINES.ASSET_HYPERLINK,
          data: { target: {} },
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: [
          'blockquote',
          'embedded-asset-block',
          'embedded-entry-block',
          'embedded-resource-block',
          'heading-1',
          'heading-2',
          'heading-3',
          'heading-4',
          'heading-5',
          'heading-6',
          'hr',
          'ordered-list',
          'paragraph',
          'table',
          'unordered-list',
        ],
        name: 'in',
        path: ['content', 0, 'nodeType'],
        value: 'text',
      },
    ]);
  });

  it.each([BLOCKS.OL_LIST, BLOCKS.UL_LIST] as const)(
    'fails for invalid block nodes inside of (%s)',
    (nodeType) => {
      const document: Document = {
        nodeType: BLOCKS.DOCUMENT,
        content: [
          {
            nodeType: nodeType,
            content: [{ nodeType: BLOCKS.PARAGRAPH, content: [], data: {} }],
            data: {},
          },
        ],
        data: {},
      };

      expect(validateRichTextDocument(document)).toEqual([
        {
          details: 'Value must be one of expected values',
          expected: [BLOCKS.LIST_ITEM],
          name: 'in',
          path: ['content', 0, 'content', 0, 'nodeType'],
          value: BLOCKS.PARAGRAPH,
        },
      ]);
    },
  );

  it('fails on text node directly inside of a list item node', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.UL_LIST,
          content: [
            {
              nodeType: BLOCKS.LIST_ITEM,
              content: [
                {
                  nodeType: 'text',
                  data: {},
                  value: 'Hello World',
                  marks: [],
                },
              ],
              data: {},
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: [
          'blockquote',
          'embedded-asset-block',
          'embedded-entry-block',
          'embedded-resource-block',
          'heading-1',
          'heading-2',
          'heading-3',
          'heading-4',
          'heading-5',
          'heading-6',
          'hr',
          'ordered-list',
          'paragraph',
          'unordered-list',
        ],
        name: 'in',
        path: ['content', 0, 'content', 0, 'content', 0, 'nodeType'],
        value: 'text',
      },
    ]);
  });

  it('fails on invalid block nodes inside of a table node', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.TABLE,
          content: [{ nodeType: BLOCKS.PARAGRAPH, content: [], data: {} }],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: [BLOCKS.TABLE_ROW],
        name: 'in',
        path: ['content', 0, 'content', 0, 'nodeType'],
        value: BLOCKS.PARAGRAPH,
      },
    ]);
  });

  it('fails on invalid block nodes inside of a table row node', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.TABLE,
          content: [
            {
              nodeType: BLOCKS.TABLE_ROW,
              content: [{ nodeType: BLOCKS.PARAGRAPH, content: [], data: {} }],
              data: {},
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: [BLOCKS.TABLE_CELL, BLOCKS.TABLE_HEADER_CELL],
        name: 'in',
        path: ['content', 0, 'content', 0, 'content', 0, 'nodeType'],
        value: BLOCKS.PARAGRAPH,
      },
    ]);
  });

  it('fails on invalid block nodes inside of a table header node', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.TABLE,
          content: [
            {
              nodeType: BLOCKS.TABLE_ROW,
              content: [{ nodeType: BLOCKS.PARAGRAPH, content: [], data: {} }],
              data: {},
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: [BLOCKS.TABLE_CELL, BLOCKS.TABLE_HEADER_CELL],
        name: 'in',
        path: ['content', 0, 'content', 0, 'content', 0, 'nodeType'],
        value: BLOCKS.PARAGRAPH,
      },
    ]);
  });

  it.each([BLOCKS.TABLE_CELL, BLOCKS.TABLE_HEADER_CELL] as const)(
    'fails on invalid node inside of %s',
    (nodeType) => {
      const document: Document = {
        nodeType: BLOCKS.DOCUMENT,
        content: [
          {
            nodeType: BLOCKS.TABLE,
            content: [
              {
                nodeType: BLOCKS.TABLE_ROW,
                content: [
                  {
                    nodeType,
                    content: [{ nodeType: 'text', data: {}, marks: [], value: 'Hello World' }],
                    data: {},
                  },
                ],
                data: {},
              },
            ],
            data: {},
          },
        ],
        data: {},
      };

      expect(validateRichTextDocument(document)).toEqual([
        {
          details: 'Value must be one of expected values',
          expected: [BLOCKS.PARAGRAPH],
          name: 'in',
          path: ['content', 0, 'content', 0, 'content', 0, 'content', 0, 'nodeType'],
          value: 'text',
        },
      ]);
    },
  );

  it('fails if a table node has not at least one table row', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.TABLE,
          content: [],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Size must be at least 1',
        min: 1,
        name: 'size',
        path: ['content', 0, 'content'],
        value: [],
      },
    ]);
  });

  it('fails if a table row node has not at least one table cell', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.TABLE,
          content: [
            {
              nodeType: BLOCKS.TABLE_ROW,
              content: [],
              data: {},
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Size must be at least 1',
        min: 1,
        name: 'size',
        path: ['content', 0, 'content', 0, 'content'],
        value: [],
      },
    ]);
  });

  it.each([BLOCKS.TABLE_CELL, BLOCKS.TABLE_HEADER_CELL] as const)(
    'fails if a %s has not at least one child',
    (nodeType) => {
      const document: Document = {
        nodeType: BLOCKS.DOCUMENT,
        content: [
          {
            nodeType: BLOCKS.TABLE,
            content: [
              {
                nodeType: BLOCKS.TABLE_ROW,
                content: [
                  {
                    nodeType,
                    content: [],
                    data: {},
                  },
                ],
                data: {},
              },
            ],
            data: {},
          },
        ],
        data: {},
      };

      expect(validateRichTextDocument(document)).toEqual([
        {
          details: 'Size must be at least 1',
          min: 1,
          name: 'size',
          path: ['content', 0, 'content', 0, 'content', 0, 'content'],
          value: [],
        },
      ]);
    },
  );

  it('fails if inline nodes contains something else as a inline node or text', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            {
              nodeType: INLINES.HYPERLINK,
              // @ts-expect-error we force a wrong node type to check that it fails
              content: [{ nodeType: BLOCKS.PARAGRAPH, content: [], data: {} }],
              data: { uri: '' },
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: ['text'],
        name: 'in',
        path: ['content', 0, 'content', 0, 'content', 0, 'nodeType'],
        value: BLOCKS.PARAGRAPH,
      },
    ]);
  });

  it.each([
    BLOCKS.HEADING_1,
    BLOCKS.HEADING_2,
    BLOCKS.HEADING_3,
    BLOCKS.HEADING_4,
    BLOCKS.HEADING_5,
    BLOCKS.HEADING_6,
  ] as const)(
    'fails if the headline node (%s) contains something else as a inline or text node',
    (nodeType) => {
      const document: Document = {
        nodeType: BLOCKS.DOCUMENT,
        content: [
          {
            nodeType,
            content: [
              {
                nodeType: BLOCKS.QUOTE,
                content: [{ nodeType: 'text', value: 'Hello World', data: {}, marks: [] }],
                data: {},
              },
            ],
            data: {},
          },
        ],
        data: {},
      };

      expect(validateRichTextDocument(document)).toEqual([
        {
          details: 'Value must be one of expected values',
          expected: [
            'asset-hyperlink',
            'embedded-entry-inline',
            'embedded-resource-inline',
            'entry-hyperlink',
            'hyperlink',
            'resource-hyperlink',
            'text',
          ],
          name: 'in',
          path: ['content', 0, 'content', 0, 'nodeType'],
          value: BLOCKS.QUOTE,
        },
      ]);
    },
  );

  it('fails on invalid block nodes inside of a quote node', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.QUOTE,
          content: [
            {
              nodeType: BLOCKS.HEADING_1,
              content: [{ nodeType: 'text', value: 'Hello World', data: {}, marks: [] }],
              data: {},
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'Value must be one of expected values',
        expected: [BLOCKS.PARAGRAPH],
        name: 'in',
        path: ['content', 0, 'content', 0, 'nodeType'],
        value: BLOCKS.HEADING_1,
      },
    ]);
  });

  it('fails without value property on text nodes', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            {
              nodeType: 'text',
              value: null,
              data: {},
              marks: [],
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'The type of "value" is incorrect, expected type: String',
        name: 'type',
        path: ['content', 0, 'content', 0, 'value'],
        type: 'String',
        value: null,
      },
    ]);
  });

  it('fails with invalid row/colspan on table cell nodes', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.TABLE,
          content: [
            {
              nodeType: BLOCKS.TABLE_ROW,
              content: [
                {
                  nodeType: BLOCKS.TABLE_CELL,
                  content: [
                    {
                      nodeType: BLOCKS.PARAGRAPH,
                      content: [{ nodeType: 'text', value: 'Hello Table', data: {}, marks: [] }],
                      data: {},
                    },
                  ],
                  data: { rowspan: 'argh' },
                },
              ],
              data: {},
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'The type of "rowspan" is incorrect, expected type: Number',
        name: 'type',
        path: ['content', 0, 'content', 0, 'content', 0, 'data', 'rowspan'],
        type: 'Number',
        value: 'argh',
      },
    ]);
  });

  it.each([
    INLINES.ASSET_HYPERLINK,
    INLINES.ENTRY_HYPERLINK,
    INLINES.RESOURCE_HYPERLINK,
    INLINES.EMBEDDED_ENTRY,
    INLINES.EMBEDDED_RESOURCE,
  ] as const)('fails with invalid properties for %s', (nodeType) => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            {
              nodeType,
              data: {},
              content: [],
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'The property "target" is required here',
        name: 'required',
        path: ['content', 0, 'content', 0, 'data', 'target'],
      },
    ]);
  });

  it('fails with invalid properties for hypperlink node', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            {
              nodeType: INLINES.HYPERLINK,
              data: {},
              content: [],
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([
      {
        details: 'The property "uri" is required here',
        name: 'required',
        path: ['content', 0, 'content', 0, 'data', 'uri'],
      },
    ]);
  });

  it('succeeds with a valid structure', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [{ nodeType: 'text', value: 'Hello World', data: {}, marks: [] }],
          data: {},
        },
        {
          nodeType: BLOCKS.HEADING_1,
          content: [{ nodeType: 'text', value: 'Hello Headline', data: {}, marks: [] }],
          data: {},
        },
        {
          nodeType: BLOCKS.UL_LIST,
          content: [
            {
              nodeType: BLOCKS.LIST_ITEM,
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  content: [{ nodeType: 'text', value: 'Hello List', data: {}, marks: [] }],
                  data: {},
                },
              ],
              data: {},
            },
          ],
          data: {},
        },
        {
          nodeType: BLOCKS.TABLE,
          content: [
            {
              nodeType: BLOCKS.TABLE_ROW,
              content: [
                {
                  nodeType: BLOCKS.TABLE_CELL,
                  content: [
                    {
                      nodeType: BLOCKS.PARAGRAPH,
                      content: [{ nodeType: 'text', value: 'Hello Table', data: {}, marks: [] }],
                      data: {},
                    },
                  ],
                  data: { rowspan: 2, colspan: 2 },
                },
              ],
              data: {},
            },
          ],
          data: {},
        },
      ],
      data: {},
    };

    expect(validateRichTextDocument(document)).toEqual([]);
  });
});
