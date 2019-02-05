import React from 'react';
import { Document, BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';

import { documentToReactTree, Options } from '../index';

import {
  hrDoc,
  hyperlinkDoc,
  paragraphDoc,
  invalidMarksDoc,
  invalidTypeDoc,
  headingDoc,
  marksDoc,
  multiMarkDoc,
  embeddedEntryDoc,
  inlineEntityDoc,
  olDoc,
  ulDoc,
  quoteDoc,
} from './documents';
import Paragraph from './components/Paragraph';
import Strong from './components/Strong';

describe('documentToReactTree', () => {
  it('returns null when given an empty document', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    expect(documentToReactTree(document)).toBeNull();
  });

  it('renders nodes with default node renderer', () => {
    const docs: Document[] = [
      paragraphDoc,
      headingDoc(BLOCKS.HEADING_1),
      headingDoc(BLOCKS.HEADING_2),
    ];

    docs.forEach(doc => {
      expect(documentToReactTree(doc)).toMatchSnapshot();
    });
  });

  it('renders marks with default mark renderer', () => {
    const docs: Document[] = [
      marksDoc(MARKS.ITALIC),
      marksDoc(MARKS.BOLD),
      marksDoc(MARKS.UNDERLINE),
      marksDoc(MARKS.CODE),
    ];

    docs.forEach(doc => {
      expect(documentToReactTree(doc)).toMatchSnapshot();
    });
  });

  it('renders multiple marks with default mark renderer', () => {
    const doc: Document = multiMarkDoc();
    expect(documentToReactTree(doc)).toMatchSnapshot();
  });

  it('renders nodes with passed custom node renderer', () => {
    const options: Options = {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
      },
    };
    const document: Document = paragraphDoc;
    expect(documentToReactTree(document, options)).toMatchSnapshot();
  });

  it('renders marks with the passed custom mark rendered', () => {
    const options: Options = {
      renderMark: {
        [MARKS.BOLD]: text => <Strong>{text}</Strong>,
      },
    };
    const document: Document = marksDoc(MARKS.BOLD);

    expect(documentToReactTree(document, options)).toMatchSnapshot();
  });

  it('does not render unrecognized marks', () => {
    const document: Document = invalidMarksDoc;

    expect(documentToReactTree(document)).toMatchSnapshot();
  });

  it('renders empty node if type is not recognized', () => {
    const document: Document = invalidTypeDoc;

    expect(documentToReactTree(document as Document)).toMatchSnapshot();
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

    expect(documentToReactTree(document)).toMatchSnapshot();
  });

  it('renders ordered lists', () => {
    const document: Document = olDoc;

    expect(documentToReactTree(document)).toMatchSnapshot();
  });

  it('renders unordered lists', () => {
    const document: Document = ulDoc;

    expect(documentToReactTree(document)).toMatchSnapshot();
  });

  it('renders blockquotes', () => {
    const document: Document = quoteDoc;

    expect(documentToReactTree(document)).toMatchSnapshot();
  });

  it('renders horizontal rule', () => {
    const document: Document = hrDoc;

    expect(documentToReactTree(document)).toMatchSnapshot();
  });

  it('does not crash with inline elements (e.g. hyperlink)', () => {
    const document: Document = hyperlinkDoc;

    expect(documentToReactTree(document)).toBeTruthy();
  });

  it('renders hyperlink', () => {
    const document: Document = hyperlinkDoc;

    expect(documentToReactTree(document)).toMatchSnapshot();
  });

  it('renders asset hyperlink', () => {
    const asset = {
      target: {
        sys: {
          id: '9mpxT4zsRi6Iwukey8KeM',
          link: 'Link',
          type: 'Asset',
        },
      },
    };
    const document: Document = inlineEntityDoc(asset, INLINES.ASSET_HYPERLINK);

    expect(documentToReactTree(document)).toMatchSnapshot();
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
    const document: Document = inlineEntityDoc(entry, INLINES.ENTRY_HYPERLINK);

    expect(documentToReactTree(document)).toMatchSnapshot();
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
    const document: Document = inlineEntityDoc(entry, INLINES.EMBEDDED_ENTRY);

    expect(documentToReactTree(document)).toMatchSnapshot();
  });
});
