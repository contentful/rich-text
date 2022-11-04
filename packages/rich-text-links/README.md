# rich-text-links

Entity (entry and asset) link extraction utilities for the Contentful rich text
field type.

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install @contentful/rich-text-links
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add @contentful/rich-text-links
```

## Usage

```javascript
import { getRichTextEntityLinks } from '@contentful/rich-text-links';

const document = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [
        {
          nodeType: 'embedded-entry-block',
          data: {
            target: {
              sys: {
                linkType: 'Entry',
                type: 'Link',
                id: 'yXmVKmaDBm8tRfQMwA0e',
              },
            },
          },
          content: [],
        },
        {
          nodeType: 'embedded-asset-block',
          data: {
            target: {
              sys: {
                linkType: 'Asset',
                type: 'Link',
                id: 'jNhaW0aSc6Hu74SHVMtq',
              },
            },
          },
          content: [],
        },
      ],
    },
  ],
};

getRichTextEntityLinks(document);
/**
 * ->
 * {
 *   Entry: [
 *     { linkType: 'Entry', type: 'Link', id: 'yXmVKmaDBm8tRfQMwA0e' }
 *   ],
 *   Asset: [
 *     { linkType: 'Asset', type: 'Link', id: 'jNhaW0aSc6Hu74SHVMtq' }
 *   ]
 * }
 */
```
