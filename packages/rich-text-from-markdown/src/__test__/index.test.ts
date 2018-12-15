import _ from 'lodash';
import { Hyperlink, Text, BLOCKS, INLINES } from '@contentful/rich-text-types';
import { document, block, text, mark, inline } from './helpers';
import { richTextFromMarkdown } from '..';

describe('rich-text-from-markdown', () => {
  test('should render some markdown', async () => {
    const result = await richTextFromMarkdown('# Hello World');
    expect(result).toEqual(document({}, block(BLOCKS.HEADING_1, {}, text('Hello World'))));
  });

  test('should call the fallback function when a node is not supported', async () => {
    const fakeNode = { nodeType: 'image' };
    const fallback = jest.fn(node => Promise.resolve(fakeNode));
    const result = await richTextFromMarkdown(
      '![image](https://image.example.com/image.jpg)',
      fallback,
    );

    expect(fallback).toBeCalledTimes(1);
    expect(result).toEqual({
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: 'image',
        },
      ],
    });
  });
});

describe.each([
  ['*This is an italic text*', 'This is an italic text', 'italic'],
  ['__This a bold text__', 'This a bold text', 'bold'],
  ['`This is code`', 'This is code', 'code'],
])(
  'The markdown "%s" should be parsed to text with value "%s"',
  (markdown, expected, expectedMark) => {
    test(`${expected}`, async () => {
      const result = await richTextFromMarkdown(markdown);
      expect(result).toEqual(
        document({}, block(BLOCKS.PARAGRAPH, {}, text(expected, mark(expectedMark)))),
      );
    });
  },
);

describe('parses complex inline image markdown correctly', () => {
  test('incoming markdown tree calls fallback twice', async () => {
    const fakeNode = { nodeType: 'image' };
    const fallback = jest.fn(node => Promise.resolve(fakeNode));
    const result = await richTextFromMarkdown(
      `![image](https://image.example.com/image.jpg)
      ![image](https://image.example.com/image2.jpg)`,
      fallback,
    );

    expect(fallback).toBeCalledTimes(2);
    expect(result).toEqual({
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'image',
        },
        block(BLOCKS.PARAGRAPH, {}, text('\n      ')),
        {
          nodeType: 'image',
        },
      ],
    });
  });
  test('incoming markdown tree calls fallback twice', async () => {
    const fakeNode = { nodeType: 'image' };
    const fallback = jest.fn(node => Promise.resolve(fakeNode));
    const result = await richTextFromMarkdown(
      `some text ![image](https://image.example.com/image.jpg)![image](https://image.example.com/image2.jpg) some more text`,
      fallback,
    );

    expect(fallback).toBeCalledTimes(2);
    expect(result).toEqual({
      nodeType: 'document',
      data: {},
      content: [
        block(BLOCKS.PARAGRAPH, {}, text('some text ')),
        {
          nodeType: 'image',
        },
        {
          nodeType: 'image',
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
});
