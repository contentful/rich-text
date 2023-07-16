import { Document, BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToMarkdown } from '..';

describe('convertRtfToMarkdown', () => {
  it('converts paragraph to markdown', () => {
    const rtf: any = {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'This is a paragraph.',
          marks: [],
        },
      ],
    };

    const markdown = documentToMarkdown(rtf);

    expect(markdown).toBe('This is a paragraph.');
  });

  it('converts heading 1 to markdown', () => {
    const rtf: any = {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'heading-1',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Heading 1',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const markdown = documentToMarkdown(rtf);

    expect(markdown).toBe('# Heading 1\n');
  });

  it('converts lists', () => {
    const rtf: any = {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Paragraph with list:',
              marks: [],
              data: {},
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
                      value: 'First',
                      marks: [],
                      data: {},
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
                      value: 'Second',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Content',
              marks: [],
              data: {},
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
                      value: 'Third',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(documentToMarkdown(rtf)).toBe(
      `Paragraph with list:\n\n- First\n\n- Second\n\nContent\n\n- Third\n\n`,
    );
  });

  it('supports ordered lists', () => {
    const rtf: any = {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Paragraph with ordered list:',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: 'ordered-list',
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
                      value: 'First',
                      marks: [],
                      data: {},
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
                      value: 'Second',
                      marks: [],
                      data: {},
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
                      value: 'Third',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(documentToMarkdown(rtf)).toBe(
      `Paragraph with ordered list:\n\n1. First\n\n2. Second\n\n3. Third\n\n`,
    );
  });

  it('converts inline code', () => {
    const rtf: any = {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'This is ',
          marks: [],
        },
        {
          nodeType: 'text',
          value: 'inline code',
          marks: [{ type: 'code' }],
        },
        {
          nodeType: 'text',
          value: ' example',
          marks: [],
        },
      ],
    };

    const markdown = documentToMarkdown(rtf);

    expect(markdown).toBe('This is `inline code` example');
  });

  it('converts italic', () => {
    const rtf: any = {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'This is ',
          marks: [],
        },
        {
          nodeType: 'text',
          value: 'italic text',
          marks: [{ type: 'italic' }],
        },
        {
          nodeType: 'text',
          value: ' example',
          marks: [],
        },
      ],
    };

    const markdown = documentToMarkdown(rtf);

    expect(markdown).toBe('This is *italic text* example');
  });

  it('converts strong emphasis', () => {
    const rtf: any = {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'This is ',
          marks: [],
        },
        {
          nodeType: 'text',
          value: 'strongly emphasized text',
          marks: [{ type: 'bold' }],
        },
        {
          nodeType: 'text',
          value: ' example',
          marks: [],
        },
      ],
    };

    const markdown = documentToMarkdown(rtf);

    expect(markdown).toBe('This is **strongly emphasized text** example');
  });

  it('converts strikethrough', () => {
    const rtf: any = {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'This is ',
          marks: [],
        },
        {
          nodeType: 'text',
          value: 'strikethrough text',
          marks: [{ type: 'underline' }],
        },
        {
          nodeType: 'text',
          value: ' example',
          marks: [],
        },
      ],
    };

    const markdown = documentToMarkdown(rtf);

    expect(markdown).toBe('This is ~~strikethrough text~~ example');
  });

  it('converts links', () => {
    const rtf: any = {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'This is a ',
          marks: [],
        },
        {
          nodeType: 'hyperlink',
          data: {
            uri: 'https://example.com',
          },
          content: [
            {
              nodeType: 'text',
              value: 'link',
              marks: [],
              data: {},
            },
          ],
        },
        ,
        {
          nodeType: 'text',
          value: ' example',
          marks: [],
        },
      ],
    };

    const markdown = documentToMarkdown(rtf);

    expect(markdown).toBe('This is a [link](https://example.com) example');
  });

  it('handles null or undefined input', () => {
    const markdown = documentToMarkdown(null);

    expect(markdown).toBe('');
  });

  it('handles empty content', () => {
    const rtf: any = {
      nodeType: 'paragraph',
      content: [],
    };

    const markdown = documentToMarkdown(rtf);

    expect(markdown).toBe('');
  });

  it('supports custom renderers', () => {
    const rtf: any = {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'heading-1',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Heading 1',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    expect(
      documentToMarkdown(rtf, {
        renderNode: {
          [BLOCKS.HEADING_1]: (node: any, next: any) => `${next(node.content)}\n-\n`,
        },
      }),
    ).toBe('Heading 1\n-\n');
  });

  it('does not escape especial characters', () => {
    const rtf: any = {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'heading-1',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: "Hi, I'm Miguel!",
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const markdown = documentToMarkdown(rtf);

    expect(markdown).toBe("# Hi, I'm Miguel!\n");
  });

  it('converts nested lists', () => {
    const rtf: any = {
      nodeType: 'document',
      data: {},
      content: [
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
                      value: 'First',
                      marks: [],
                      data: {},
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
                              value: 'Nested',
                              marks: [],
                              data: {},
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
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Second',
                      marks: [],
                      data: {},
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
                              value: 'Nested 2',
                              marks: [],
                              data: {},
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
      ],
    };

    expect(documentToMarkdown(rtf)).toBe(`- First\n\n\t- Nested\n\n- Second\n\n\t- Nested 2\n\n`);
  });
});
