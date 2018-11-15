import { Document, Node, Block, BLOCKS, TopLevelBlock } from '@contentful/rich-text-types';

import unified from 'unified';
import markdown from 'remark-parse';

const markdownNodeTypes = new Map<string, string>([
  ['paragraph', 'paragraph'],
  ['heading', 'heading'],
  ['text', 'text'],
  ['emphasis', 'text'],
  ['strong', 'text'],
  ['delete', 'text'],
  ['inlineCode', 'text'],
  ['link', 'hyperlink'],
  ['thematicBreak', 'hr'],
  ['blockquote', 'quote'],
  ['list', 'list'],
  ['listItem', 'list-item'],
]);

export interface MarkdownNode {
  depth: string;
  type: string;
  ordered: Boolean;
  children: Array<MarkdownNode>;
  content: Array<MarkdownNode>;
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
  ['heading-1', 'block'],
  ['heading-2', 'block'],
  ['heading-3', 'block'],
  ['heading-4', 'block'],
  ['heading-5', 'block'],
  ['heading-6', 'block'],
  ['listItem', 'block'],
  ['blockquote', 'block'],
  ['thematicBreak', 'block'],
  ['list', 'block'],
  ['paragraph', 'block'],

  ['link', 'inline'],

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

const markdwonNodeToRichTextNode = (
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
      nodeValue = node.content ? node.content[0].value : node.value;
      marks.push({
        type: markTypeFor(node),
        object: 'mark',
        data: {},
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
      const richNode = markdwonNodeToRichTextNode(node, fallback);
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
