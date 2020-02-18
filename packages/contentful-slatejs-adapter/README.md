# contentful-slatejs-adapter

This library provides an adapter to convert Slate's document structure to Contentful's rich text document structure and vice-versa.

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install @contentful/contentful-slatejs-adapter
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add @contentful/contentful-slatejs-adapter
```

## Usage

_TBA_

```json
{
  "category": "document",
  "content": [
    {
      "category": "block",
      "type": "header-one",
      "content": [
        {
          "category": "text",
          "type": "text",
          "value": "This is a headline!",
          "marks": [
            {
              "object": "mark",
              "type": "bold",
              "data": {}
            }
          ]
        }
      ]
    },
    {
      "category": "block",
      "type": "paragraph",
      "content": [
        {
          "category": "text",
          "type": "text",
          "value": "",
          "marks": [
            {
              "object": "mark",
              "type": "bold",
              "data": {}
            }
          ]
        }
      ]
    },
    {
      "category": "block",
      "type": "paragraph",
      "content": [
        {
          "category": "text",
          "type": "text",
          "value": "and this is a bold text",
          "marks": [
            {
              "object": "mark",
              "type": "bold",
              "data": {}
            }
          ]
        },
        {
          "category": "text",
          "type": "text",
          "value": " but now i am not bold anymore. ",
          "marks": []
        },
        {
          "category": "text",
          "type": "text",
          "value": "However, ",
          "marks": [
            {
              "object": "mark",
              "type": "italic",
              "data": {}
            }
          ]
        },
        {
          "category": "text",
          "type": "text",
          "value": " i am now ",
          "marks": []
        },
        {
          "category": "text",
          "type": "text",
          "value": "underlined with shit. ",
          "marks": [
            {
              "object": "mark",
              "type": "underlined",
              "data": {}
            }
          ]
        }
      ]
    }
  ]
}
```
