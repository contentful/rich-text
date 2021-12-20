# rich-text-from-markdown

A library to convert markdown to Contentful Rich Text document format.

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install @contentful/rich-text-from-markdown
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add @contentful/rich-text-from-markdown
```

## Usage

### Basic

```js
const { richTextFromMarkdown } = require('@contentful/rich-text-from-markdown');

const document = await richTextFromMarkdown('# Hello World');
```

### Advanced

The library will convert automatically the following markdown nodes:

- `paragraph`
- `heading`
- `text`
- `emphasis`
- `strong`
- `delete`
- `inlineCode`
- `link`
- `thematicBreak`
- `blockquote`
- `list`
- `listItem`

If the markdown content has unsupported nodes like image `![image](url)` you can add a callback as a second argument
and it will get called everytime an unsupported node is found. The return value of the callback will be the rich text representation
of that node.

#### Example:

```js
const { richTextFromMarkdown } = require('@contentful/rich-text-from-markdown');

// define your own type for unsupported nodes like asset
const document = await richTextFromMarkdown(
  '![image](\'https://example.com/image.jpg\')',
  node => ({
    nodeType: 'embedded-[entry|asset]-[block|inline]',
    content: [],
    data: {
      target: {
        sys: {
          type: 'Link',
          linkType: 'Entry|Asset',
          id: '.........'
        }
      }
    }
  })
);
```
