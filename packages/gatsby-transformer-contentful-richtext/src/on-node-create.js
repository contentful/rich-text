const crypto = require(`crypto`)

module.exports = async function onCreateNode(
  { node, getNode, loadNodeContent, actions, createNodeId }
) {
  const { createNode, createParentChildLink } = actions

  // We only care about markdown content.
  if (
    node.internal.mediaType !== `text/richtext`
  ) {
    return
  }

  const content = await loadNodeContent(node)

  const richTextNode = {
    id: createNodeId(`${node.id} >>> ContentfulRichText`),
    children: [],
    parent: node.id,
    internal: {
      content,
      type: `ContentfulRichText`,
    },
  } 
  richTextNode.internal.contentDigest = crypto
    .createHash(`md5`)
    .update(JSON.stringify(richTextNode))
    .digest(`hex`)
  createNode(richTextNode)
  createParentChildLink({ parent: node, child: richTextNode })
}
