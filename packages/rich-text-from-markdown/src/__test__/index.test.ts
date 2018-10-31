const { richTextFromMarkdown } = require('..');

describe('rich-text-from-markdown', () => {
  it('should render some markdown', () => {
    const document = richTextFromMarkdown('# Hello World');
    expect(document.content[0].content[0].value).toBe('Hello World');
  });

  it('should call the fallback function when a node is not supported', () => {
    const fallback = jest.fn();
    const document = richTextFromMarkdown(
      '![image](https://image.example.com/image.jpg)',
      fallback,
    );
    console.log(fallback.mock.calls);
    expect(fallback).toBeCalledTimes(1);
    expect(fallback.mock.calls).toMatchSnapshot();
  });
});
