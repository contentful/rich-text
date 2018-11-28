import { richTextFromMarkdown } from '..';
import { Text, Block } from '@contentful/rich-text-types';

describe('rich-text-from-markdown', () => {
  test('should render some markdown', async () => {
    const document = richTextFromMarkdown('# Hello World');
    const text = (await document).content[0].content[0] as Text;
    expect(text.value).toBe('Hello World');
  });

  test('should call the fallback function when a node is not supported', async () => {
    const fakeNode = { nodeType: 'image' };
    const fallback = jest.fn(node => fakeNode);
    const document = await richTextFromMarkdown(
      '![image](https://image.example.com/image.jpg)',
      fallback,
    );
    expect(document.content[0].content[0].nodeType).toBe('image');
    expect(fallback).toBeCalledTimes(1);
    expect(fallback.mock.calls).toMatchSnapshot();
  });
});

describe.each([
  ['*This is an italic text*', 'This is an italic text'],
  ['__This a bold text__', 'This a bold text'],
  ['`This is code`', 'This is code'],
])('The markdown "%s" should be parsed to text with value "%s"', (markdown, expected) => {
  test(`${expected}`, async () => {
    const document = richTextFromMarkdown(markdown);
    const parsedText = (await document).content[0].content[0] as Text;
    expect(parsedText.value).toBe(expected);
  });
});
