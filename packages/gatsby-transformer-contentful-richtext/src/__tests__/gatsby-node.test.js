const { onCreateNode } = require(`../gatsby-node`)
const _ = require(`lodash`)

describe(`Process Rich Text content correctly`, () => {
  const node = {
    id: `whatever`,
    children: [],
    internal: {
      contentDigest: `whatever`,
      mediaType: `text/richtext`,
    },
  }

  // Make some fake functions its expecting.
  const loadNodeContent = node => Promise.resolve(node.content)
  describe(`Process generated richtext node correctly`, () => {

    it(`Correctly creates a new ContentfulRichText node`, async () => {

      const content = `
        {
          nodeType: 'document',
          data: {},
          content: [
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'Hello world!',
                  marks: [],
                  data: {}
                },
              ],
            },
          ],
        }
      `
      node.content = content
      const createNode = jest.fn()
      const createParentChildLink = jest.fn()
      const actions = { createNode, createParentChildLink }
      const createNodeId = jest.fn()
      createNodeId.mockReturnValue(`uuid-from-gatsby`)

      await onCreateNode({
        node,
        loadNodeContent,
        actions,
        createNodeId,
      }).then(() => {
        expect(createNode.mock.calls).toMatchSnapshot()
        expect(createParentChildLink.mock.calls).toMatchSnapshot()
        expect(createNode).toHaveBeenCalledTimes(1)
        expect(createParentChildLink).toHaveBeenCalledTimes(1)
      })
    })
  })
})
