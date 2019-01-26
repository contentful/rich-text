const { documentToHtmlString } = require(`@contentful/rich-text-html-renderer`);
const { documentToPlainTextString } = require(`@contentful/rich-text-plain-text-renderer`);
const { GraphQLString, GraphQLInt } = require(`gatsby/graphql`);
const words = require('lodash.words');

let pathPrefixCacheStr = ``;
const htmlCacheKey = node =>
  `transformer-contentful-rich-text-html-${node.internal.contentDigest}-${pathPrefixCacheStr}`;

const ttrCacheKey = node =>
  `transformer-contentful-rich-text-ttr-${node.internal.contentDigest}-${pathPrefixCacheStr}`;

module.exports = ({ type, cache, pathPrefix }, pluginOptions) => {
  if (type.name !== `ContentfulRichText`) {
    return {};
  }

  pathPrefixCacheStr = pathPrefix || ``;

  async function cacheWrap(key, fn) {
    let cached = await cache.get(key);

    if (!cached) {
      let toCache = await fn();
      cache.set(toCache);

      return toCache;
    }

    return cached;
  }

  let { renderOptions } = pluginOptions;
  renderOptions = renderOptions || {};

  return new Promise(resolve => {
    return resolve({
      html: {
        type: GraphQLString,
        resolve: richTextNode =>
          cacheWrap(htmlCacheKey(richTextNode), () =>
            documentToHtmlString(JSON.parse(richTextNode.internal.content), renderOptions),
          ),
      },

      timeToRead: {
        type: GraphQLInt,
        resolve: richTextNode =>
          cacheWrap(ttrCacheKey(richTextNode), () => {
            let plainString = documentToPlainTextString(JSON.parse(richTextNode.internal.content));
            let wordsCount = words(plainString).length;
            let avgWPM = 200;

            return Math.floor(wordsCount / avgWPM) || 1;
          }),
      },
    });
  });
};
