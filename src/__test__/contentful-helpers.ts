import * as Contentful from '@contentful/structured-text-types';

export function document(...content: Contentful.Block[]): Contentful.Document {
  return {
    category: 'document',
    type: Contentful.BLOCKS.DOCUMENT,
    content,
  };
}

export function block(
  type: string,
  ...content: Array<Contentful.Block | Contentful.Inline | Contentful.Text>
): Contentful.Block {
  return {
    category: 'block',
    type,
    content,
  };
}

export function inline(
  type: string,
  ...content: Array<Contentful.Inline | Contentful.Text>
): Contentful.Inline {
  return {
    category: 'inline',
    type,
    content,
  };
}

export function text(value: string, ...marks: Contentful.Mark[]): Contentful.Text {
  return {
    category: 'text',
    type: 'text',
    marks,
    value: value,
  };
}

export function mark(type: string): Contentful.Mark {
  return {
    type,
  };
}
