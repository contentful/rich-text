import toSlatejsDocument from '../contentful-to-slatejs-adapter';

import * as slate from './slate-helpers';
import * as contentful from './contentful-helpers';

describe('toSlatejsDocument', () => {
  const testFactory = (message: string, input: Contentful.Document, expected: Slate.Document) => {
    it(message, () => {
      const actual = toSlatejsDocument(input);
      expect(actual).toEqual(expected);
    });
  };

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
