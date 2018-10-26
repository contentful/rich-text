import {
  Document,
  Mark,
  Text,
  BLOCKS,
  MARKS,
  INLINES,
  Block,
  Inline,
} from '@contentful/rich-text-types';

type NonTextNode = Block | Inline;
type Node = Text | NonTextNode;

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
  [INLINES.ASSET_HYPERLINK]: node => defaultInline(INLINES.ASSET_HYPERLINK, node),
  [INLINES.ENTRY_HYPERLINK]: node => defaultInline(INLINES.ENTRY_HYPERLINK, node),
  [INLINES.EMBEDDED_ENTRY]: node => defaultInline(INLINES.EMBEDDED_ENTRY, node),
  [INLINES.HYPERLINK]: (node, next) => `<a href="${node.data.uri}">${next(node.content)}</a>`,
};

const defaultMarkRenderers: RenderMark = {
  [MARKS.BOLD]: text => `<b>${text}</b>`,
  [MARKS.ITALIC]: text => `<i>${text}</i>`,
  [MARKS.UNDERLINE]: text => `<u>${text}</u>`,
  [MARKS.CODE]: text => `<code>${text}</code>`,
};

export const defaultInline = (type: string, node: NonTextNode) =>
  `<span>type: ${type} id: ${node.data.target.sys.id}</span>`;

export interface Next {
  (nodes: Node[]): string;
}

export interface NodeRenderer {
  (node: NonTextNode, next: Next): string;
}

export interface RenderNode {
  [k: string]: NodeRenderer;
}

export interface MarkRenderer {
  (text: string): string;
}

export interface RenderMark {
  [k: string]: MarkRenderer;
}

export interface Options {
  renderNode?: RenderNode;
  renderMark?: RenderMark;
}

export function documentToHtmlString(doc: Document, options: Partial<Options> = {}): string {
  return nodeListToHtmlString(doc.content, {
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

function nodeListToHtmlString(nodes: Node[], { renderNode, renderMark }: Options): string {
  return nodes.map<string>(node => nodeToHtmlString(node, { renderNode, renderMark })).join('');
}

function nodeToHtmlString(node: Node, { renderNode = {}, renderMark = {} }: Options): string {
  if (isText(node)) {
    if (node.marks.length > 0) {
      return node.marks.reduce((value: string, mark: Mark): string => {
        if (!renderMark[mark.type]) {
          return value;
        }
        return renderMark[mark.type](value);
      }, node.value);
    }

    return node.value;
  } else {
    const nextNode: Next = nodes => nodeListToHtmlString(nodes, { renderMark, renderNode });
    if (!node.nodeType || !renderNode[node.nodeType]) {
      // TODO: Figure what to return when passed an unrecognized node.
      return '';
    }
    return renderNode[node.nodeType](node as NonTextNode, nextNode);
  }
}

function isText(node: Node): node is Text {
  return node.nodeType === 'text';
}
