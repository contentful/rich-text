import {
  BLOCKS,
  Block,
  Document,
  INLINES,
  Inline,
  MARKS,
  Mark,
  Text,
  helpers,
} from '@contentful/rich-text-types';
import escape from 'escape-html';

const attributeValue = (value: string) => `"${value.replace(/"/g, '&quot;')}"`;

const defaultNodeRenderers: RenderNode = {
  [BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content)}</p>`,
  [BLOCKS.HEADING_1]: (node, next) => `<h1>${next(node.content)}</h1>`,
  [BLOCKS.HEADING_2]: (node, next) => `<h2>${next(node.content)}</h2>`,
  [BLOCKS.HEADING_3]: (node, next) => `<h3>${next(node.content)}</h3>`,
  [BLOCKS.HEADING_4]: (node, next) => `<h4>${next(node.content)}</h4>`,
  [BLOCKS.HEADING_5]: (node, next) => `<h5>${next(node.content)}</h5>`,
  [BLOCKS.HEADING_6]: (node, next) => `<h6>${next(node.content)}</h6>`,
  [BLOCKS.EMBEDDED_ENTRY]: (node, next) => `<div>${next(node.content)}</div>`,
  [BLOCKS.EMBEDDED_RESOURCE]: (node, next) => `<div>${next(node.content)}</div>`,
  [BLOCKS.UL_LIST]: (node, next) => `<ul>${next(node.content)}</ul>`,
  [BLOCKS.OL_LIST]: (node, next) => `<ol>${next(node.content)}</ol>`,
  [BLOCKS.LIST_ITEM]: (node, next) => `<li>${next(node.content)}</li>`,
  [BLOCKS.QUOTE]: (node, next) => `<blockquote>${next(node.content)}</blockquote>`,
  [BLOCKS.HR]: () => '<hr/>',
  [BLOCKS.TABLE]: (node, next) => `<table>${next(node.content)}</table>`,
  [BLOCKS.TABLE_ROW]: (node, next) => `<tr>${next(node.content)}</tr>`,
  [BLOCKS.TABLE_HEADER_CELL]: (node, next) => `<th>${next(node.content)}</th>`,
  [BLOCKS.TABLE_CELL]: (node, next) => `<td>${next(node.content)}</td>`,
  [INLINES.ASSET_HYPERLINK]: (node) => defaultInline(INLINES.ASSET_HYPERLINK, node as Inline),
  [INLINES.ENTRY_HYPERLINK]: (node) => defaultInline(INLINES.ENTRY_HYPERLINK, node as Inline),
  [INLINES.RESOURCE_HYPERLINK]: (node) =>
    defaultInlineResource(INLINES.RESOURCE_HYPERLINK, node as Inline),
  [INLINES.EMBEDDED_ENTRY]: (node) => defaultInline(INLINES.EMBEDDED_ENTRY, node as Inline),
  [INLINES.EMBEDDED_RESOURCE]: (node) =>
    defaultInlineResource(INLINES.EMBEDDED_RESOURCE, node as Inline),
  [INLINES.HYPERLINK]: (node, next) => {
    const href = typeof node.data.uri === 'string' ? node.data.uri : '';
    return `<a href=${attributeValue(href)}>${next(node.content)}</a>`;
  },
};

const defaultMarkRenderers: RenderMark = {
  [MARKS.BOLD]: (text) => `<b>${text}</b>`,
  [MARKS.ITALIC]: (text) => `<i>${text}</i>`,
  [MARKS.UNDERLINE]: (text) => `<u>${text}</u>`,
  [MARKS.CODE]: (text) => `<code>${text}</code>`,
  [MARKS.SUPERSCRIPT]: (text) => `<sup>${text}</sup>`,
  [MARKS.SUBSCRIPT]: (text) => `<sub>${text}</sub>`,
  [MARKS.STRIKETHROUGH]: (text) => `<s>${text}</s>`,
};

const defaultInline = (type: string, node: Inline) =>
  `<span>type: ${escape(type)} id: ${escape(node.data.target.sys.id)}</span>`;

const defaultInlineResource = (type: string, node: Inline) =>
  `<span>type: ${escape(type)} urn: ${escape(node.data.target.sys.urn)}</span>`;

export type CommonNode = Text | Block | Inline;

export interface Next {
  (nodes: CommonNode[]): string;
}

export interface NodeRenderer {
  (node: Block | Inline, next: Next): string;
}

export interface RenderNode {
  [k: string]: NodeRenderer;
}

export interface RenderMark {
  [k: string]: (text: string) => string;
}

export interface Options {
  /**
   * Node renderers
   */
  renderNode?: RenderNode;
  /**
   * Mark renderers
   */
  renderMark?: RenderMark;
  /**
   * Keep line breaks and multiple spaces
   */
  preserveWhitespace?: boolean;
  /**
   * Strip empty trailing paragraph from the document
   */
  stripEmptyTrailingParagraph?: boolean;
}

/**
 * Serialize a Contentful Rich Text `document` to an html string.
 */
export function documentToHtmlString(
  richTextDocument: Document,
  options: Partial<Options> = {},
): string {
  if (!richTextDocument || !richTextDocument.content) {
    return '';
  }

  // Strip empty trailing paragraph if enabled
  let processedDocument = richTextDocument;
  if (options.stripEmptyTrailingParagraph) {
    processedDocument = helpers.stripEmptyTrailingParagraphFromDocument(richTextDocument);
  }

  return nodeListToHtmlString(processedDocument.content, {
    renderNode: {
      ...defaultNodeRenderers,
      ...options.renderNode,
    },
    renderMark: {
      ...defaultMarkRenderers,
      ...options.renderMark,
    },
    preserveWhitespace: options.preserveWhitespace,
  });
}

function nodeListToHtmlString(
  nodes: CommonNode[],
  { renderNode, renderMark, preserveWhitespace }: Options,
): string {
  return nodes
    .map<string>((node) => nodeToHtmlString(node, { renderNode, renderMark, preserveWhitespace }))
    .join('');
}

function nodeToHtmlString(
  node: CommonNode,
  { renderNode, renderMark, preserveWhitespace }: Options,
): string {
  if (helpers.isText(node)) {
    let nodeValue = escape(node.value);

    // If preserveWhitespace is true, handle line breaks and spaces.
    if (preserveWhitespace) {
      nodeValue = nodeValue
        .replace(/\n/g, '<br/>')
        .replace(/ {2,}/g, (match) => '&nbsp;'.repeat(match.length));
    }

    if (node.marks.length > 0) {
      return node.marks.reduce((value: string, mark: Mark) => {
        if (!renderMark[mark.type]) {
          return value;
        }
        return renderMark[mark.type](value);
      }, nodeValue);
    }

    return nodeValue;
  } else {
    const nextNode: Next = (nodes) =>
      nodeListToHtmlString(nodes, { renderMark, renderNode, preserveWhitespace });
    if (!node.nodeType || !renderNode[node.nodeType]) {
      // TODO: Figure what to return when passed an unrecognized node.
      return '';
    }
    return renderNode[node.nodeType](node, nextNode);
  }
}
