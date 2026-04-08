import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';

import { richTextFromMarkdown } from '..';

import { block, document, inline, mark, text } from './helpers';

describe('rich-text-from-markdown', () => {
  test('should parse some markdown', async () => {
    const result = await richTextFromMarkdown('# Hello World');
    expect(result).toEqual(document({}, block(BLOCKS.HEADING_1, {}, text('Hello World'))));
  });

  test('should call the fallback function when a node is not supported', async () => {
    const fakeNode = { nodeType: 'image', data: {} };
    const fallback = jest.fn(() => Promise.resolve(fakeNode));
    const result = await richTextFromMarkdown(
      '![image](https://image.example.com/image.jpg)',
      fallback,
    );

    expect(fallback).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: 'image',
          data: {},
        },
      ],
    });
  });
});

describe.each<[string, string[], string[]?]>([
  ['*This is an italic text*', ['This is an italic text', 'italic']],
  ['__This a bold text__', ['This a bold text', 'bold']],
  ['`This is code`', ['This is code', 'code']],
  [
    '__This is bold and *this is an italic*__',
    ['This is bold and ', 'bold'],
    ['this is an italic', 'bold', 'italic'],
  ],
])(
  'The markdown "%s" should be parsed to text with value "%s"',
  (markdown, ...expectedTextWithMarks) => {
    test(`${markdown}`, async () => {
      const result = await richTextFromMarkdown(markdown);
      expect(result).toEqual(
        document(
          {},
          block(
            BLOCKS.PARAGRAPH,
            {},
            ...expectedTextWithMarks.map(([expectedText, ...expectedMarkTypes]) =>
              text(expectedText, ...expectedMarkTypes.map(mark)),
            ),
          ),
        ),
      );
    });
  },
);

describe('parses complex inline image markdown correctly', () => {
  test('incoming markdown tree calls fallback twice', async () => {
    const fakeNode = { nodeType: 'image', data: {} };
    const fallback = jest.fn(() => Promise.resolve(fakeNode));
    const result = await richTextFromMarkdown(
      `![image](https://image.example.com/image.jpg)
      ![image](https://image.example.com/image2.jpg)`,
      fallback,
    );

    expect(fallback).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'image',
          data: {},
        },
        block(
          BLOCKS.PARAGRAPH,
          {},
          text(`
`),
        ),
        {
          nodeType: 'image',
          data: {},
        },
      ],
    });
  });
  test('incoming markdown tree calls fallback twice', async () => {
    const fakeNode = { nodeType: 'image', data: {} };
    const fallback = jest.fn(() => Promise.resolve(fakeNode));
    const result = await richTextFromMarkdown(
      `some text ![image](https://image.example.com/image.jpg)![image](https://image.example.com/image2.jpg) some more text`,
      fallback,
    );

    expect(fallback).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      nodeType: 'document',
      data: {},
      content: [
        block(BLOCKS.PARAGRAPH, {}, text('some text ')),
        {
          nodeType: 'image',
          data: {},
        },
        {
          nodeType: 'image',
          data: {},
        },
        block(BLOCKS.PARAGRAPH, {}, text(' some more text')),
      ],
    });
  });
});

describe('links', () => {
  test('should correctly convert a link', async () => {
    const result = await richTextFromMarkdown('[This is a link](https://contentful.com)');

    expect(result).toEqual(
      document(
        {},
        block(
          BLOCKS.PARAGRAPH,
          {},
          inline(
            INLINES.HYPERLINK,
            {
              data: {
                uri: 'https://contentful.com',
              },
            },
            text('This is a link'),
          ),
        ),
      ),
    );
  });

  test('should convert link wrapped in a mark', async () => {
    const result = await richTextFromMarkdown(
      '*This is a test [Contentful](https://www.contentful.com/). Text text*',
    );

    expect(result).toEqual(
      document(
        {},
        block(
          BLOCKS.PARAGRAPH,
          {},
          text('This is a test ', mark(MARKS.ITALIC)),
          inline(
            INLINES.HYPERLINK,
            {
              data: {
                uri: 'https://www.contentful.com/',
              },
            },
            text('Contentful', mark(MARKS.ITALIC)),
          ),
          text('. Text text', mark(MARKS.ITALIC)),
        ),
      ),
    );
  });
});
