import * as Contentful from '@contentful/structured-text-types';

export interface NodeProps {
  isVoid?: boolean;
  data?: Record<string, any>;
}

export function document(...content: Contentful.Block[]): Contentful.Document {
  return {
    nodeClass: 'document',
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
    nodeClass: 'block',
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
    nodeClass: 'inline',
    nodeType,
    content,
    data: {},
  };
}

export function text(value: string, ...marks: Contentful.Mark[]): Contentful.Text {
  return {
    nodeClass: 'text',
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
