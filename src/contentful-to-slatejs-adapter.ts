import flatmap from 'lodash.flatmap';
import omit from 'lodash.omit';

import * as Contentful from '@contentful/rich-text-types';
import { ContentfulNode, SlateNode } from './types';
import { getDataOfDefault } from './helpers';
import { SchemaJSON, fromJSON, Schema } from './schema';

export interface ToSlatejsDocumentProperties {
  document: Contentful.Document;
  schema?: SchemaJSON;
}

export default function toSlatejsDocument({
  document,
  schema,
}: ToSlatejsDocumentProperties): Slate.Document {
  return {
    object: 'document',
    data: getDataOfDefault(document.data),
    nodes: flatmap(document.content, node => convertNode(node, fromJSON(schema))) as Slate.Block[],
  };
}

function convertNode(node: ContentfulNode, schema: Schema): SlateNode[] {
  const nodes: SlateNode[] = [];
  switch (node.nodeClass) {
    case 'block':
    case 'inline':
      const contentfulBlock = node as Contentful.Block;
      const childNodes = flatmap(contentfulBlock.content, childNode =>
        convertNode(childNode, schema),
      );

      const slateBlock: Slate.Block = {
        object: contentfulBlock.nodeClass,
        type: contentfulBlock.nodeType,
        nodes: childNodes,
        isVoid: schema.isVoid(contentfulBlock),
        data: getDataOfDefault(contentfulBlock.data),
      };

      nodes.push(slateBlock);
      break;
    case 'text':
      const { marks = [], value, data } = node as Contentful.Text;

      const slateText: Slate.Text = {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text: value,
            marks: marks.map(mark => ({
              ...mark,
              data: {},
              object: 'mark',
            })),
          } as Slate.TextLeaf,
        ],
        data: getDataOfDefault(data),
      };

      nodes.push(slateText);
      break;
    default:
      assertUnreachable(node);
      break;
  }
  return nodes;
}

function assertUnreachable(object: never): never {
  throw new Error(`Unexpected contentful object ${JSON.stringify(object)}`);
}
