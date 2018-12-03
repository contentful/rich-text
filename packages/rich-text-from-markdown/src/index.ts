import { Document, Node, Block, BLOCKS, TopLevelBlock, INLINES } from '@contentful/rich-text-types';

import unified from 'unified';
import markdown from 'remark-parse';

const markdownNodeTypes = new Map<string, string>([
  ['paragraph', BLOCKS.PARAGRAPH],
  ['heading', 'heading'],
  ['text', 'text'],
  ['emphasis', 'text'],
  ['strong', 'text'],
  ['delete', 'text'],
  ['inlineCode', 'text'],
  ['link', INLINES.HYPERLINK],
  ['thematicBreak', BLOCKS.HR],
  ['blockquote', BLOCKS.QUOTE],
  ['list', 'list'],
  ['listItem', BLOCKS.LIST_ITEM],
]);
export interface MarkdownNode {
  depth: string;
  type: string;
  ordered: Boolean;
  children: MarkdownNode[];
  content: MarkdownNode[];
  value: string;
}

export interface MarkdownTree {
  children: MarkdownNode[];
}

interface MarkdownLinkNode extends MarkdownNode {
  url: string;
}
const nodeTypeFor = (node: MarkdownNode) => {
  const nodeType: string = markdownNodeTypes.get(node.type);

  switch (nodeType) {
    case 'heading':
      return `${nodeType}-${node.depth}`;
    case 'list':
      return `${node.ordered ? 'ordered' : 'unordered'}-list`;
    default:
      return nodeType;
  }
};

const markTypes = new Map([['emphasis', 'italic'], ['strong', 'bold'], ['inlineCode', 'code']]);
const markTypeFor = (node: MarkdownNode) => {
  return markTypes.get(node.type);
};

const dataFor = (node: MarkdownLinkNode) => {
  return node.type === 'link' ? { uri: node.url } : {};
};

const isLink = (node: MarkdownNode): node is MarkdownLinkNode => {
  return node.type === 'link';
};

const nodeContainerTypes = new Map([
  ['delete', 'block'],
  [BLOCKS.HEADING_1, 'block'],
  [BLOCKS.HEADING_2, 'block'],
  [BLOCKS.HEADING_3, 'block'],
  [BLOCKS.HEADING_4, 'block'],
  [BLOCKS.HEADING_5, 'block'],
  [BLOCKS.HEADING_6, 'block'],
  [BLOCKS.LIST_ITEM, 'block'],
  [BLOCKS.UL_LIST, 'block'],
  [BLOCKS.OL_LIST, 'block'],
  [BLOCKS.QUOTE, 'block'],
  [BLOCKS.HR, 'block'],
  [BLOCKS.PARAGRAPH, 'block'],
  [INLINES.HYPERLINK, 'inline'],
  ['text', 'text'],
  ['emphasis]', 'text'],
  ['strong]', 'text'],
  ['inlineCode]', 'text'],
]);

const isBlock = (nodeType: string) => {
  return nodeContainerTypes.get(nodeType) === 'block';
};

const isText = (nodeType: string) => {
  return nodeContainerTypes.get(nodeType) === 'text';
};

const markdownNodeToRichTextNode = (
  node: MarkdownNode,
  fallback: (mdNode: MarkdownNode) => Block,
) => {
  const nodeType = nodeTypeFor(node);
  const nodeContent = markdownNodesToRichTextNodes(node.children, fallback);
  let nodeValue = node.value;
  let nodeData = {};
  if (isLink(node)) {
    nodeData = dataFor(node);
  }
  if (isBlock(nodeType)) {
    return {
      nodeType: nodeType,
      content: nodeContent,
      data: nodeData,
    };
  } else if (isText(nodeType)) {
    let marks = [];
    if (node.type !== 'text') {
      // TODO: this implementation needs to handle arbitrarily nested marks
      // for example: **_Hello_, world!**
      // this a markdown node here that's why we use children
      nodeValue = node.children ? node.children[0].value : node.value;
      marks.push({
        type: markTypeFor(node),
      });
    }

    return {
      nodeType: nodeType,
      value: nodeValue,
      marks: marks,
      data: {},
    };
  }
};

const markdownNodesToRichTextNodes = (
  nodes: MarkdownNode[],
  fallback: (mdNode: MarkdownNode) => Block,
): Node[] => {
  if (!nodes) {
    return [];
  }
  const richNodes = nodes
    .map(node => {
      const richNode = markdownNodeToRichTextNode(node, fallback);
      if (!richNode) {
        return fallback(node);
      }
      return richNode;
    })
    .filter(Boolean);
  return richNodes;
};

const treeToRichTextDocument = (
  tree: MarkdownTree,
  fallback: (mdNode: MarkdownNode) => Block,
): Document => {
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: markdownNodesToRichTextNodes(tree.children, fallback) as TopLevelBlock[],
  };
};

export function richTextFromMarkdown(
  md: string,
  fallback: (mdNode: MarkdownNode) => Block = n => null,
): Document {
  const processor = unified().use(markdown, { commonmark: true });
  const tree = processor.parse(md);
  return treeToRichTextDocument(tree, fallback);
}
