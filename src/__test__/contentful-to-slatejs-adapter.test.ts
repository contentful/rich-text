import toSlatejsDocument from '../contentful-to-slatejs-adapter';
import toContentfulDocument from '../slatejs-to-contentful-adapter';
import * as Contentful from '@contentful/structured-text-types';

import * as slate from './slate-helpers';
import * as contentful from './contentful-helpers';

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
          schema: { blocks: { voidnode: { isVoid: true } } },
        });
        expect(actualSlateDoc).toEqual(slateDoc);
      });
    });
    describe('toContentfulDocument()', () => {
      it(message, () => {
        const actualContentfulDoc = toContentfulDocument(slateDoc);
        expect(actualContentfulDoc).toEqual(contentfulDoc);
      });
    });
  };

  describe('document', () => {
    testAdapters('empty document', contentful.document(), slate.document());

    testAdapters(
      'document with block',
      contentful.document(contentful.block('paragraph', contentful.text(''))),
      slate.document(slate.block('paragraph', false, slate.text(slate.leaf('')))),
    );

    testAdapters(
      'paragraph with inline',
      contentful.document(contentful.block('paragraph', contentful.inline('hyperlink'))),
      slate.document(slate.block('paragraph', false, slate.inline('hyperlink', false))),
    );

    testAdapters(
      'paragraph with text',
      contentful.document(contentful.block('paragraph', contentful.text('hi'))),
      slate.document(slate.block('paragraph', false, slate.text(slate.leaf('hi')))),
    );

    testAdapters(
      'text with marks',
      contentful.document(
        contentful.block(
          'paragraph',
          contentful.text('this'),
          contentful.text('is', contentful.mark('bold')),
        ),
      ),
      slate.document(
        slate.block(
          'paragraph',
          false,
          slate.text(slate.leaf('this')),
          slate.text(slate.leaf('is', slate.mark('bold'))),
        ),
      ),
    );

    it('adds a default value to marks if undefined', () => {
      const slateDoc = slate.document(
        slate.block(
          'paragraph',
          false,
          slate.text({ marks: undefined, object: 'leaf', text: 'Hi' }),
        ),
      );
      const ctflDoc = toContentfulDocument(slateDoc);
      expect(ctflDoc).toEqual(
        contentful.document(
          contentful.block('paragraph', {
            nodeType: 'text',
            nodeClass: 'text',
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
          'paragraph',
          contentful.text('this'),
          contentful.text('is', contentful.mark('bold')),
          contentful.text('huge', contentful.mark('bold'), contentful.mark('italic')),
        ),
      ),
      slate.document(
        slate.block(
          'paragraph',
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
          'paragraph',
          contentful.text('this is a test', contentful.mark('bold')),
          contentful.text('paragraph', contentful.mark('underline')),
        ),
        contentful.block('block', contentful.block('block', contentful.text('this is it'))),
      ),
      slate.document(
        slate.block(
          'paragraph',
          false,
          slate.text(slate.leaf('this is a test', slate.mark('bold'))),
          slate.text(slate.leaf('paragraph', slate.mark('underline'))),
        ),
        slate.block(
          'block',
          false,
          slate.block('block', false, slate.text(slate.leaf('this is it'))),
        ),
      ),
    );
  });

  describe('converts additional data', () => {
    testAdapters(
      'data in block',
      {
        nodeClass: 'document',
        nodeType: Contentful.BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeClass: 'block',
            nodeType: 'paragraph',
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
            type: 'paragraph',
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
        nodeClass: 'document',
        nodeType: Contentful.BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeClass: 'block',
            nodeType: 'paragraph',
            data: { a: 1 },
            content: [
              {
                nodeClass: 'inline',
                nodeType: 'hyperlink',
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
            type: 'paragraph',
            isVoid: false,
            data: { a: 1 },
            nodes: [
              {
                object: 'inline',
                type: 'hyperlink',
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
        nodeClass: 'document',
        nodeType: Contentful.BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeClass: 'block',
            nodeType: 'paragraph',
            data: { a: 1 },
            content: [
              {
                nodeClass: 'inline',
                nodeType: 'hyperlink',
                data: { a: 2 },
                content: [],
              },
              {
                nodeClass: 'text',
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
            type: 'paragraph',
            isVoid: false,
            data: { a: 1 },
            nodes: [
              {
                object: 'inline',
                type: 'hyperlink',
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
        nodeClass: 'document',
        nodeType: Contentful.BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeClass: 'block',
            nodeType: 'voidnode',
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
            type: 'voidnode',
            isVoid: true,
            data: { a: 1 },
            nodes: [],
          },
        ],
      },
    );
  });
});
