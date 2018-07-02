import flatmap from 'lodash.flatmap';
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
      const slateBlock = {
        object: contentfulBlock.category,
        type: contentfulBlock.type,
        nodes: childNodes,
      } as Slate.Block;
      nodes.push(slateBlock);
      break;
    case 'text':
      const { marks, value } = node as Contentful.Text;
      const slateText: Slate.Text = {
        object: 'text',
        leaves: [
          {
            text: value,
            marks,
          },
        ],
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
  throw new Error(`Unexpected contentful object ${object}`);
}
