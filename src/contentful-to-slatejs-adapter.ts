import flatmap from 'lodash.flatmap';
import omit from 'lodash.omit';
import get from 'lodash.get';
import * as Contentful from '@contentful/structured-text-types';
import { ContentfulNode, SlateNode } from './types';

export interface SchemaValue {
  isVoid?: boolean;
  // tslint:disable-next-line:no-any
  [k: string]: any;
}
export interface Schema {
  blocks?: Record<string, SchemaValue>;
  inlines?: Record<string, SchemaValue>;
}
export interface ToSlatejsDocumentProperties {
  document: Contentful.Document;
  schema?: Schema;
}

export default function toSlatejsDocument({
  document,
  schema = {},
}: ToSlatejsDocumentProperties): Slate.Document {
  return {
    object: 'document',
    nodes: flatmap(document.content, node => convertNode(node, schema)) as Slate.Block[],
  };
}

// COMPAT: fixes the issue with void inline blocks in slate < v0.40
function getIsVoidValue(node: Contentful.Block | Contentful.Inline, schema: Schema) {
  const root = node.nodeClass === 'block' ? 'blocks' : 'inlines';
  return get(schema, [root, node.nodeType as string, 'isVoid'], false);
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
        isVoid: getIsVoidValue(contentfulBlock, schema),
        data: contentfulBlock.data,
      };

      nodes.push(slateBlock);
      break;
    case 'text':
      const { marks, value, data } = node as Contentful.Text;

      const slateText: Slate.Text = {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text: value,
            marks,
          },
        ],
        data,
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
