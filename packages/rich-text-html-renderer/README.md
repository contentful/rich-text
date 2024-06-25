# rich-text-html-renderer

HTML renderer for the Contentful rich text field type.

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install @contentful/rich-text-html-renderer
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add @contentful/rich-text-html-renderer
```

## Usage

```javascript
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'Hello world!',
          marks: [],
        },
      ],
    },
  ],
};

documentToHtmlString(document); // -> <p>Hello world!</p>
```

```javascript
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'Hello',
          marks: [{ type: 'bold' }],
        },
        {
          nodeType: 'text',
          value: ' world!',
          marks: [{ type: 'italic' }],
        },
      ],
    },
  ],
};

documentToHtmlString(document); // -> <p><b>Hello</b><u> world!</u></p>
```

You can also pass custom renderers for both marks and nodes as an optional parameter like so:

```javascript
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const document = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data:{},
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
          marks: [{ type: 'italic' }]
          data: {}
        },
      ],
    },
  ]
};

const options = {
  renderMark: {
    [MARKS.BOLD]: text => `<custom-bold>${text}<custom-bold>`
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, next) => `<custom-paragraph>${next(node.content)}</custom-paragraph>`
  }
}

documentToHtmlString(document, options);
// -> <custom-paragraph><custom-bold>Hello</custom-bold><u> world!</u></custom-paragraph>
```

Last, but not least, you can pass a custom rendering component for an embedded entry:

```javascript
import { BLOCKS } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const document = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'embedded-entry-block',
      data: {
        target: (...)Link<'Entry'>(...);
      },
    },
  ]
};

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => `<custom-component>${customComponentRenderer(node)}</custom-component>`
  }
}

documentToHtmlString(document, options);
// -> <custom-component>(...)Link<'Entry'>(...)</custom-component>
```

The `renderNode` keys should be one of the following `BLOCKS` and `INLINES` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BLOCKS`

  - `DOCUMENT`
  - `PARAGRAPH`
  - `HEADING_1`
  - `HEADING_2`
  - `HEADING_3`
  - `HEADING_4`
  - `HEADING_5`
  - `HEADING_6`
  - `UL_LIST`
  - `OL_LIST`
  - `LIST_ITEM`
  - `QUOTE`
  - `HR`
  - `EMBEDDED_ENTRY`
  - `EMBEDDED_ASSET`
  - `EMBEDDED_RESOURCE`

- `INLINES`
  - `EMBEDDED_ENTRY` (this is different from the `BLOCKS.EMBEDDED_ENTRY`)
  - `EMBEDDED_RESOURCE`
  - `HYPERLINK`
  - `ENTRY_HYPERLINK`
  - `ASSET_HYPERLINK`
  - `RESOURCE_HYPERLINK`

The `renderMark` keys should be one of the following `MARKS` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BOLD`
- `ITALIC`
- `UNDERLINE`
- `CODE`
- `SUPERSCRIPT`
- `SUBSCRIPT`
- `STRIKETHROUGH`

#### Preserving Whitespace

In your HTML rendering options, you can utilize the `preserveWhitespace` boolean flag. When set to `true`, this flag ensures that spaces and line breaks in the Contentful rich text content are preserved in the rendered HTML. Specifically, it replaces consecutive spaces with `&nbsp;` entities and retains line breaks using `<br />` tags. This capability is particularly beneficial for content that has specific formatting requirements involving spaces and line breaks.

```javascript
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'Hello     world!',
          marks: [],
        },
      ],
    },
  ],
};

const options = {
  preserveWhitespace: true,
};

documentToHtmlString(document, options);
// -> <p>Hello&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;world!</p>
```

With this configuration, the HTML output retains the spaces found between "Hello" and "world!".
