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
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'Hello',
          marks: [{ type: 'bold' }]
        },
        {
          nodeType: 'text',
          value: ' world!',
          marks: [{ type: 'italic' }]
        },
      ],
    },
  ]
};

documentToPlainTextString(document); // -> Hello world!
```
