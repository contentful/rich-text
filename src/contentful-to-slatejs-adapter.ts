import flatmap from 'lodash.flatmap';
import omit from 'lodash.omit';
import * as Contentful from '@contentful/structured-text-types';

export default function toSlatejsDocument(ctfDocument: Contentful.Document): Slate.Document {
  return {
    object: 'document',
    nodes: flatmap(ctfDocument.content, node => convertNode(node)) as Slate.Block[],
  };
}

function convertNode(node: Contentful.Block | Contentful.Inline | Contentful.Text): Slate.Node[] {
  const nodes: Slate.Node[] = [];
  switch (node.category) {
    case 'block':
    case 'inline':
      const contentfulBlock = node as Contentful.Block;
      const childNodes = flatmap(contentfulBlock.content, convertNode);
      const data = omit(contentfulBlock, ['category', 'type', 'content']);
      const slateBlock = {
        object: contentfulBlock.category,
        type: contentfulBlock.type,
        nodes: childNodes,
      } as Slate.Block;
      if (Object.keys(data).length > 0) {
        slateBlock.data = data;
      }
      nodes.push(slateBlock);
      break;
    case 'text':
      const { marks, value } = node as Contentful.Text;
      const textData = omit(node, ['category', 'type', 'value', 'marks']);
      const slateText: Slate.Text = {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text: value,
            marks,
          },
        ],
      };
      if (Object.keys(textData).length > 0) {
        slateText.data = textData;
      }
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
