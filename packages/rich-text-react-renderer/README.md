# rich-text-react-renderer

React renderer for the Contentful rich text field type.

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install @contentful/rich-text-react-renderer
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add @contentful/rich-text-react-renderer
```

## Usage

```javascript
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

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

documentToReactComponents(document); // -> <p>Hello world!</p>
```

```javascript
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

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

documentToReactComponents(document);
// -> <p><b>Hello</b><u> world!</u></p>
```

You can also pass custom renderers for both marks and nodes as an optional parameter like so:

```javascript
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

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

const Bold = ({ children }) => <p className="bold">{children}</p>;

const Text = ({ children }) => <p className="align-center">{children}</p>;

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
  },
};

documentToReactComponents(document, options);
// -> <p class="align-center"><p class="bold">Hello</p><u> world!</u></p>
```

Last, but not least, you can pass a custom rendering component for an embedded entry:

```javascript
import { BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'embedded-entry-block',
      data: {
        target: (...)Link<'Entry'>(...);
      },
    },
  ]
};

const CustomComponent = ({ title, description }) => (
  <div>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const { title, description } = node.target.fields;
      return <CustomComponent title={title} description={description} />
    }
  }
};

documentToReactComponents(document, options);
// -> <div><h2>[title]</h2><p>[description]</p></div>
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

- `INLINES`
  - `EMBEDDED_ENTRY` (this is different from the `BLOCKS.EMBEDDED_ENTRY`)
  - `HYPERLINK`
  - `ENTRY_HYPERLINK`
  - `ASSET_HYPERLINK`

The `renderMark` keys should be one of the following `MARKS` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BOLD`
- `ITALIC`
- `UNDERLINE`
- `CODE`
