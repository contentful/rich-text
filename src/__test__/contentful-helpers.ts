import * as Contentful from '@contentful/structured-text-types';

export function document(...content: Contentful.Block[]): Contentful.Document {
  return {
    nodeClass: 'document',
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
  };
}

export function text(value: string, ...marks: Contentful.Mark[]): Contentful.Text {
  return {
    nodeClass: 'text',
    nodeType: 'text',
    marks,
    value: value,
  };
}

export function mark(type: string): Contentful.Mark {
  return {
    type,
  };
}
