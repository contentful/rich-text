# DEPRECATED

Please read this resource: ["Using Rich Text with Gatsby"](https://www.contentful.com/developers/docs/tutorials/general/rich-text-and-gatsby/) to get the correct way to render Rich Text content in Gatsby.

====

Package `@contentful/gatsby-transformer-contentful-richtext` no longer maintained and deprecated in favour of `gatsby-source-contentful` and `@contentful/rich-text-react-renderer`.

## Reasons for deprecation

We've built Rich Text with the idea that developers have full control over the presentation of the Rich Text documents.
Although Transformer Plugins are an excellent solution for the data transformation, it's not like that for the rendering:

- lack of flexibility: existing plugin api forces to have only one place for defining resolvers (in `gatsby-config.js`) which makes it impossible to influence rendering depending on the context (e.g. use different components in header and footer).

- no jsx support: it is not possible to use React Components inside `gatsby-config.js` file.

## Replacement

The long-term replacement for `@contentful/gatsby-transformer-contentful-richtext` is a combination of `gatsby-source-contentful` and `@contentful/rich-text-react-renderer` packages.

JSON output is accessible on the Rich Text Node, see example query:

```graphql
{
  allContentfulBlogPost {
    edges {
      node {
        bodyRichText {
          json
        }
      }
    }
  }
}
```

The following snippet shows a way to define how Rich Text document is rendered:

```js
import React from 'react';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const Bold = ({ children }) => <span className="bold">{children}</span>;
const Text = ({ children }) => <p className="align-center">{children}</p>;

const options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
  },
};

documentToReactComponents(node.bodyRichText.json, options);
```

# gatsby-transformer-contentful-richtext

Parses Contentful Rich Text document

## Install

```sh
npm install --save @contentful/gatsby-transformer-contentful-richtext
```

## How to use

```js
plugins: [`@contentful/gatsby-transformer-contentful-richtext`];
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

[![Edit gatsby-starter-default](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/jljrl7z82w)

```js
// npm i @contentful/rich-text-types
const { BLOCKS, MARKS, INLINES } = require('@contentful/rich-text-types');
module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
    description:
      'Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.',
    author: '@gatsbyjs',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-source-contentful',
      options: {
        spaceId: '<space-id>',
        accessToken: '<access-token>',
      },
    },
    {
      resolve: '@contentful/gatsby-transformer-contentful-richtext',
      options: {
        renderOptions: {
          /*
           * Defines custom html string for each node type like heading, embedded entries etc..
           */
          renderNode: {
            // Example
            [INLINES.ASSET_HYPERLINK]: (node) => {
              return `<img class='custom-asset' src="${node.data.target.fields.file['en-US'].url}"/>`;
            },
            [INLINES.EMBEDDED_ENTRY]: (node) => {
              return `<div class='custom-entry' />${node.data.target.fields.name['en-US']}</div>`;
            },
          },
          /*
           * Defines custom html string for each mark type like bold, italic etc..
           */
          renderMark: {
            // Example
            [MARKS.BOLD]: (text) => `<custom-bold>${text}<custom-bold>`,
          },
        },
      },
    },
  ],
};
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
