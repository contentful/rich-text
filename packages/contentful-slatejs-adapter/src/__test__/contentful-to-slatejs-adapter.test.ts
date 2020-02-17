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
      slate.document(slate.block(Contentful.BLOCKS.PARAGRAPH, false, slate.text(slate.leaf('')))),
    );

    testAdapters(
      'paragraph with inline',
      contentful.document(
        contentful.block(
          Contentful.BLOCKS.PARAGRAPH,
          contentful.inline(Contentful.INLINES.HYPERLINK),
        ),
      ),
      slate.document(
        slate.block(
          Contentful.BLOCKS.PARAGRAPH,
          false,
          slate.inline(Contentful.INLINES.HYPERLINK, false),
        ),
      ),
    );

    testAdapters(
      'paragraph with text',
      contentful.document(contentful.block(Contentful.BLOCKS.PARAGRAPH, contentful.text('hi'))),
      slate.document(slate.block(Contentful.BLOCKS.PARAGRAPH, false, slate.text(slate.leaf('hi')))),
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
      slate.document(
        slate.block(
          Contentful.BLOCKS.PARAGRAPH,
          false,
          slate.text(slate.leaf('this')),
          slate.text(slate.leaf('is', slate.mark('bold'))),
        ),
      ),
    );

    it('adds a default value to marks if undefined', () => {
      const slateDoc = slate.document(
        slate.block(
          Contentful.BLOCKS.PARAGRAPH,
          false,
          slate.text({ marks: undefined, object: 'leaf', text: 'Hi' }),
        ),
      );
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
      slate.document(
        slate.block(
          Contentful.BLOCKS.PARAGRAPH,
          false,
          slate.text(slate.leaf('this')),
          slate.text(slate.leaf('is', slate.mark('bold'))),
          slate.text(slate.leaf('huge', slate.mark('bold'), slate.mark('italic'))),
        ),
      ),
    );

    testAdapters(
      'document with nested blocks',
      contentful.document(
        contentful.block(
          Contentful.BLOCKS.PARAGRAPH,
          contentful.text('this is a test', contentful.mark('bold')),
          contentful.text(Contentful.BLOCKS.PARAGRAPH, contentful.mark('underline')),
        ),
        contentful.block(
          Contentful.BLOCKS.QUOTE,
          contentful.block(Contentful.BLOCKS.PARAGRAPH, contentful.text('this is it')),
        ),
      ),
      slate.document(
        slate.block(
          Contentful.BLOCKS.PARAGRAPH,
          false,
          slate.text(slate.leaf('this is a test', slate.mark('bold'))),
          slate.text(slate.leaf(Contentful.BLOCKS.PARAGRAPH, slate.mark('underline'))),
        ),
        slate.block(
          Contentful.BLOCKS.QUOTE,
          false,
          slate.block(Contentful.BLOCKS.PARAGRAPH, false, slate.text(slate.leaf('this is it'))),
        ),
      ),
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
      {
        object: 'document',
        data: {},
        nodes: [
          {
            object: 'block',
            type: Contentful.BLOCKS.PARAGRAPH,
            isVoid: false,
            data: { a: 1 },
            nodes: [],
          },
        ],
      },
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
      {
        object: 'document',
        data: {},
        nodes: [
          {
            object: 'block',
            type: Contentful.BLOCKS.PARAGRAPH,
            isVoid: false,
            data: { a: 1 },
            nodes: [
              {
                object: 'inline',
                type: Contentful.INLINES.HYPERLINK,
                isVoid: false,
                data: {
                  a: 2,
                },
                nodes: [],
              },
            ],
          },
        ],
      },
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
      {
        object: 'document',
        data: {},
        nodes: [
          {
            object: 'block',
            type: Contentful.BLOCKS.PARAGRAPH,
            isVoid: false,
            data: { a: 1 },
            nodes: [
              {
                object: 'inline',
                type: Contentful.INLINES.HYPERLINK,
                isVoid: false,
                data: {
                  a: 2,
                },
                nodes: [],
              },
              {
                object: 'text',
                data: { a: 3 },
                leaves: [
                  {
                    object: 'leaf',
                    marks: [],
                    text: 'YO',
                  },
                ],
              },
            ],
          },
        ],
      },
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
      {
        object: 'document',
        data: {},
        nodes: [
          {
            object: 'block',
            type: Contentful.BLOCKS.EMBEDDED_ENTRY,
            isVoid: true,
            data: { a: 1 },
            nodes: [],
          },
        ],
      },
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

      const slateDoc: Slate.Document = {
        object: 'document',
        type: 'document',
        data: {},
        nodes: [
          {
            object: 'block',
            type: Contentful.BLOCKS.EMBEDDED_ENTRY,
            isVoid: true,
            data: { a: 1 },
            nodes: [
              {
                object: 'text',
                data: {},
                leaves: [
                  {
                    object: 'leaf',
                    marks: [],
                    text: '',
                  },
                ],
              },
            ],
          },
        ],
      };

      const actualContentfulDoc = toContentfulDocument({
        document: slateDoc,
        schema,
      });
      expect(actualContentfulDoc).toEqual(contentfulDoc);
    });
  });
});
