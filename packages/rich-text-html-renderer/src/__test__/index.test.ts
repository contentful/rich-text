import { Document, BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';

import { documentToHtmlString, Options } from '../index';
import {
  hrDoc,
  hyperlinkDoc,
  paragraphDoc,
  invalidMarksDoc,
  invalidTypeDoc,
  headingDoc,
  marksDoc,
  embeddedEntryDoc,
  olDoc,
  ulDoc,
  quoteDoc,
} from './documents';
import inlineEntity from './documents/inline-entity';

describe('documentToHtmlString', () => {
  it('returns empty string when given an empty document', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    expect(documentToHtmlString(document)).toEqual('');
  });

  it('renders nodes with default node renderer', () => {
    const docs: Array<{ doc: Document; expected: string }> = [
      {
        doc: paragraphDoc,
        expected: '<p>hello world</p>',
      },
      {
        doc: headingDoc(BLOCKS.HEADING_1),
        expected: '<h1>hello world</h1>',
      },
      {
        doc: headingDoc(BLOCKS.HEADING_2),
        expected: '<h2>hello world</h2>',
      },
    ];

    docs.forEach(({ doc, expected }) => {
      expect(documentToHtmlString(doc)).toEqual(expected);
    });
  });

  it('renders marks with default mark renderer', () => {
    const docs: Array<{ doc: Document; expected: string }> = [
      {
        doc: marksDoc(MARKS.ITALIC),
        expected: '<p><i>hello world</i></p>',
      },
      {
        doc: marksDoc(MARKS.BOLD),
        expected: '<p><b>hello world</b></p>',
      },
      {
        doc: marksDoc(MARKS.UNDERLINE),
        expected: '<p><u>hello world</u></p>',
      },
      {
        doc: marksDoc(MARKS.CODE),
        expected: '<p><code>hello world</code></p>',
      },
    ];

    docs.forEach(({ doc, expected }) => {
      expect(documentToHtmlString(doc)).toEqual(expected);
    });
  });

  it('renders nodes with passed custom node renderer', () => {
    const options: Options = {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content)}</p>`,
      },
    };
    const document: Document = paragraphDoc;
    const expected = `<p>hello world</p>`;

    expect(documentToHtmlString(document, options)).toEqual(expected);
  });

  it('renders marks with the passed custom mark rendered', () => {
    const options: Options = {
      renderMark: {
        [MARKS.UNDERLINE]: text => `<u>${text}</u>`,
      },
    };
    const document: Document = marksDoc(MARKS.UNDERLINE);
    const expected = '<p><u>hello world</u></p>';

    expect(documentToHtmlString(document, options)).toEqual(expected);
  });

  it('renders escaped html', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'foo & bar',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };
    const expected = '<p>foo &amp; bar</p>';

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it('renders escaped html with marks', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'foo & bar',
              marks: [{ type: MARKS.UNDERLINE }, { type: MARKS.BOLD }],
              data: {},
            },
          ],
        },
      ],
    };
    const expected = '<p><b><u>foo &amp; bar</u></b></p>';

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it('does not render unrecognized marks', () => {
    const document: Document = invalidMarksDoc;
    const expected = '<p>Hello world!</p>';

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it('renders empty node if type is not recognized', () => {
    const document: Document = invalidTypeDoc;
    const expected = '';

    expect(documentToHtmlString(document as Document)).toEqual(expected);
  });

  it('renders default entry link block', () => {
    const entrySys = {
      sys: {
        id: '9mpxT4zsRi6Iwukey8KeM',
        link: 'Link',
        linkType: 'Entry',
      },
    };
    const document: Document = embeddedEntryDoc(entrySys);
    const expected = `<div></div>`;

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it('renders ordered lists', () => {
    const document: Document = olDoc;
    const expected = `<ol><li><p>Hello</p></li><li><p>world</p></li></ol><p></p>`;

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it('renders unordered lists', () => {
    const document: Document = ulDoc;
    const expected = `<ul><li><p>Hello</p></li><li><p>world</p></li></ul><p></p>`;

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it('renders blockquotes', () => {
    const document: Document = quoteDoc;
    const expected = `<p>hello</p><blockquote>world</blockquote>`;

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it('renders horizontal rule', () => {
    const document: Document = hrDoc;
    const expected = '<p>hello world</p><hr/><p></p>';

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it('does not crash with inline elements (e.g. hyperlink)', () => {
    const document: Document = hyperlinkDoc;

    expect(documentToHtmlString(document)).toBeTruthy();
  });

  it('renders hyperlink', () => {
    const document: Document = hyperlinkDoc;
    const expected = '<p>Some text <a href="https://url.org">link</a> text.</p>';

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it(`renders asset hyperlink`, () => {
    const asset = {
      target: {
        sys: {
          id: '9mpxT4zsRi6Iwukey8KeM',
          link: 'Link',
          type: 'Asset',
        },
      },
    };
    const document: Document = inlineEntity(asset, INLINES.ASSET_HYPERLINK);
    const expected = `<p><span>type: ${INLINES.ASSET_HYPERLINK} id: ${
      asset.target.sys.id
    }</span></p>`;

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it('renders entry hyperlink', () => {
    const entry = {
      target: {
        sys: {
          id: '9mpxT4zsRi6Iwukey8KeM',
          link: 'Link',
          type: 'Entry',
        },
      },
    };
    const document: Document = inlineEntity(entry, INLINES.ENTRY_HYPERLINK);
    const expected = `<p><span>type: ${INLINES.ENTRY_HYPERLINK} id: ${
      entry.target.sys.id
    }</span></p>`;

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it('renders embedded entry', () => {
    const entry = {
      target: {
        sys: {
          id: '9mpxT4zsRi6Iwukey8KeM',
          link: 'Link',
          type: 'Entry',
        },
      },
    };
    const document: Document = inlineEntity(entry, INLINES.EMBEDDED_ENTRY);
    const expected = `<p><span>type: ${INLINES.EMBEDDED_ENTRY} id: ${
      entry.target.sys.id
    }</span></p>`;

    expect(documentToHtmlString(document)).toEqual(expected);
  });

  it('does not crash with empty documents', () => {
    expect(documentToHtmlString({} as Document)).toEqual('');
  });

  it('does not crash with undefined documents', () => {
    expect(documentToHtmlString(undefined as Document)).toEqual('');
  });
});
