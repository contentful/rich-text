import _ from 'lodash';
import unified from 'unified';
import markdown from 'remark-parse';
import {
  Document,
  Node,
  Block,
  BLOCKS,
  TopLevelBlock,
  INLINES,
  Hyperlink,
  Text,
  Inline,
} from '@contentful/rich-text-types';
import { MarkdownNode, MarkdownLinkNode, MarkdownTree } from './types';

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

const nodeTypeFor = (node: MarkdownNode) => {
  const nodeType = markdownNodeTypes.get(node.type);

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

async function mdToRichTextNode(node: MarkdownNode, fallback: FallbackResolver): Promise<Node> {
  const nodeType = nodeTypeFor(node);

  if (isLink(node)) {
    const content = (await mdToRichTextNodes(node.children, fallback)) as Text[];

    const hyperlink: Hyperlink = {
      nodeType: INLINES.HYPERLINK,
      data: { uri: node.url },
      content,
    };

    return hyperlink;
  }
  if (isBlock(nodeType) || isInline(nodeType)) {
    const content = await mdToRichTextNodes(node.children, fallback);

    return {
      nodeType: nodeType,
      content,
      data: {},
    } as Block | Inline;
  } else if (isText(nodeType)) {
    let marks = [];
    let nodeValue = node.value;
    if (node.type !== 'text') {
      // TODO: this implementation needs to handle arbitrarily nested marks
      // for example: **_Hello_, world!**
      // this a markdown node here that's why we use children
      nodeValue = node.children ? node.children[0].value : node.value;

      const markType = markTypeFor(node);
      if (markType) {
        marks.push({
          type: markTypeFor(node),
        });
      }
    }
    return {
      nodeType: nodeType,
      value: nodeValue,
      marks: marks,
      data: {},
    } as Text;
  }
  return fallback(node);
}

async function mdToRichTextNodes(
  nodes: MarkdownNode[],
  fallback: FallbackResolver,
): Promise<Node[]> {
  if (!nodes) {
    return Promise.resolve([]);
  }
  const rtNodes = await Promise.all(nodes.map(node => mdToRichTextNode(node, fallback)));

  return rtNodes.filter(Boolean);
}

const astToRichTextDocument = async (
  tree: MarkdownTree,
  fallback: FallbackResolver,
): Promise<Document> => {
  const content = await mdToRichTextNodes(tree.children, fallback);
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: content as TopLevelBlock[],
  };
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
  const allNodes: MarkdownNode[] = [];
  let lastIndex = -1;
  for (let j = 0; j < imageNodeIndices.length; j++) {
    const index = imageNodeIndices[j];
    // before
    if (index !== 0) {
      const nodesBefore: MarkdownNode[] = node.children.slice(lastIndex + 1, index);

      if (nodesBefore.length > 0) {
        allNodes.push({
          ...node,
          children: nodesBefore,
        });
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

      if (nodesAfter.length > 0) {
        allNodes.push({
          ...node,
          children: nodesAfter,
        });
      }
    }
    lastIndex = index;
  }
  return allNodes;
}

// Inline markdown images come in as nested within a MarkdownNode paragraph
// so we must hoist them out before transforming to rich text.
function prepareMdAST(ast: MarkdownTree): MarkdownNode {
  function prepareASTNodeChildren(node: MarkdownNode): MarkdownNode {
    if (!node.children) {
      return node;
    }

    const children = _.flatMap(node.children, n => expandParagraphWithInlineImages(n)).map(n =>
      prepareASTNodeChildren(n),
    );

    return { ...node, children };
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

export type FallbackResolver = (mdNode: MarkdownNode) => Promise<Node>;

export async function richTextFromMarkdown(
  md: string,
  fallback: FallbackResolver = () => Promise.resolve(null),
): Promise<Document> {
  const processor = unified().use(markdown, { commonmark: true });
  const tree = processor.parse(md);
  const ast = prepareMdAST(tree);
  return await astToRichTextDocument(ast, fallback);
}
