import React, { ReactNode, ReactElement } from 'react';
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
  [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
  [BLOCKS.HEADING_1]: (node, children) => <h1>{children}</h1>,
  [BLOCKS.HEADING_2]: (node, children) => <h2>{children}</h2>,
  [BLOCKS.HEADING_3]: (node, children) => <h3>{children}</h3>,
  [BLOCKS.HEADING_4]: (node, children) => <h4>{children}</h4>,
  [BLOCKS.HEADING_5]: (node, children) => <h5>{children}</h5>,
  [BLOCKS.HEADING_6]: (node, children) => <h6>{children}</h6>,
  [BLOCKS.EMBEDDED_ENTRY]: (node, children) => <div>{children}</div>,
  [BLOCKS.UL_LIST]: (node, children) => <ul>{children}</ul>,
  [BLOCKS.OL_LIST]: (node, children) => <ol>{children}</ol>,
  [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
  [BLOCKS.QUOTE]: (node, children) => <blockquote>{children}</blockquote>,
  [BLOCKS.HR]: () => <hr />,
  [INLINES.ASSET_HYPERLINK]: node => defaultInline(INLINES.ASSET_HYPERLINK, node as Inline),
  [INLINES.ENTRY_HYPERLINK]: node => defaultInline(INLINES.ENTRY_HYPERLINK, node as Inline),
  [INLINES.EMBEDDED_ENTRY]: node => defaultInline(INLINES.EMBEDDED_ENTRY, node as Inline),
  [INLINES.HYPERLINK]: (node, children) => <a href={node.data.uri}>{children}</a>,
};

const defaultMarkRenderers: RenderMark = {
  [MARKS.BOLD]: text => <b>{text}</b>,
  [MARKS.ITALIC]: text => <i>{text}</i>,
  [MARKS.UNDERLINE]: text => <u>{text}</u>,
  [MARKS.CODE]: text => <code>{text}</code>,
};

function defaultInline(type: string, node: Inline) {
  return (
    <span key={node.data.target.sys.id}>
      type: {node.nodeType} id: {node.data.target.sys.id}
    </span>
  );
}

export type CommonNode = Text | Block | Inline;

export interface Next {
  (nodes: CommonNode[]): ReactNode;
}

export interface NodeRenderer {
  (node: Block | Inline, children: Next): ReactNode;
}

export interface RenderNode {
  [k: string]: NodeRenderer;
}

export interface RenderMark {
  [k: string]: (text: ReactNode) => ReactElement<any>;
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
 * Serialize a Contentful Rich Text `document` to React tree
 */
export function documentToReactTree(
  richTextDocument: Document,
  options: Partial<Options> = {},
): ReactNode {
  if (!richTextDocument || !richTextDocument.content) {
    return [];
  }

  return nodeListToReactTree(richTextDocument.content, {
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

function nodeListToReactTree(nodes: CommonNode[], { renderNode, renderMark }: Options): ReactNode {
  return nodes.map<ReactNode>((node, index) =>
    appendKeyToValidElement(nodeToReactTree(node, { renderNode, renderMark }), index),
  );
}

function nodeToReactTree(node: CommonNode, { renderNode, renderMark }: Options): ReactNode {
  if (helpers.isText(node)) {
    if (node.marks.length > 0) {
      return node.marks.reduce(
        (value: ReactNode, mark: Mark) => {
          if (!renderMark[mark.type]) {
            return value;
          }
          return renderMark[mark.type](value);
        },
        node.value as ReactNode,
      );
    }
    return node.value;
  } else {
    const children: Next = nodes => nodeListToReactTree(nodes, { renderMark, renderNode });
    if (!node.nodeType || !renderNode[node.nodeType]) {
      // TODO: Figure what to return when passed an unrecognized node.
      return null;
    }
    return renderNode[node.nodeType](node, children);
  }
}

function appendKeyToValidElement(element: ReactNode, key: string | number): ReactNode {
  if (element && React.isValidElement(element) && element.key === null) {
    return React.cloneElement(element, { key });
  }
  return element;
}
