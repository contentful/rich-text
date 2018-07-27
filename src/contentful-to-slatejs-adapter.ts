import flatmap from 'lodash.flatmap';
import omit from 'lodash.omit';
import * as Contentful from '@contentful/structured-text-types';
import { ContentfulNode, SlateNode } from './types';

export default function toSlatejsDocument(ctfDocument: Contentful.Document): Slate.Document {
  return {
    object: 'document',
    nodes: flatmap(ctfDocument.content, node => convertNode(node)) as Slate.Block[],
  };
}

function convertNode(node: ContentfulNode): SlateNode[] {
  const nodes: SlateNode[] = [];
  switch (node.nodeClass) {
    case 'block':
    case 'inline':
      const contentfulBlock = node as Contentful.Block;
      const childNodes = flatmap(contentfulBlock.content, convertNode);

      const slateBlock: Slate.Block = {
        object: contentfulBlock.nodeClass,
        type: contentfulBlock.nodeType,
        nodes: childNodes,
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
