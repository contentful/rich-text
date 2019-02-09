import React from 'react';
import { BLOCKS, Document, INLINES, MARKS } from '@contentful/rich-text-types';

import { documentToReactComponents, Options } from '..';

import {
  embeddedEntryDoc,
  headingDoc,
  hrDoc,
  hyperlinkDoc,
  inlineEntityDoc,
  invalidMarksDoc,
  invalidTypeDoc,
  marksDoc,
  multiMarkDoc,
  olDoc,
  paragraphDoc,
  quoteDoc,
  ulDoc,
} from './documents';
import Paragraph from './components/Paragraph';
import Strong from './components/Strong';
import { appendKeyToValidElement } from '../util/appendKeyToValidElement';

describe('documentToReactComponents', () => {
  it('returns an empty array when given an empty document', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    expect(documentToReactComponents(document)).toEqual([]);
  });

  it('renders nodes with default node renderer', () => {
    const docs: Document[] = [
      paragraphDoc,
      headingDoc(BLOCKS.HEADING_1),
      headingDoc(BLOCKS.HEADING_2),
    ];

    docs.forEach(doc => {
      expect(documentToReactComponents(doc)).toMatchSnapshot();
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
      expect(documentToReactComponents(doc)).toMatchSnapshot();
    });
  });

  it('renders multiple marks with default mark renderer', () => {
    const doc: Document = multiMarkDoc();
    expect(documentToReactComponents(doc)).toMatchSnapshot();
  });

  it('renders nodes with passed custom node renderer', () => {
    const options: Options = {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
      },
    };
    const document: Document = paragraphDoc;
    expect(documentToReactComponents(document, options)).toMatchSnapshot();
  });

  it('renders marks with the passed custom mark rendered', () => {
    const options: Options = {
      renderMark: {
        [MARKS.BOLD]: text => <Strong>{text}</Strong>,
      },
    };
    const document: Document = marksDoc(MARKS.BOLD);

    expect(documentToReactComponents(document, options)).toMatchSnapshot();
  });

  it('does not render unrecognized marks', () => {
    const document: Document = invalidMarksDoc;

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });

  it('renders empty node if type is not recognized', () => {
    const document: Document = invalidTypeDoc;

    expect(documentToReactComponents(document)).toMatchSnapshot();
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

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });

  it('renders ordered lists', () => {
    const document: Document = olDoc;

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });

  it('renders unordered lists', () => {
    const document: Document = ulDoc;

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });

  it('renders blockquotes', () => {
    const document: Document = quoteDoc;

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });

  it('renders horizontal rule', () => {
    const document: Document = hrDoc;

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });

  it('does not crash with inline elements (e.g. hyperlink)', () => {
    const document: Document = hyperlinkDoc;

    expect(documentToReactComponents(document)).toBeTruthy();
  });

  it('renders hyperlink', () => {
    const document: Document = hyperlinkDoc;

    expect(documentToReactComponents(document)).toMatchSnapshot();
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

    expect(documentToReactComponents(document)).toMatchSnapshot();
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

    expect(documentToReactComponents(document)).toMatchSnapshot();
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

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });
});

describe('appendKeyToValidElement', () => {
  it('appends keys to default React components', () => {
    expect(appendKeyToValidElement(<div />, 0)).toHaveProperty('key', '0');
  });

  it('appends keys to custom React components', () => {
    expect(appendKeyToValidElement(<Paragraph>hello world</Paragraph>, 0)).toHaveProperty(
      'key',
      '0',
    );
  });

  it('does not overwrite user specified keys', () => {
    expect(appendKeyToValidElement(<div key={'xyz'} />, 0)).toHaveProperty('key', 'xyz');
  });

  it('does not add keys to text nodes', () => {
    expect(appendKeyToValidElement('hello world', 0)).not.toHaveProperty('key');
  });

  it('does not add keys to node arrays', () => {
    expect(appendKeyToValidElement([<div key={0} />, <div key={1} />], 0)).not.toHaveProperty(
      'key',
    );
  });

  it('does not add keys to null', () => {
    expect(appendKeyToValidElement(null, 0)).toBeNull();
  });
});
