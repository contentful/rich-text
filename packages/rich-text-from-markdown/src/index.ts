import _ from 'lodash';
import unified from 'unified';
import markdown from 'remark-parse';
import gfm from 'remark-gfm';
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
  ['table', BLOCKS.TABLE],
  ['tableRow', BLOCKS.TABLE_ROW],
  ['tableCell', BLOCKS.TABLE_CELL],
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

const markTypes = new Map([
  ['emphasis', 'italic'],
  ['strong', 'bold'],
  ['inlineCode', 'code'],
]);
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
  [BLOCKS.TABLE, 'block'],
  [BLOCKS.TABLE_CELL, 'block'],
  [BLOCKS.TABLE_HEADER_CELL, 'block'],
  [BLOCKS.TABLE_ROW, 'block'],
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

const isTableCell = (nodeType: string) => {
  return nodeType === BLOCKS.TABLE_CELL;
};

const buildHyperlink = async (
  node: MarkdownLinkNode,
  fallback: FallbackResolver,
  appliedMarksTypes: string[],
): Promise<Hyperlink[]> => {
  const content = (await mdToRichTextNodes(node.children, fallback, appliedMarksTypes)) as Text[];

  const hyperlink: Hyperlink = {
    nodeType: INLINES.HYPERLINK,
    data: { uri: node.url },
    content,
  };

  return [hyperlink];
};

const buildGenericBlockOrInline = async (
  node: MarkdownNode,
  fallback: FallbackResolver,
  appliedMarksTypes: string[],
): Promise<Array<Block | Inline>> => {
  const nodeType = nodeTypeFor(node);
  const content = await mdToRichTextNodes(node.children, fallback, appliedMarksTypes);

  return [
    {
      nodeType: nodeType,
      content,
      data: {},
    } as Block | Inline,
  ];
};

const buildTableCell = async (
  node: MarkdownNode,
  fallback: FallbackResolver,
  appliedMarksTypes: string[],
): Promise<Array<Block>> => {
  const nodeChildren = await mdToRichTextNodes(node.children, fallback, appliedMarksTypes);

  const content = nodeChildren.reduce((result, contentNode) => {
    if (isText(contentNode.nodeType) || isInline(contentNode.nodeType)) {
      const lastNode = result[result.length - 1];
      if (lastNode && lastNode.nodeType === BLOCKS.PARAGRAPH) {
        lastNode.content.push(contentNode);
      } else {
        result.push({ nodeType: BLOCKS.PARAGRAPH, data: {}, content: [contentNode] });
      }
    } else {
      result.push(contentNode);
    }

    return result;
  }, []);

  // A table cell can't be empty
  if (content.length === 0) {
    content.push({
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          data: {},
          marks: [],
          value: '',
        } as Text,
      ],
    });
  }

  /**
   * We should only support texts inside table cells.
   * Some markdowns might contain html inside tables such as <ul>, <blockquote>, etc
   * but they are pretty much filtered out by markdownNodeTypes and nodeContainerTypes variables.
   * so we ended up receiving only `text` nodes.
   * We can't have table cells with text nodes directly, we must wrap text nodes inside paragraphs.
   */
  return [
    {
      nodeType: BLOCKS.TABLE_CELL,
      content,
      data: {},
    } as Block,
  ];
};

const buildText = async (
  node: MarkdownNode,
  fallback: FallbackResolver,
  appliedMarksTypes: string[],
): Promise<Array<Inline | Text>> => {
  const nodeType = nodeTypeFor(node);
  const markType = markTypeFor(node);
  const marks = [...appliedMarksTypes];
  if (markType) {
    marks.push(markType);
  }

  if (node.type !== 'text' && node.children) {
    return (await mdToRichTextNodes(node.children, fallback, marks)) as Array<Inline | Text>;
  }

  if (node.value) {
    return [
      {
        nodeType: nodeType,
        value: node.value,
        marks: marks.map((type) => ({ type })),
        data: {},
      } as Text,
    ];
  }
};

const buildFallbackNode = async (
  node: MarkdownNode,
  fallback: FallbackResolver,
): Promise<Node[]> => {
  const fallbackResult = await fallback(node);

  if (_.isArray(fallbackResult)) {
    return fallbackResult;
  }
  return [fallbackResult];
};

async function mdToRichTextNode(
  node: MarkdownNode,
  fallback: FallbackResolver,
  appliedMarksTypes: string[] = [],
): Promise<Node[]> {
  // By default <br/> is parsed as html node, causing it to be stripped out.
  // We need to convert it manually in order to support it
  if (node.type === 'html' && /<br\s?\/?>/gi.test(node.value)) {
    node.value = '\n';
    node.type = 'text';
  }

  const nodeType = nodeTypeFor(node);

  if (isLink(node)) {
    return await buildHyperlink(node, fallback, appliedMarksTypes);
  }

  if (isTableCell(nodeType)) {
    return await buildTableCell(node, fallback, appliedMarksTypes);
  }

  if (isBlock(nodeType) || isInline(nodeType)) {
    return await buildGenericBlockOrInline(node, fallback, appliedMarksTypes);
  }

  if (isText(nodeType)) {
    return await buildText(node, fallback, appliedMarksTypes);
  }

  return await buildFallbackNode(node, fallback);
}

async function mdToRichTextNodes(
  nodes: MarkdownNode[],
  fallback: FallbackResolver,
  appliedMarksTypes: string[] = [],
): Promise<Node[]> {
  if (!nodes) {
    return Promise.resolve([]);
  }
  const rtNodes = await Promise.all(
    nodes.map((node) => mdToRichTextNode(node, fallback, appliedMarksTypes)),
  );

  return _.flatten(rtNodes).filter(Boolean);
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

    const children = _.flatMap(node.children, (n) => expandParagraphWithInlineImages(n)).map((n) =>
      prepareASTNodeChildren(n),
    );

    return { ...node, children };
  }

  return prepareASTNodeChildren({
    depth: '0',
    type: 'root',
    value: '',
    ordered: true,
    children: ast.children,
  });
}

// COMPAT: can resolve with either Node or an array of Nodes for back compatibility.
export type FallbackResolver = (mdNode: MarkdownNode) => Promise<Node | Node[] | null>;

export async function richTextFromMarkdown(
  md: string,
  fallback: FallbackResolver = () => Promise.resolve(null),
): Promise<Document> {
  const processor = unified().use(markdown).use(gfm);
  const tree = processor.parse(md);
  // @ts-expect-error children is missing in the return type of processor.parse
  const ast = prepareMdAST(tree);
  return await astToRichTextDocument(ast, fallback);
}
