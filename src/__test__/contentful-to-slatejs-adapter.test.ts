import toSlatejsDocument from '../contentful-to-slatejs-adapter';
import toContentfulDocument from '../slatejs-to-contentful-adapter';
import * as Contentful from '@contentful/structured-text-types';

import * as slate from './slate-helpers';
import * as contentful from './contentful-helpers';

describe('toSlatejsDocument', () => {
  const testFactory = (
    message: string,
    contentfulDoc: Contentful.Document,
    expected: Slate.Document,
  ) => {
    it(message, () => {
      const actualSlateDoc = toSlatejsDocument(contentfulDoc);
      expect(actualSlateDoc).toEqual(expected);
      const actualContentfulDoc = toContentfulDocument(actualSlateDoc);
      expect(actualContentfulDoc).toEqual(contentfulDoc);
    });
  };

  describe('document', () => {
    testFactory('empty document', contentful.document(), slate.document());

    testFactory(
      'document with paragraph',
      contentful.document(contentful.block('paragraph', contentful.text(''))),
      slate.document(slate.block('paragraph', slate.text(slate.leaf('')))),
    );

    testFactory(
      'paragraph with inline',
      contentful.document(contentful.block('paragraph', contentful.inline('hyperlink'))),
      slate.document(slate.block('paragraph', slate.inline('hyperlink'))),
    );

    testFactory(
      'paragraph with text',
      contentful.document(contentful.block('paragraph', contentful.text('hi'))),
      slate.document(slate.block('paragraph', slate.text(slate.leaf('hi')))),
    );

    testFactory(
      'text with mark',
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
          slate.text(slate.leaf('this')),
          slate.text(slate.leaf('is', contentful.mark('bold'))),
        ),
      ),
    );

    testFactory(
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
          slate.text(slate.leaf('this')),
          slate.text(slate.leaf('is', slate.mark('bold'))),
          slate.text(slate.leaf('huge', slate.mark('bold'), slate.mark('italic'))),
        ),
      ),
    );

    testFactory(
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
          slate.text(slate.leaf('this is a test', slate.mark('bold'))),
          slate.text(slate.leaf('paragraph', slate.mark('underline'))),
        ),
        slate.block('block', slate.block('block', slate.text(slate.leaf('this is it')))),
      ),
    );
  });

  describe('converts additional data', () => {
    testFactory(
      'data in block',
      {
        nodeClass: 'document',
        nodeType: Contentful.BLOCKS.DOCUMENT,
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
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            data: { a: 1 },
            nodes: [],
          },
        ],
      },
    );

    testFactory(
      'data in inline',
      {
        nodeClass: 'document',
        nodeType: Contentful.BLOCKS.DOCUMENT,
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
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            data: { a: 1 },
            nodes: [
              {
                object: 'inline',
                type: 'hyperlink',
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

    testFactory(
      'data in text',
      {
        nodeClass: 'document',
        nodeType: Contentful.BLOCKS.DOCUMENT,
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
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            data: { a: 1 },
            nodes: [
              {
                object: 'inline',
                type: 'hyperlink',
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
});
