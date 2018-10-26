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
  nodeClass: 'document',
  content: [
    {
      nodeClass: 'block',
      nodeType: 'paragraph',
      content: [
        {
          nodeClass: 'text',
          nodeType: 'text',
          value: 'Hello',
          marks: [{ nodeType: 'bold' }]
        },
        {
          nodeClass: 'text',
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
