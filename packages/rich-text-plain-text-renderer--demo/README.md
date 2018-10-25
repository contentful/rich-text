# rich-text-plain-text-renderer--demo
Plain text renderer for the Rich Text document.

## Installation
Using [npm](http://npmjs.org/):

```javascript
npm install @contentful/rich-text-plain-text-renderer--demo
```

Using [yarn](https://yarnpkg.com/):
```javascript
yarn add @contentful/rich-text-plain-text-renderer--demo
```

## Usage

```javascript
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer--demo';

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
