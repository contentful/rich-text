# rich-text-references

Reference extraction utilities for the Contentful rich text field type.

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install @contentful/rich-text-references
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add @contentful/rich-text-references
```

## Usage

```javascript
import { getRichTextReferences } from '@contentful/rich-text-references';

const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'embedded-entry-block',
          data: {
            target: {
              sys: {
                linkType: 'Entry',
                type: 'Link',
                id: 'yXmVKmaDBm8tRfQMwA0e'
              }
            }
          },
          content: []
        },
      ],
    },
  ],
};

getRichTextReferences(document, 'Entry');
// -> [{ linkType: 'Entry', type: 'Link', id: 'yXmVKmaDBm8tRfQMwA0e' }]
```
