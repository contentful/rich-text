import flatmap from 'lodash.flatmap';
import omit from 'lodash.omit';

import * as Contentful from '@contentful/rich-text-types';
import { ContentfulNode, SlateNode, ContentfulNonTextNodes } from './types';
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

  if (node.nodeType === 'text') {
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
  } else {
    const contentfulBlock = node as ContentfulNonTextNodes;
    const childNodes = flatmap(contentfulBlock.content, childNode =>
      convertNode(childNode, schema),
    );

    const object = getSlateNodeObjectValue(contentfulBlock.nodeType);
    let slateBlock: SlateNode;
    if (object === 'inline') {
      slateBlock = {
        object: 'inline',
        type: contentfulBlock.nodeType,
        nodes: childNodes,
        isVoid: schema.isVoid(contentfulBlock),
        data: getDataOfDefault(contentfulBlock.data),
      } as Slate.Inline;
    } else {
      slateBlock = {
        object: 'block',
        type: contentfulBlock.nodeType,
        nodes: childNodes,
        isVoid: schema.isVoid(contentfulBlock),
        data: getDataOfDefault(contentfulBlock.data),
      } as Slate.Block;
    }

    nodes.push(slateBlock);
  }
  return nodes;
}

function getSlateNodeObjectValue(nodeType: string): 'inline' | 'block' {
  if (Object.values(Contentful.BLOCKS).includes(nodeType)) {
    return 'block';
  } else if (Object.values(Contentful.INLINES).includes(nodeType)) {
    return 'inline';
  } else {
    throw new Error(`Unexpected contentful nodeType '${nodeType}'`);
  }
}
