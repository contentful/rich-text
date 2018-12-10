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
export interface MarkdownNode extends MarkdownTree {
  depth: string;
  type: string;
  ordered: Boolean;
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
  ['emphasis', 'text'],
  ['strong', 'text'],
  ['inlineCode', 'text'],
]);

const isBlock = (nodeType: string) => {
  return nodeContainerTypes.get(nodeType) === 'block';
};

const isText = (nodeType: string) => {
  return nodeContainerTypes.get(nodeType) === 'text';
};

const isInline = (nodeType: string) => {
  return nodeContainerTypes.get(nodeType) === 'inline';
};

const markdownNodeToRichTextNode = async (
  node: MarkdownNode,
  fallback: (mdNode: MarkdownNode) => Promise<Block>,
): Promise<Node> => {
  const nodeType = nodeTypeFor(node);
  const nodeContent = await markdownNodesToRichTextNodes(node.children, fallback);
  const filteredNodeContent = nodeContent.filter(Boolean);
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
  } else if (isInline(nodeType)) {
    return Promise.resolve({
      nodeType: nodeType,
      value: nodeValue,
      content: nodeContent,
      data: nodeData,
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
  return Promise.all(nodes.map(node => markdownNodeToRichTextNode(node, fallback)));
};

const treeToRichTextDocument = async (
  tree: MarkdownTree,
  fallback: (mdNode: MarkdownNode) => Promise<Block>,
): Promise<Document> => {
  const richNodePromises = markdownNodesToRichTextNodes(tree.children, fallback) as Promise<
    TopLevelBlock[]
  >;
  const richNodes: TopLevelBlock[] = (await richNodePromises) as TopLevelBlock[];
  const filteredNodes = richNodes.filter(Boolean);

  const output: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: filteredNodes,
  };
  return Promise.resolve(output);
};

function expandParagraphWithInlineImages(node: MarkdownNode): MarkdownNode[] {
  if (node.type !== 'paragraph') {
    return [node];
  }
  let imageNodeIndices = [];
  for (let i = 0; i < node.children.length; i++) {
    if (node.children[i].type === 'image') {
      imageNodeIndices.push(i);
    }
  }

  if (imageNodeIndices.length === 0) {
    // If no images in children, return.
    return [node];
  }
  let allNodes: MarkdownNode[] = [];
  let lastIndex = -1;
  for (let j = 0; j < imageNodeIndices.length; j++) {
    const index = imageNodeIndices[j];
    // before
    if (index !== 0) {
      const nodesBefore: MarkdownNode[] = node.children.slice(lastIndex + 1, index);
      let newBeforeParagraph = JSON.parse(JSON.stringify(node));
      newBeforeParagraph.children = nodesBefore;
      if (newBeforeParagraph.children.length > 0) {
        allNodes.push(newBeforeParagraph);
      }
    }
    // image
    const imageNode = node.children[index];
    allNodes.push(imageNode);

    // till end
    let nodesAfter: MarkdownNode[] = [];
    const rangeEnd =
      j + 1 < imageNodeIndices.length ? imageNodeIndices[j + 1] : node.children.length;
    if (index + 1 < rangeEnd && index === imageNodeIndices.slice(-1)[0]) {
      nodesAfter = node.children.slice(index + 1, rangeEnd);
      let newAfterParagraph = JSON.parse(JSON.stringify(node));
      newAfterParagraph.children = nodesAfter;
      if (newAfterParagraph.children.length > 0) {
        allNodes.push(newAfterParagraph);
      }
    }
    lastIndex = index;
  }
  return allNodes;
}

// Inline markdown images come in as nested within a MarkdownNode paragraph, so we must hoist them out
// before transforming to rich text.
function prepareMdAST(ast: MarkdownTree): MarkdownNode {
  function prepareASTNodeChildren(node: MarkdownNode): MarkdownNode {
    if (!node.children) {
      return node;
    }
    const children = node.children;

    let newNode = JSON.parse(JSON.stringify(node));
    const newChildren = children
      .map(expandParagraphWithInlineImages)
      .reduce((a, b) => a.concat(b), []);

    if (newChildren) {
      newNode.children = newChildren.map(prepareASTNodeChildren);
    }
    return newNode;
  }
  const treeNode: MarkdownNode = {
    depth: '0',
    type: 'root',
    value: '',
    ordered: true,
    children: ast.children,
  };
  return prepareASTNodeChildren(treeNode);
}

export async function richTextFromMarkdown(
  md: string,
  fallback: (mdNode: MarkdownNode) => Promise<Block> = n => null,
): Promise<Document> {
  const processor = unified().use(markdown, { commonmark: true });
  const tree = processor.parse(md);
  const newTree = prepareMdAST(tree);
  return await treeToRichTextDocument(newTree as MarkdownTree, fallback);
}
