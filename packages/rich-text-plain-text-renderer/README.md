# rich-text-plain-text-renderer

Plain text renderer for the Rich Text document.

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install @contentful/rich-text-plain-text-renderer
```

Using [yarn](https://yarnpkg.com/):
```sh
yarn add @contentful/rich-text-plain-text-renderer
```

## Usage

```javascript
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

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
          data: {}
        },
        {
          nodeType: 'text',
          value: ' world!',
          marks: [{ type: 'italic' }],
          data: {}
        },
      ],
    },
  ]
};

documentToPlainTextString(document); // -> Hello world!
```
