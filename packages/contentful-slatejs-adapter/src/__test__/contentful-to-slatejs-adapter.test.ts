import toSlatejsDocument from '../contentful-to-slatejs-adapter';
import toContentfulDocument from '../slatejs-to-contentful-adapter';
import * as Contentful from '@contentful/rich-text-types';

import * as slate from './slate-helpers';
import * as contentful from './contentful-helpers';

const schema = { blocks: { [Contentful.BLOCKS.EMBEDDED_ENTRY]: { isVoid: true } } };

describe('adapters', () => {
  const testAdapters = (
    message: string,
    contentfulDoc: Contentful.Document,
    slateDoc: Slate.Document,
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
    testAdapters('empty document', contentful.document(), slate.document());

    testAdapters(
      'document with block',
      contentful.document(contentful.block(Contentful.BLOCKS.PARAGRAPH, contentful.text(''))),
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          children: [
            { text: '' }
          ]
        }
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
          children: [
            { type: Contentful.INLINES.HYPERLINK }
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
          children: [
            { text: 'hi' }
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
          children: [
            { text: 'this' },
            { text: 'is', bold: true },
          ],
        },
      ],
    );

    it('adds a default value to marks if undefined', () => {
      const slateDoc = [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          children: [
            { text: 'Hi' }
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
          children: [
            { text: 'this' },
            { text: 'is', bold: true },
            { text: 'huge', bold: true, italic: true },
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
          children: [
            { text: 'this is a test', bold: true },
            { type: 'paragraph', underline: true },
          ],
        },
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          children: [
            { text: 'this is it' },
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
          children: [
            {
              type: Contentful.INLINES.HYPERLINK,
              data: { a: 2 },
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
                content: [],
              },
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
      [
        {
          type: Contentful.BLOCKS.PARAGRAPH,
          data: { a: 1 },
          children: [
            {
              type: Contentful.INLINES.HYPERLINK,
              data: { a: 2 },
              children: [
                {
                  text: 'YO',
                  data: { a: 3 },
              ]
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

      const slateDoc: Slate.Document = [
        {
          type: Contentful.BLOCKS.EMBEDDED_ENTRY,
          data: { a: 1 },
          isVoid: true,
          children: [
            { text: '' },
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
