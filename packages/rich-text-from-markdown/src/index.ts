import { Document, Node, Block, BLOCKS, INLINES, TopLevelBlock } from '@contentful/rich-text-types';

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
  ['blockquote', 'blockquote'],
  ['list', 'list'],
  ['listItem', 'list-item'],
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
  return { uri: node.url };
};

const isLink = (node: MarkdownNode): boolean => {
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
  ['list-item', 'block'],
  ['unordered-list', 'block'],
  ['ordered-list', 'block'],
  ['blockquote', 'block'],
  ['hr', 'block'],
  ['paragraph', 'block'],
  ['hyperlink', 'inline'],
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

const markdownNodeToRichTextNode = async (
  node: MarkdownNode,
  fallback: (mdNode: MarkdownNode) => Promise<Block>,
): Promise<Node> => {
  const nodeType = nodeTypeFor(node);
  const nodeContent = await markdownNodesToRichTextNodes(node.children, fallback);
  const filteredNodeContent = nodeContent.filter(node => {
    return node !== null && node !== undefined;
  });
  let nodeValue = node.value;
  let nodeData = {};
  if (isLink(node)) {
    nodeData = dataFor(node as MarkdownLinkNode);
    return Promise.resolve({
      nodeType: INLINES.HYPERLINK,
      data: nodeData,
      content: filteredNodeContent,
    });
  }
  if (isBlock(nodeType)) {
    return Promise.resolve({
      nodeType: nodeType,
      content: filteredNodeContent,
      data: nodeData,
    });
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
    return Promise.resolve({
      nodeType: nodeType,
      value: nodeValue,
      marks: marks,
      data: {},
    });
  }
  return fallback(node);
};

const markdownNodesToRichTextNodes = (
  nodes: MarkdownNode[],
  fallback: (mdNode: MarkdownNode) => Promise<Block>,
): Promise<Node[]> => {
  if (!nodes) {
    return Promise.resolve([]);
  }
  return Promise.all(
    nodes.map(async node => {
      return markdownNodeToRichTextNode(node, fallback);
    }),
  );
};

const treeToRichTextDocument = async (
  tree: MarkdownTree,
  fallback: (mdNode: MarkdownNode) => Promise<Block>,
): Promise<Document> => {
  const richNodePromises = markdownNodesToRichTextNodes(tree.children, fallback) as Promise<
    TopLevelBlock[]
  >;
  const richNodes: TopLevelBlock[] = (await richNodePromises) as TopLevelBlock[];
  const filteredNodes = richNodes.filter(node => {
    return node !== null && node !== undefined;
  });

  // Currently inline markdown images are coming in as markdown paragraphs with
  // an inline image markdown node as a child...but in rich text, markdown nodes need to be top-level embeds.
  let hoistedNodes: TopLevelBlock[] = [];
  for (const node of filteredNodes) {
    if (node.nodeType === 'paragraph') {
      const index = node.content.findIndex(child => {
        return child.nodeType === 'embedded-asset-block';
      });
      if (index !== -1) {
        const embedNode = node.content[index] as TopLevelBlock;
        hoistedNodes.push(embedNode);
        // node.content.splice(index, 1);
        // TODO: push the nodes before and after.
      } else {
        hoistedNodes.push(node);
      }
    } else {
      hoistedNodes.push(node);
    }
  }

  const output: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: hoistedNodes,
  };
  // TODO: handle links

  return Promise.resolve(output);
};

export async function richTextFromMarkdown(
  md: string,
  fallback: (mdNode: MarkdownNode) => Promise<Block> = n => null,
): Promise<Document> {
  const processor = unified().use(markdown, { commonmark: true });
  const tree = processor.parse(md);
  return await treeToRichTextDocument(tree, fallback);
}
