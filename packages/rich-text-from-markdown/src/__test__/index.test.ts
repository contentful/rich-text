import { Text } from '@contentful/rich-text-types';
import _ from 'lodash';
import { richTextFromMarkdown } from '..';

describe('rich-text-from-markdown', () => {
  test('should render some markdown', async () => {
    const document = await richTextFromMarkdown('# Hello World');
    const text = _.get(document, ['content', '0', 'content', '0']);
    expect(text.value).toBe('Hello World');
  });

  test('should call the fallback function when a node is not supported', async () => {
    const fakeNode = { nodeType: 'image' };
    const fallback = jest.fn(node => Promise.resolve(fakeNode));
    const document = await richTextFromMarkdown(
      '![image](https://image.example.com/image.jpg)',
      fallback,
    );

    expect(_.get(document, ['content', '0', 'nodeType'])).toBe('image');
    expect(fallback).toBeCalledTimes(1);
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
      const document = await richTextFromMarkdown(markdown);
      const parsedText = document.content[0].content[0] as Text;
      expect(parsedText.value).toBe(expected);
      expect(parsedText.marks).toEqual([{ type: expectedMark }]);
    });
  },
);

describe('parses complex inline image markdown correctly', () => {
  test('incoming markdown tree calls fallback twice', async () => {
    const fakeNode = { nodeType: 'image' };
    const fallback = jest.fn(node => Promise.resolve(fakeNode));
    const document = await richTextFromMarkdown(
      `![image](https://image.example.com/image.jpg)
      ![image](https://image.example.com/image2.jpg)`,
      fallback,
    );
    expect(document.content.length).toBe(3);
    expect(document.content[0].nodeType).toBe('image');
    expect(document.content[1].nodeType).toBe('paragraph');
    expect(document.content[1].content[0].nodeType).toBe('text');
    expect(document.content[2].nodeType).toBe('image');
    expect(fallback).toBeCalledTimes(2);
  });
  test('incoming markdown tree calls fallback twice', async () => {
    const fakeNode = { nodeType: 'image' };
    const fallback = jest.fn(node => Promise.resolve(fakeNode));
    const document = await richTextFromMarkdown(
      `some text ![image](https://image.example.com/image.jpg)![image](https://image.example.com/image2.jpg) some more text`,
      fallback,
    );
    expect(document.content.length).toBe(4);
    expect(document.content[0].nodeType).toBe('paragraph');
    expect(document.content[0].content[0].nodeType).toBe('text');
    expect(document.content[1].nodeType).toBe('image');
    expect(document.content[2].nodeType).toBe('image');
    expect(document.content[3].nodeType).toBe('paragraph');
    expect(fallback).toBeCalledTimes(2);
  });
});
