const {
  documentToHtmlString
} = require(`@contentful/rich-text-html-renderer`)
const {
  GraphQLString
} = require(`gatsby/graphql`)

let pathPrefixCacheStr = ``
const htmlCacheKey = node =>
  `transformer-contentful-rich-text-html-${
    node.internal.contentDigest
  }-${pathPrefixCacheStr}`

module.exports = ({
  type,
  cache,
  pathPrefix
}, pluginOptions) => {
  if (type.name !== `ContentfulRichText`) {
    return {}
  }

  pathPrefixCacheStr = pathPrefix || ``

  let {
    renderOptions
  } = pluginOptions
  renderOptions = renderOptions || {}

  return new Promise((resolve, reject) => {
    async function getHTML(richTextNode) {
      const cachedHTML = await cache.get(htmlCacheKey(richTextNode))

      if (cachedHTML) {
        return cachedHTML
      } else {
        const html = documentToHtmlString(
          JSON.parse(richTextNode.internal.content),
          renderOptions
        )
        // Save new HTML to cache and return
        cache.set(htmlCacheKey(richTextNode), html)
        return html
      }
    }
    return resolve({
      html: {
        type: GraphQLString,
        resolve(richTextNode) {
          return getHTML(richTextNode)
        },
      },
    })
  })
}
