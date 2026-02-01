import React, { ReactNode } from 'react';

import { BLOCKS, Document, INLINES, MARKS, ResourceLink } from '@contentful/rich-text-types';

import { CommonNode, documentToReactComponents, Options } from '..';

import { appendKeyToValidElement } from '../util/appendKeyToValidElement';
import { nodeListToReactComponents, nodeToReactComponent } from '../util/nodeListToReactComponents';
import DocumentWrapper from './components/Document';
import Paragraph from './components/Paragraph';
import Strong from './components/Strong';
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
  tableDoc,
  tableWithHeaderDoc,
  ulDoc,
} from './documents';
import embeddedResource from './documents/embedded-resource';

describe('documentToReactComponents', () => {
  it('returns an empty array when given an empty document', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };

    expect(documentToReactComponents(document)).toEqual([]);
  });

  it('returns an array of elements when given a populated document', () => {
    const document: Document = hrDoc;

    expect(documentToReactComponents(document)).toMatchSnapshot();
    expect(documentToReactComponents(document)).toBeInstanceOf(Array);
  });

  it('renders nodes with default node renderer', () => {
    const docs: Document[] = [
      paragraphDoc,
      headingDoc(BLOCKS.HEADING_1),
      headingDoc(BLOCKS.HEADING_2),
      headingDoc(BLOCKS.HEADING_3),
      headingDoc(BLOCKS.HEADING_4),
      headingDoc(BLOCKS.HEADING_5),
      headingDoc(BLOCKS.HEADING_6),
    ];

    docs.forEach((doc) => {
      expect(documentToReactComponents(doc)).toMatchSnapshot();
    });
  });

  it('renders marks with default mark renderer', () => {
    const docs: Document[] = [
      marksDoc(MARKS.ITALIC),
      marksDoc(MARKS.BOLD),
      marksDoc(MARKS.UNDERLINE),
      marksDoc(MARKS.CODE),
      marksDoc(MARKS.SUPERSCRIPT),
      marksDoc(MARKS.SUBSCRIPT),
      marksDoc(MARKS.STRIKETHROUGH),
      marksDoc(MARKS.EMPHASIS),
    ];

    docs.forEach((doc) => {
      expect(documentToReactComponents(doc)).toMatchSnapshot();
    });
  });

  it('renders unaltered text with default text renderer', () => {
    const document: Document = paragraphDoc;

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });

  it('renders multiple marks with default mark renderer', () => {
    const doc: Document = multiMarkDoc();
    expect(documentToReactComponents(doc)).toMatchSnapshot();
  });

  it('renders nodes with passed custom node renderer', () => {
    const options: Options = {
      renderNode: {
        [BLOCKS.DOCUMENT]: (node, children) => <DocumentWrapper>{children}</DocumentWrapper>,
        [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
      },
    };
    const document: Document = quoteDoc;
    expect(documentToReactComponents(document, options)).toMatchSnapshot();
  });

  it('renders marks with the passed custom mark renderer', () => {
    const options: Options = {
      renderMark: {
        [MARKS.BOLD]: (text) => <Strong>{text}</Strong>,
      },
    };
    const document: Document = multiMarkDoc();

    expect(documentToReactComponents(document, options)).toMatchSnapshot();
  });

  it('renders text with the passed custom text renderer', () => {
    const options: Options = {
      renderText: (text) => text.replace(/world/, 'Earth'),
    };
    const document: Document = paragraphDoc;

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

  it('renders default resource block', () => {
    const resourceSys: ResourceLink = {
      sys: {
        urn: 'crn:contentful:::content:spaces/6fqi4ljzyr0e/environments/master/entries/9mpxT4zsRi6Iwukey8KeM',
        type: 'ResourceLink',
        linkType: 'Contentful:Entry',
      },
    };
    const document: Document = embeddedResource(resourceSys);

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

  it('renders tables', () => {
    const document: Document = tableDoc;

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });

  it('renders tables with header', () => {
    expect(documentToReactComponents(tableWithHeaderDoc)).toMatchSnapshot();
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
          type: 'Link',
          linkType: 'Entry',
        },
      },
    };
    const document: Document = inlineEntityDoc(entry, INLINES.ENTRY_HYPERLINK);

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });
  it('renders resource hyperlink', () => {
    const entry = {
      target: {
        sys: {
          urn: 'crn:contentful:::content:spaces/6fqi4ljzyr0e/environments/master/entries/9mpxT4zsRi6Iwukey8KeM',
          type: 'Link',
          linkType: 'Entry',
        },
      },
    };
    const document: Document = inlineEntityDoc(entry, INLINES.RESOURCE_HYPERLINK);

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });
  it('renders embedded entry', () => {
    const entry = {
      target: {
        sys: {
          id: '9mpxT4zsRi6Iwukey8KeM',
          type: 'Link',
          linkType: 'Entry',
        },
      },
    };
    const document: Document = inlineEntityDoc(entry, INLINES.EMBEDDED_ENTRY);

    expect(documentToReactComponents(document)).toMatchSnapshot();
  });
  it('renders embedded resource', () => {
    const entry = {
      target: {
        sys: {
          urn: 'crn:contentful:::content:spaces/6fqi4ljzyr0e/environments/master/entries/9mpxT4zsRi6Iwukey8KeM',
          type: 'ResourceLink',
          linkType: 'Contentful:Entry',
        },
      },
    };
    const document: Document = inlineEntityDoc(entry, INLINES.EMBEDDED_RESOURCE);

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

describe('nodeToReactComponent', () => {
  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: CommonNode, children: ReactNode): ReactNode => <p>{children}</p>,
    },
    renderMark: {
      [MARKS.BOLD]: (text: ReactNode): ReactNode => <b>{text}</b>,
    },
  };

  const createBlockNode = (nodeType: BLOCKS): CommonNode => ({
    nodeType,
    data: {},
    content: [
      {
        nodeType: 'text',
        value: 'hello world',
        marks: [],
        data: {},
      },
    ],
  });

  const createTextNode = (type: string): CommonNode => ({
    nodeType: 'text',
    value: 'hello world',
    marks: [{ type }],
    data: {},
  });

  it('renders valid nodes', () => {
    expect(nodeToReactComponent(createBlockNode(BLOCKS.PARAGRAPH), options)).toMatchSnapshot();
  });

  it('renders invalid node types in React fragments', () => {
    expect(nodeToReactComponent(createBlockNode(BLOCKS.HEADING_1), options)).toMatchSnapshot();
  });

  it('renders valid marks', () => {
    expect(nodeToReactComponent(createTextNode(MARKS.BOLD), options)).toMatchSnapshot();
  });

  it('does not add additional tags on invalid marks', () => {
    expect(nodeToReactComponent(createTextNode(MARKS.ITALIC), options)).toMatchSnapshot();
  });

  const customTextNode: CommonNode = {
    nodeType: BLOCKS.PARAGRAPH,
    data: {},
    content: [
      {
        nodeType: 'text',
        value: 'some\nlines\nof\ntext',
        marks: [{ type: MARKS.BOLD }],
        data: {},
      },
    ],
  };

  it('does not render altered text with default text renderer', () => {
    expect(nodeToReactComponent(customTextNode, options)).toMatchSnapshot();
  });

  it('renders altered text with custom text renderer', () => {
    expect(
      nodeToReactComponent(customTextNode, {
        ...options,
        renderText: (text: string): ReactNode => {
          return text.split('\n').reduce((children, textSegment, index) => {
            return [...children, index > 0 && <br key={index} />, textSegment];
          }, []);
        },
      }),
    ).toMatchSnapshot();
  });
});

describe('nodeListToReactComponents', () => {
  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: CommonNode, children: ReactNode): ReactNode => <p>{children}</p>,
    },
    renderMark: {
      [MARKS.BOLD]: (text: ReactNode): ReactNode => <b>{text}</b>,
    },
  };

  const nodes: CommonNode[] = [
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'hello',
          marks: [{ type: MARKS.BOLD }],
          data: {},
        },
      ],
    },
    {
      nodeType: 'text',
      value: ' ',
      marks: [],
      data: {},
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'world',
          marks: [],
          data: {},
        },
      ],
    },
  ];

  it('renders children as an array with keys from its index', () => {
    const renderedNodes: ReactNode[] = nodeListToReactComponents(nodes, options) as ReactNode[];
    expect(renderedNodes[0]).toHaveProperty('key', '0');
    expect(renderedNodes[1]).not.toHaveProperty('key');
    expect(renderedNodes[2]).toHaveProperty('key', '2');
    expect(renderedNodes).toMatchSnapshot();
  });
});

describe('preserveWhitespace', () => {
  it('preserves spaces between words', () => {
    const options: Options = {
      preserveWhitespace: true,
    };
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
              value: 'hello    world',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };
    expect(documentToReactComponents(document, options)).toMatchSnapshot();
  });

  it('preserves new lines', () => {
    const options: Options = {
      preserveWhitespace: true,
    };
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
              value: 'hello\nworld',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };
    expect(documentToReactComponents(document, options)).toMatchSnapshot();
  });
});

describe('stripEmptyTrailingParagraph', () => {
  it('strips empty trailing paragraph when enabled', () => {
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
              value: 'Hello world',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options: Options = {
      stripEmptyTrailingParagraph: true,
    };

    const result = documentToReactComponents(document, options);
    expect(result).toMatchSnapshot();
  });

  it('does not strip empty trailing paragraph when disabled', () => {
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
              value: 'Hello world',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options: Options = {
      stripEmptyTrailingParagraph: false,
    };

    const result = documentToReactComponents(document, options);
    expect(result).toMatchSnapshot();
  });

  it('does not strip empty trailing paragraph when it is the only child', () => {
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
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options: Options = {
      stripEmptyTrailingParagraph: true,
    };

    const result = documentToReactComponents(document, options);
    expect(result).toMatchSnapshot();
  });

  it('does not strip non-empty trailing paragraph', () => {
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
              value: 'Hello world',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Not empty',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options: Options = {
      stripEmptyTrailingParagraph: true,
    };

    const result = documentToReactComponents(document, options);
    expect(result).toMatchSnapshot();
  });

  it('does not strip trailing paragraph with multiple text nodes', () => {
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
              value: 'Hello world',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options: Options = {
      stripEmptyTrailingParagraph: true,
    };

    const result = documentToReactComponents(document, options);
    expect(result).toMatchSnapshot();
  });

  it('does not strip trailing non-paragraph node', () => {
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
              value: 'Hello world',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.HEADING_1,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    };

    const options: Options = {
      stripEmptyTrailingParagraph: true,
    };

    const result = documentToReactComponents(document, options);
    expect(result).toMatchSnapshot();
  });
});
