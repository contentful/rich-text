import flatMap from 'lodash.flatmap';
import * as Contentful from '@contentful/structured-text-types';
import { ContentfulNode, SlateNode } from './types';

export default function toContentfulDocument(slateDocument: Slate.Document): Contentful.Document {
  return {
    nodeClass: 'document',
    nodeType: Contentful.BLOCKS.DOCUMENT,
    content: flatMap(slateDocument.nodes, convertNode) as Contentful.Block[],
  };
}

function convertNode(node: SlateNode): ContentfulNode[] {
  const nodes: ContentfulNode[] = [];
  switch (node.object) {
    case 'block':
    case 'inline':
      const slateBlock = node as Slate.Block;
      const content = flatMap(slateBlock.nodes, convertNode);
      const contentfulBlock: Contentful.Block = {
        nodeClass: slateBlock.object,
        nodeType: slateBlock.type,
        content,
        data: slateBlock.data,
      };
      nodes.push(contentfulBlock);
      break;
    case 'text':
      convertText(node as Slate.Text).forEach(childNode => nodes.push(childNode));
      break;
    default:
      assertUnreachable(node);
      break;
  }

  return nodes;
}

function convertText(node: Slate.Text): Contentful.Text[] {
  return node.leaves.map<Contentful.Text>(leave => ({
    nodeClass: 'text',
    nodeType: 'text',
    value: leave.text,
    marks: leave.marks || [],
    data: node.data,
  }));
}

function assertUnreachable(object: never): never {
  throw new Error(`Unexpected slate object ${object}`);
}
