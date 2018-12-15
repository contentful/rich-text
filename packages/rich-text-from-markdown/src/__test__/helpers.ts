import {
  TopLevelBlock,
  Document,
  BLOCKS,
  Block,
  Inline,
  Text,
  Mark,
} from '@contentful/rich-text-types';
export interface NodeProps {
  // tslint:disable-next-line:no-any
  data?: Record<string, any>;
}

const defaultProps: NodeProps = { data: {} };

export function document(props: NodeProps = defaultProps, ...content: TopLevelBlock[]): Document {
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content,
    ...props,
  };
}

export function block<T extends Block>(
  nodeType: BLOCKS,
  props: NodeProps = defaultProps,
  ...content: Array<Block | Inline | Text>
): T {
  return {
    nodeType,
    content,
    data: {},
    ...props,
  } as T;
}

export function inline(
  nodeType: string,
  props: NodeProps = defaultProps,
  ...content: Array<Inline | Text>
): Inline {
  return {
    nodeType,
    data: {},
    content,
    ...props,
  } as Inline;
}

export function text(value: string, ...marks: Mark[]): Text {
  return {
    nodeType: 'text',
    data: {},
    marks,
    value: value,
  };
}

export function mark(type: string): Mark {
  return {
    type,
  };
}
