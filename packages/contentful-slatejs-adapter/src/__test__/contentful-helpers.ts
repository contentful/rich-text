import * as Contentful from '@contentful/rich-text-types';

export interface NodeProps {
  isVoid?: boolean;
  data?: Record<string, any>;
}

export function document(...content: Contentful.Block[]): Contentful.Document {
  return {
    data: {},
    nodeType: Contentful.BLOCKS.DOCUMENT,
    content,
  };
}

export function block(
  nodeType: string,
  ...content: Array<Contentful.Block | Contentful.Inline | Contentful.Text>
): Contentful.Block {
  return {
    nodeType,
    content,
    data: {},
  };
}

export function inline(
  nodeType: string,
  ...content: Array<Contentful.Inline | Contentful.Text>
): Contentful.Inline {
  return {
    nodeType,
    content,
    data: {},
  };
}

export function text(value: string, ...marks: Contentful.Mark[]): Contentful.Text {
  return {
    nodeType: 'text',
    data: {},
    marks,
    value: value,
  };
}

export function mark(type: string): Contentful.Mark {
  return {
    type,
  };
}
