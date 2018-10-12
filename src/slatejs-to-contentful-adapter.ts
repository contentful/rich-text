import flatMap from 'lodash.flatmap';
import * as Contentful from '@contentful/structured-text-types';
import { ContentfulNode, SlateNode } from './types';
import { getDataOfDefault } from './helpers';
import { SchemaJSON, Schema, fromJSON } from './schema';

export interface ToContentfulDocumentProperties {
  document: Slate.Document;
  schema?: SchemaJSON;
}

export default function toContentfulDocument({
  document,
  schema,
}: ToContentfulDocumentProperties): Contentful.Document {
  return {
    nodeClass: 'document',
    nodeType: Contentful.BLOCKS.DOCUMENT,
    data: getDataOfDefault(document.data),
    content: flatMap(
      document.nodes,
      node => convertNode(node, fromJSON(schema)) as Contentful.Block[],
    ),
  };
}

function convertNode(node: SlateNode, schema: Schema): ContentfulNode[] {
  const nodes: ContentfulNode[] = [];
  switch (node.object) {
    case 'block':
    case 'inline':
      const slateNode = node as Slate.Block;
      const content = flatMap(slateNode.nodes, childNode => convertNode(childNode, schema));
      const contentfulBlock: Contentful.Block = {
        nodeClass: slateNode.object,
        nodeType: slateNode.type,
        content: [],
        data: getDataOfDefault(slateNode.data),
      };

      if (!schema.isVoid(contentfulBlock)) {
        contentfulBlock.content = content;
      }
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
  return node.leaves.map<Contentful.Text>(leaf => ({
    nodeClass: 'text',
    nodeType: 'text',
    value: leaf.text,
    marks: leaf.marks ? leaf.marks.map(mark => ({ type: mark.type })) : [],
    data: getDataOfDefault(node.data),
  }));
}

function assertUnreachable(object: never): never {
  throw new Error(`Unexpected slate object ${object}`);
}
