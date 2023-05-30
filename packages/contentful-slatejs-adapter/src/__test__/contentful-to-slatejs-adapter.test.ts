import toSlatejsDocument from '../contentful-to-slatejs-adapter';
import toContentfulDocument from '../slatejs-to-contentful-adapter';
import * as contentful from './contentful-helpers';

import * as Contentful from '@contentful/rich-text-types';
import { SlateNode } from '../types';

const schema = { blocks: { [Contentful.BLOCKS.EMBEDDED_ENTRY]: { isVoid: true } } };

describe('both adapters (roundtrippable cases)', () => {
  const testAdapters = (
    message: string,
    contentfulDoc: Contentful.Document,
    slateDoc: SlateNode[],
  ) => {
    describe('toSlatejsDocument()', () => {
      it(message, () => {
        const actualSlateDoc = toSlatejsDocument({
          document: contentfulDoc,
          schema,
        });
        expect(actualSlateDoc).toEqual(slateDoc);
      });

      it('converts Contentful mentions to Slate mentions', () => {
        const contentfulInput = {
          content: [
            {
              content: [
                { data: {}, marks: [], nodeType: 'text', value: 'Hello ' },
                {
                  content: [{ data: {}, marks: [], nodeType: 'text', value: '' }],
                  data: { target: { sys: { id: 'user-id-0', linkType: 'User', type: 'Link' } } },
                  nodeType: 'mention',
                },
                { data: {}, marks: [], nodeType: 'text', value: '' },
              ],
              data: {},
              nodeType: 'paragraph',
            },
          ],
          data: {},
          nodeType: 'document',
        };
        const slateOutput = toSlatejsDocument({
          document: contentfulInput as unknown as Contentful.Document,
        });

        const expectedSlateOutput = [
          {
            type: 'paragraph',
            isVoid: false,
            data: {},
            children: [
              {
                data: {},
                text: 'Hello ',
              },
              {
                type: 'mention',
                isVoid: false,
                data: {
                  target: {
                    sys: {
                      type: 'Link',
                      linkType: 'User',
                      id: 'user-id-0',
                    },
                  },
                },
                children: [
                  {
                    data: {},
                    text: '',
                  },
                ],
              },
              {
                data: {},
                text: '',
              },
            ],
          },
        ];
        expect(slateOutput).toStrictEqual(expectedSlateOutput);
      });
      // it.only('adds comment data', () => {
      //   const JSONPATH1 = 'content[0].content[1]';
      //   // would there be a jsonpath2?
      //   const comment = {
      //     metadata: {
      //       range: [JSONPATH1],
      //       originalText: 'irure dolor',
      //     },
      //     body: 'My comment is this',
      //     id: 'commentId',
      //   };
      //   const contentfulInput = {
      //     nodeType: 'document',
      //     data: {},
      //     content: [
      //       {
      //         nodeType: 'paragraph',
      //         data: {},
      //         content: [
      //           {
      //             nodeType: 'text',
      //             value:
      //               'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute ',
      //             marks: [],
      //             data: {},
      //           },
      //           {
      //             nodeType: 'text',
      //             value: 'irure dolor', // here is where the comment would go
      //             marks: [],
      //             data: {},
      //           },
      //           {
      //             nodeType: 'text',
      //             value:
      //               ' in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      //             marks: [],
      //             data: {},
      //           },
      //         ],
      //       },
      //     ],
      //   };
      //   const slateOutput = toSlatejsDocument({
      //     document: contentfulInput as unknown as Contentful.Document,
      //     comments: [comment],
      //   });

      //   const expectedSlateOutput = [
      //     {
      //       type: 'paragraph',
      //       isVoid: false,
      //       data: {},
      //       children: [
      //         {
      //           data: {},
      //           text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute ',
      //         },
      //         {
      //           data: {
      //             comment: {
      //               sys: {
      //                 id: 'commentId',
      //                 linkType: 'Comment',
      //                 type: 'Link',
      //               },
      //             },
      //           },
      //           text: 'irure dolor',
      //         },
      //         {
      //           data: {},
      //           text: ' in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      //         },
      //       ],
      //     },
      //   ];

      //   expect(slateOutput).toStrictEqual(expectedSlateOutput);
      // });
    });
    describe.only('toContentfulDocument()', () => {
      it(message, () => {
        const actualContentfulDoc = toContentfulDocument({
          document: slateDoc,
          schema,
        });
        expect(actualContentfulDoc).toEqual(contentfulDoc);
      });
      it('removes comment data from Slate document', () => {
        const slateInput = [
          {
            type: 'paragraph',
            isVoid: false,
            data: {},
            children: [
              {
                data: {},
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute ',
              },
              {
                data: {
                  comment: {
                    sys: {
                      id: 'commentId',
                      linkType: 'Comment',
                      type: 'Link',
                    },
                  },
                },
                text: 'irure dolor',
              },
              {
                data: {},
                text: ' in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              },
            ],
          },
        ];

        const expectedContentfulOutput = {
          nodeType: 'document',
          data: {},
          content: [
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute ',
                  marks: [],
                  data: {},
                },
                {
                  nodeType: 'text',
                  value: 'irure dolor', // here is where the comment would go
                  marks: [],
                  data: {},
                },
                {
                  nodeType: 'text',
                  value:
                    ' in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        };

        const actualContentfulOutput = toContentfulDocument({
          document: slateInput as unknown as SlateNode[],
        });

        expect(actualContentfulOutput).toStrictEqual(expectedContentfulOutput);
      });
      it('is converts Slate mentions to Contentful mentions', () => {
        const slateFormatWithMention = [
          {
            type: 'paragraph',
            data: {},
            children: [
              {
                text: 'Hello ',
              },
              {
                type: 'mention',
                data: {
                  target: {
                    sys: {
                      type: 'Link',
                      linkType: 'User',
                      id: 'user-id-0',
                    },
                  },
                },
                children: [
                  {
                    text: '',
                  },
                ],
              },
              {
                text: '',
              },
            ],
          },
        ];

        const resultContentfulDoc = toContentfulDocument({
          document: slateFormatWithMention as unknown as SlateNode[],
          schema,
        });

        const expectedContentfulDoc = {
          content: [
            {
              content: [
                { data: {}, marks: [], nodeType: 'text', value: 'Hello ' },
                {
                  content: [{ data: {}, marks: [], nodeType: 'text', value: '' }],
                  data: { target: { sys: { id: 'user-id-0', linkType: 'User', type: 'Link' } } },
                  nodeType: 'mention',
                },
                { data: {}, marks: [], nodeType: 'text', value: '' },
              ],
              data: {},
              nodeType: 'paragraph',
            },
          ],
          data: {},
          nodeType: 'document',
        };

        expect(resultContentfulDoc).toEqual(expectedContentfulDoc);
      });
      it('converts text-only nodes', () => {
        const slateText = [
          {
            type: 'paragraph',
            data: {},
            children: [
              {
                text: 'Hello ',
              },
            ],
          },
        ];

        const convertedToContentful = toContentfulDocument({
          document: slateText as unknown as SlateNode[],
        });

        const expectedContentfulDoc = {
          content: [
            {
              content: [{ data: {}, marks: [], nodeType: 'text', value: 'Hello ' }],
              data: {},
              nodeType: 'paragraph',
            },
          ],
          data: {},
          nodeType: 'document',
        };

        expect(convertedToContentful).toStrictEqual(expectedContentfulDoc);
      });
    });
  };

  describe('document', () => {
    testAdapters('empty document', contentful.document(), []);

    testAdapters(
      'document with block',
      contentful.document(contentful.block(Contentful.BLOCKS.PARAGRAPH, contentful.text(''))),
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: {},
          isVoid: false,
          children: [
            {
              text: '',
              data: {},
            },
          ],
        },
      ],
    );

    testAdapters(
      'paragraph with inline',
      contentful.document(
        contentful.block(
          Contentful.BLOCKS.PARAGRAPH,
          contentful.inline(Contentful.INLINES.HYPERLINK),
        ),
      ),
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: {},
          isVoid: false,
          children: [
            {
              type: Contentful.INLINES.HYPERLINK,
              data: {},
              isVoid: false,
              children: [],
            },
          ],
        },
      ],
    );

    testAdapters(
      'paragraph with text',
      contentful.document(contentful.block(Contentful.BLOCKS.PARAGRAPH, contentful.text('hi'))),
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: {},
          isVoid: false,
          children: [{ text: 'hi', data: {} }],
        },
      ],
    );

    testAdapters(
      'text with marks',
      contentful.document(
        contentful.block(
          Contentful.BLOCKS.PARAGRAPH,
          contentful.text('this'),
          contentful.text('is', contentful.mark('bold')),
        ),
      ),
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: {},
          isVoid: false,
          children: [
            { text: 'this', data: {} },
            { text: 'is', data: {}, bold: true },
          ],
        },
      ],
    );

    it('adds a default value to marks if undefined', () => {
      const slateDoc = [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: {},
          isVoid: false,
          children: [{ text: 'Hi', data: {} }],
        },
      ];
      const ctflDoc = toContentfulDocument({
        document: slateDoc,
      });
      expect(ctflDoc).toEqual(
        contentful.document(
          contentful.block(Contentful.BLOCKS.PARAGRAPH, {
            nodeType: 'text',
            marks: [],
            data: {},
            value: 'Hi',
          }),
        ),
      );
    });

    testAdapters(
      'text with multiple marks',
      contentful.document(
        contentful.block(
          Contentful.BLOCKS.PARAGRAPH,
          contentful.text('this'),
          contentful.text('is', contentful.mark('bold')),
          contentful.text('huge', contentful.mark('bold'), contentful.mark('italic')),
        ),
      ),
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: {},
          isVoid: false,
          children: [
            { text: 'this', data: {} },
            { text: 'is', data: {}, bold: true },
            { text: 'huge', data: {}, bold: true, italic: true },
          ],
        },
      ],
    );

    testAdapters(
      'document with nested blocks',
      contentful.document(
        contentful.block(
          Contentful.BLOCKS.PARAGRAPH,
          contentful.text('this is a test', contentful.mark('bold')),
          contentful.text('paragraph', contentful.mark('underline')),
        ),
        contentful.block(
          Contentful.BLOCKS.QUOTE,
          contentful.block(Contentful.BLOCKS.PARAGRAPH, contentful.text('this is it')),
        ),
      ),
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: {},
          isVoid: false,
          children: [
            { text: 'this is a test', data: {}, bold: true },
            { text: 'paragraph', data: {}, underline: true },
          ],
        },
        {
          type: Contentful.BLOCKS.QUOTE,
          data: {},
          isVoid: false,
          children: [
            {
              type: Contentful.BLOCKS.PARAGRAPH,
              data: {},
              isVoid: false,
              children: [{ text: 'this is it', data: {} }],
            },
          ],
        },
      ],
    );
  });

  describe('converts additional data', () => {
    testAdapters(
      'data in block',
      {
        nodeType: Contentful.BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: Contentful.BLOCKS.PARAGRAPH,
            content: [
              {
                nodeType: 'text',
                marks: [],
                data: {},
                value: '',
              },
            ],
            data: { a: 1 },
          },
        ],
      },
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: { a: 1 },
          isVoid: false,
          children: [{ text: '', data: {} }],
        },
      ],
    );

    testAdapters(
      'data in inline',
      {
        nodeType: Contentful.BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: Contentful.BLOCKS.PARAGRAPH,
            data: { a: 1 },
            content: [
              {
                nodeType: Contentful.INLINES.HYPERLINK,
                data: { a: 2 },
                content: [],
              },
            ],
          },
        ],
      },
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: { a: 1 },
          isVoid: false,
          children: [
            {
              type: Contentful.INLINES.HYPERLINK,
              data: { a: 2 },
              isVoid: false,
              children: [],
            },
          ],
        },
      ],
    );

    testAdapters(
      'data in text',
      {
        nodeType: Contentful.BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: Contentful.BLOCKS.PARAGRAPH,
            data: { a: 1 },
            content: [
              {
                nodeType: Contentful.INLINES.HYPERLINK,
                data: { a: 2 },
                content: [
                  {
                    nodeType: 'text',
                    marks: [],
                    data: { a: 3 },
                    value: 'YO',
                  },
                ],
              },
            ],
          },
        ],
      },
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: { a: 1 },
          isVoid: false,
          children: [
            {
              type: Contentful.INLINES.HYPERLINK,
              data: { a: 2 },
              isVoid: false,
              children: [
                {
                  text: 'YO',
                  data: { a: 3 },
                },
              ],
            },
          ],
        },
      ],
    );
  });

  describe('sets isVoid from schema', () => {
    testAdapters(
      'data in block',
      {
        nodeType: Contentful.BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: Contentful.BLOCKS.EMBEDDED_ENTRY,
            content: [],
            data: { a: 1 },
          },
        ],
      },
      [
        {
          type: Contentful.BLOCKS.EMBEDDED_ENTRY,
          data: { a: 1 },
          isVoid: true,
          children: [],
        },
      ],
    );

    test('removes empty text nodes from void nodes content', () => {
      const contentfulDoc: Contentful.Document = {
        nodeType: Contentful.BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: Contentful.BLOCKS.EMBEDDED_ENTRY,
            content: [],
            data: { a: 1 },
          },
        ],
      };

      const slateDoc = [
        {
          type: Contentful.BLOCKS.EMBEDDED_ENTRY,
          data: { a: 1 },
          isVoid: true,
          children: [{ text: '', data: {} }],
        },
      ];

      const actualContentfulDoc = toContentfulDocument({
        document: slateDoc,
        schema,
      });
      expect(actualContentfulDoc).toEqual(contentfulDoc);
    });
  });
});

describe('toSlatejsDocument() adapter (non-roundtrippable cases)', () => {
  // `content` for any TEXT_CONTAINER contentful node could be empty according to our
  // validation rules, but SlateJS could crash if there isn't a text leaf.
  it('inserts empty text nodes into text container blocks with empty `content`', () => {
    const cfDoc = {
      nodeType: Contentful.BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: Contentful.BLOCKS.PARAGRAPH,
          content: [] as any,
          data: {},
        },
        {
          nodeType: Contentful.BLOCKS.HEADING_1,
          content: [] as any,
          data: {},
        },
        {
          nodeType: Contentful.BLOCKS.HEADING_6,
          content: [] as any,
          data: { a: 42 },
        },
      ],
    } as Contentful.Document;
    const expectedSlateDoc = [
      {
        type: Contentful.BLOCKS.PARAGRAPH,
        data: {},
        isVoid: false,
        children: [{ text: '', data: {} }],
      },
      {
        type: Contentful.BLOCKS.HEADING_1,
        data: {},
        isVoid: false,
        children: [{ text: '', data: {} }],
      },
      {
        type: Contentful.BLOCKS.HEADING_6,
        data: { a: 42 },
        isVoid: false,
        children: [{ text: '', data: {} }],
      },
    ];
    const actualSlateDoc = toSlatejsDocument({
      document: cfDoc,
      schema,
    });
    expect(actualSlateDoc).toEqual(expectedSlateDoc);
  });
});

describe('toContentfulDocument()}; adapter (non-roundtrippable cases)', () => {
  it('neither inserts nor removes empty text nodes on container blocks with empty `children`', () => {
    const slateDoc = [
      {
        type: Contentful.BLOCKS.HEADING_1,
        data: {},
        isVoid: false,
        children: [{ text: '', data: {} }],
      },
      {
        type: Contentful.BLOCKS.PARAGRAPH,
        data: {},
        isVoid: false,
        children: [{ text: '', data: {} }],
      },
      {
        type: Contentful.BLOCKS.PARAGRAPH,
        data: {},
        isVoid: false,
        children: [],
      },
      {
        type: Contentful.BLOCKS.HEADING_2,
        data: {},
        isVoid: false,
        children: [],
      },
    ];
    const expectedCfDoc = {
      nodeType: Contentful.BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: Contentful.BLOCKS.HEADING_1,
          content: [
            {
              nodeType: 'text',
              marks: [] as any,
              data: {},
              value: '',
            },
          ],
          data: {},
        },
        {
          nodeType: Contentful.BLOCKS.PARAGRAPH,
          content: [
            {
              nodeType: 'text',
              marks: [],
              data: {},
              value: '',
            },
          ],
          data: {},
        },
        {
          nodeType: Contentful.BLOCKS.PARAGRAPH,
          content: [
            {
              nodeType: 'text',
              marks: [],
              data: {},
              value: '',
            },
          ],
          data: {},
        },
        {
          nodeType: Contentful.BLOCKS.HEADING_2,
          content: [
            {
              nodeType: 'text',
              marks: [],
              data: {},
              value: '',
            },
          ],
          data: {},
        },
      ],
    };
    const actualCfDoc = toContentfulDocument({
      document: slateDoc,
      schema,
    });
    expect(actualCfDoc).toEqual(expectedCfDoc);
  });
});
