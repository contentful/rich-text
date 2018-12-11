# gatsby-transformer-contentful-richtext

Parses Contentful Rich Text document

## Install

```sh
npm install --save @contentful/gatsby-transformer-contentful-richtext
```

## How to use

```js
plugins: [`@contentful/gatsby-transformer-contentful-richtext`]
```

## Query

After adding the plugin you will be able to query the html representation of the rich text field

```graphql
{
  allContentfulBlogPost {
    bodyRichText {
      childContentfulRichText {
        html
      }
    }
  }
}
```

## Advanced configuration

```js
// npm i @contentful/rich-text-types
const { BLOCKS, MARKS } = require ('@contentful/rich-text-types')

plugins: [
  {
   resolve: `gatsby-transformer-contentful-richtext`,
   options: {
      renderOptions: {
        /*
        * Defines custom html string for each node type like heading, embedded entries etc..
        */
        renderNode: {
          // Example
          [BLOCKS.EMBEDDED_ENTRY]: (node) => `<div class='custom-entry'>${customComponentRenderer(node)}</div>`
        },
        /*
        * Defines custom html string for each mark type like bold, italic etc..
        */
        renderMark: {
          // Example
          [MARKS.BOLD]: text => `<custom-bold>${text}<custom-bold>`
        }
      }
   }
  }
]
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

- `MARKS`
  - `BOLD`
  - `ITALIC`
  - `UNDERLINE`
  - `CODE`
