import escape from 'escape-html';
import {
  Document,
  Mark,
  Text,
  BLOCKS,
  MARKS,
  INLINES,
  Block,
  Inline,
  helpers,
} from '@contentful/rich-text-types';

const defaultNodeRenderers: RenderNode = {
  [BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content)}</p>`,
  [BLOCKS.HEADING_1]: (node, next) => `<h1>${next(node.content)}</h1>`,
  [BLOCKS.HEADING_2]: (node, next) => `<h2>${next(node.content)}</h2>`,
  [BLOCKS.HEADING_3]: (node, next) => `<h3>${next(node.content)}</h3>`,
  [BLOCKS.HEADING_4]: (node, next) => `<h4>${next(node.content)}</h4>`,
  [BLOCKS.HEADING_5]: (node, next) => `<h5>${next(node.content)}</h5>`,
  [BLOCKS.HEADING_6]: (node, next) => `<h6>${next(node.content)}</h6>`,
  [BLOCKS.EMBEDDED_ENTRY]: (node, next) => `<div>${next(node.content)}</div>`,
  [BLOCKS.UL_LIST]: (node, next) => `<ul>${next(node.content)}</ul>`,
  [BLOCKS.OL_LIST]: (node, next) => `<ol>${next(node.content)}</ol>`,
  [BLOCKS.LIST_ITEM]: (node, next) => `<li>${next(node.content)}</li>`,
  [BLOCKS.QUOTE]: (node, next) => `<blockquote>${next(node.content)}</blockquote>`,
  [BLOCKS.HR]: () => '<hr/>',
  [INLINES.ASSET_HYPERLINK]: node => defaultInline(INLINES.ASSET_HYPERLINK, node as Inline),
  [INLINES.ENTRY_HYPERLINK]: node => defaultInline(INLINES.ENTRY_HYPERLINK, node as Inline),
  [INLINES.EMBEDDED_ENTRY]: node => defaultInline(INLINES.EMBEDDED_ENTRY, node as Inline),
  [INLINES.HYPERLINK]: (node, next) => `<a href="${node.data.uri}">${next(node.content)}</a>`,
};

const defaultMarkRenderers: RenderMark = {
  [MARKS.BOLD]: text => `<b>${text}</b>`,
  [MARKS.ITALIC]: text => `<i>${text}</i>`,
  [MARKS.UNDERLINE]: text => `<u>${text}</u>`,
  [MARKS.CODE]: text => `<code>${text}</code>`,
  [MARKS.SUPERSCRIPT]: text => `<sup>${text}</sup>`,
  [MARKS.SUBSCRIPT]: text => `<sub>${text}</sub>`,
};

const defaultInline = (type: string, node: Inline) =>
  `<span>type: ${type} id: ${node.data.target.sys.id}</span>`;

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

  return nodeListToHtmlString(richTextDocument.content, {
    renderNode: {
      ...defaultNodeRenderers,
      ...options.renderNode,
    },
    renderMark: {
      ...defaultMarkRenderers,
      ...options.renderMark,
    },
  });
}

function nodeListToHtmlString(nodes: CommonNode[], { renderNode, renderMark }: Options): string {
  return nodes.map<string>(node => nodeToHtmlString(node, { renderNode, renderMark })).join('');
}

function nodeToHtmlString(node: CommonNode, { renderNode, renderMark }: Options): string {
  if (helpers.isText(node)) {
    const nodeValue = escape(node.value);
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
    const nextNode: Next = nodes => nodeListToHtmlString(nodes, { renderMark, renderNode });
    if (!node.nodeType || !renderNode[node.nodeType]) {
      // TODO: Figure what to return when passed an unrecognized node.
      return '';
    }
    return renderNode[node.nodeType](node, nextNode);
  }
}
