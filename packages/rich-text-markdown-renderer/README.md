# rich-text-markdown-renderer

A library to convert Contentful Rich Text Document to Markdown in [Github Markdown Format (gmf)](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install @contentful/rich-text-markdown-renderer
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add @contentful/rich-text-markdown-renderer
```

## Features

- Support for ordered lists 🔢
- Extend default behavior with custom renderers 🔧

## Usage

### Basic

```javascript
import { documentToMarkdown } from '@contentful/rich-text-markdown-renderer';

const document = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Hello',
          marks: [{ type: 'bold' }],
          data: {},
        },
        {
          nodeType: 'text',
          value: ' world!',
          marks: [{ type: 'italic' }],
          data: {},
        },
      ],
    },
  ],
};

documentToMarkdown(document)); // -> Hello world!
```

### Advanced

```javascript
documentToMarkdown(document, {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      return `![${node.data.target.fields.title}](${node.data.target.fields.file.url})\n`;
    },
  },
});
```
