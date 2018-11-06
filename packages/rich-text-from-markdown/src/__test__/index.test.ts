import { richTextFromMarkdown } from '..';
import { Text, Block } from '@contentful/rich-text-types';

describe('rich-text-from-markdown', () => {
  it('should render some markdown', () => {
    const document = richTextFromMarkdown('# Hello World');
    const text = document.content[0].content[0] as Text;
    expect(text.value).toBe('Hello World');
  });

  it('should call the fallback function when a node is not supported', () => {
    const fakeNode = { nodeType: 'image' };
    const fallback = jest.fn(node => fakeNode);
    const document = richTextFromMarkdown(
      '![image](https://image.example.com/image.jpg)',
      fallback,
    );
    expect(document.content[0].content[0].nodeType).toBe('image');
    expect(fallback).toBeCalledTimes(1);
    expect(fallback.mock.calls).toMatchSnapshot();
  });
});
