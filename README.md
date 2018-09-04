contentful-slatejs-adapter
=====

The library provides an adapter to convert Slate's Document to Contentful Document.

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

## Releases flow (Atomatic Releases)

Automatic releases are possible thanks to [semantic release](https://github.com/semantic-release/semantic-release), which publishes the code automatically on npm and generates a changelog.

We follow [angular commit format](https://gist.github.com/stephenparish/9941e89d80e2bc58a153#allowed-type) to generate a changelog.

You'll need to use `npm run commit`, to create conventional commits.
