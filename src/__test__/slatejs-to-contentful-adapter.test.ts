import toContentfulDocument from '../slatejs-to-contentful-adapter';

import * as slate from './slate-helpers';
import * as contentful from './contentful-helpers';

describe('toContentfulDocument', () => {
  const testFactory = (message: string, input: Slate.Document, expected: Contentful.Document) => {
    it(message, () => {
      const actual = toContentfulDocument(input);
      expect(actual).toEqual(expected);
    });
  };

  testFactory('empty document', slate.document(), contentful.document());

  testFactory(
    'document with paragraph',
    slate.document(slate.block('paragraph', slate.text(slate.leaf('')))),
    contentful.document(contentful.block('paragraph', contentful.text(''))),
  );

  testFactory(
    'paragraph with inline',
    slate.document(slate.block('paragraph', slate.inline('hyperlink'))),
    contentful.document(contentful.block('paragraph', contentful.inline('hyperlink'))),
  );

  testFactory(
    'paragraph with text',
    slate.document(slate.block('paragraph', slate.text(slate.leaf('hi')))),
    contentful.document(contentful.block('paragraph', contentful.text('hi'))),
  );

  testFactory(
    'text with mark',
    slate.document(
      slate.block(
        'paragraph',
        slate.text(slate.leaf('this'), slate.leaf('is', contentful.mark('bold'))),
      ),
    ),
    contentful.document(
      contentful.block(
        'paragraph',
        contentful.text('this'),
        contentful.text('is', contentful.mark('bold')),
      ),
    ),
  );

  testFactory(
    'text with multiple marks',
    slate.document(
      slate.block(
        'paragraph',
        slate.text(
          slate.leaf('this'),
          slate.leaf('is', slate.mark('bold')),
          slate.leaf('huge', slate.mark('bold'), slate.mark('italic')),
        ),
      ),
    ),
    contentful.document(
      contentful.block(
        'paragraph',
        contentful.text('this'),
        contentful.text('is', contentful.mark('bold')),
        contentful.text('huge', contentful.mark('bold'), contentful.mark('italic')),
      ),
    ),
  );
});
