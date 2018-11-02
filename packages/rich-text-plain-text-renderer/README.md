# rich-text-plain-text-renderer

Plain text renderer for the Rich Text document.

## Installation

Using [npm](http://npmjs.org/):

```javascript
npm install @contentful/rich-text-plain-text-renderer
```

Using [yarn](https://yarnpkg.com/):
```javascript
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
          marks: [{ nodeType: 'bold' }]
        },
        {
          nodeType: 'text',
          value: ' world!',
          marks: [{ nodeType: 'italic' }]
        },
      ],
    },
  ]
};

documentToPlainTextString(document); // -> Hello world!
```

