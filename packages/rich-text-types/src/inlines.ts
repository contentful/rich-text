/**
 * Map of all Contentful inline types. Inline contain inline or text nodes.
 *
 * @note This should be kept in alphabetical order since the
 * [validation package](https://github.com/contentful/content-stack/tree/master/packages/validation)
 *  relies on the values being in a predictable order.
 */
export enum INLINES {
  ASSET_HYPERLINK = 'asset-hyperlink',
  EMBEDDED_ENTRY = 'embedded-entry-inline',
  EMBEDDED_RESOURCE = 'embedded-resource-inline',
  ENTRY_HYPERLINK = 'entry-hyperlink',
  HYPERLINK = 'hyperlink',
  RESOURCE_HYPERLINK = 'resource-hyperlink',
}
