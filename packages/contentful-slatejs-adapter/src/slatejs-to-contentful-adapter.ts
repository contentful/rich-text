import flatMap from 'lodash.flatmap';
import { getDataOrDefault } from './helpers';
import { SchemaJSON, Schema, fromJSON } from './schema';

import * as Contentful from '@contentful/rich-text-types';
import {
  ContentfulNode,
  ContentfulElementNode,
  SlateNode,
  SlateElement,
  SlateText,
  SlateMarks,
} from './types';

export interface ToContentfulDocumentProperties {
  document: SlateNode[];
  schema?: SchemaJSON;
}

export default function toContentfulDocument({
  document,
  schema,
}: ToContentfulDocumentProperties): Contentful.Document {
  // TODO:
  // We allow adding data to the root document node, but Slate >v0.5.0
  // has no concept of a root document node. We should determine whether
  // this will be a compatibility problem for existing users.
  return {
    nodeType: Contentful.BLOCKS.DOCUMENT,
    data: {},
    content: flatMap(
      document,
      node => convertNode(node, fromJSON(schema)) as Contentful.TopLevelBlock[],
    ),
  };
}

function convertNode(node: SlateNode, schema: Schema): ContentfulNode[] {
  const nodes: ContentfulNode[] = [];
  if (isSlateElement(node)) {
    const contentfulElement: ContentfulElementNode = {
      nodeType: node.type as Contentful.BLOCKS,
      data: getDataOrDefault(node.data),
      content: [],
    };
    if (!schema.isVoid(contentfulElement)) {
      contentfulElement.content = flatMap(node.children, childNode =>
        convertNode(childNode, schema),
      );
    }
    if (contentfulElement.content.length === 0 && schema.isTextContainer(node.type)) {
      contentfulElement.content.push(convertText({ text: '', data: {} }));
    }
    nodes.push(contentfulElement);
  } else {
    const contentfulText = convertText(node);
    nodes.push(contentfulText);
  }
  return nodes;
}

function convertText(node: SlateText): Contentful.Text {
  const { text, data, ...marks } = node;
  return {
    nodeType: 'text',
    value: node.text,
    marks: getMarkList(marks),
    data: getDataOrDefault(node.data),
  };
}

function getMarkList(marks: SlateMarks): Contentful.Mark[] {
  const contentfulMarks: Contentful.Mark[] = [];
  for (const mark of Object.keys(marks)) {
    contentfulMarks.push({ type: mark });
  }
  return contentfulMarks;
}

function isSlateElement(node: SlateNode): node is SlateElement {
  return 'type' in node;
}
