import { getDataOrDefault } from './helpers';
import get from 'lodash/get';

import { fromJSON, Schema, SchemaJSON } from './schema';
import * as Contentful from '@contentful/rich-text-types';
import {
  ContentfulNode,
  ContentfulElementNode,
  SlateNode,
  SlateElement,
  SlateText,
  SlateMarks,
} from './types';

export interface InlineComment {
  metadata: {
    range: string[];
    originalText: string;
  };
  body: string; // here the body would actually also be rich text since comments are now rich text
  id: string;
}

export interface ToSlatejsDocumentProperties {
  document: Contentful.Document;
  schema?: SchemaJSON;
  comments?: InlineComment[];
}

// should it return something or no because it changes the object anyway
const addCommentsToContentfulDocument = (
  document: Contentful.Document,
  comments: InlineComment[],
): void => {
  // extract the object from the json path
  for (let i = 0; i < comments?.length; i++) {
    // this assumes there is only one element in the json path
    const commentedNode = get(document, comments[i].metadata.range[0]);
    if (commentedNode && commentedNode.data) {
      commentedNode.data = {
        comment: {
          sys: {
            type: 'Link',
            linkType: 'Comment',
            id: comments[i].id,
          },
        },
      };
    }
    console.log('commented node', commentedNode);
  }

  // decorate the object with a new data object
};

export default function toSlatejsDocument({
  document,
  schema,
  comments,
}: ToSlatejsDocumentProperties): SlateNode[] {
  // decorate with comments
  // if (comments) {
  //   addCommentsToContentfulDocument(document, comments);
  // }

  console.log('document now is ', document);

  // TODO:
  // We allow adding data to the root document node, but Slate >v0.5.0
  // has no concept of a root document node. We should determine whether
  // this will be a compatibility problem for existing users.
  return document.content.flatMap((node) => convertNode(node, fromJSON(schema)));
}

function convertNode(node: ContentfulNode, schema: Schema): SlateNode {
  if (node.nodeType === 'text') {
    return convertTextNode(node as Contentful.Text);
  } else {
    const contentfulNode = node as ContentfulElementNode;
    const childNodes = contentfulNode.content.flatMap((childNode) =>
      convertNode(childNode, schema),
    );
    const slateNode = convertElementNode(contentfulNode, childNodes, schema);
    return slateNode;
  }
}

function convertElementNode(
  contentfulBlock: ContentfulElementNode,
  slateChildren: SlateNode[],
  schema: Schema,
): SlateElement {
  const children =
    slateChildren.length === 0 && schema.isTextContainer(contentfulBlock.nodeType)
      ? [{ text: '', data: {} }]
      : slateChildren;
  return {
    type: contentfulBlock.nodeType,
    children,
    isVoid: schema.isVoid(contentfulBlock),
    data: getDataOrDefault(contentfulBlock.data),
  };
}

function convertTextNode(node: Contentful.Text): SlateText {
  return {
    text: node.value,
    data: getDataOrDefault(node.data),
    ...convertTextMarks(node),
  };
}

function convertTextMarks(node: Contentful.Text): SlateMarks {
  const marks: SlateMarks = {};
  for (const mark of node.marks) {
    marks[mark.type as keyof SlateMarks] = true;
  }
  return marks;
}
