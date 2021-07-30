import toSlatejsDocument from '../contentful-to-slatejs-adapter';
import toContentfulDocument from '../slatejs-to-contentful-adapter';
import * as contentful from './contentful-helpers';

import * as Contentful from '@contentful/rich-text-types';
import { SlateNode } from '../types';

const schema = { blocks: { [Contentful.BLOCKS.EMBEDDED_ENTRY]: { isVoid: true } } };

describe('adapters', () => {
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
    });
    describe('toContentfulDocument()', () => {
      it(message, () => {
        const actualContentfulDoc = toContentfulDocument({
          document: slateDoc,
          schema,
        });
        expect(actualContentfulDoc).toEqual(contentfulDoc);
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
            }
          ]
        }
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
          children: [
            { text: 'hi', data: {} }
          ]
        }
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
          children: [
            { text: 'Hi', data: {} }
          ]
        }
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
              children: [
                { text: 'this is it', data: {} },
              ],
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
            content: [],
            data: { a: 1 },
          },
        ],
      },
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: { a: 1 },
          isVoid: false,
          children: [],
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
          children: [
            { text: '', data: {} },
          ]
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
