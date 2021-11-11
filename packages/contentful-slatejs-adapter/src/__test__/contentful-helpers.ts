import {
  BLOCKS,
  INLINES,
  Document,
  Block,
  Inline,
  Text,
  Mark,
  TopLevelBlock,
  TopLevelBlockEnum,
} from '@contentful/rich-text-types';

export interface NodeProps {
  isVoid?: boolean;
  data?: Record<string, any>;
}

export function document(...content: TopLevelBlock[]): Document {
  return {
    data: {},
    nodeType: BLOCKS.DOCUMENT,
    content,
  };
}

export function block(
  nodeType: TopLevelBlockEnum,
  ...content: Array<Block | Inline | Text>
): TopLevelBlock;
export function block(nodeType: BLOCKS, ...content: Array<Block | Inline | Text>): Block;
export function block(nodeType: BLOCKS, ...content: Array<Block | Inline | Text>): Block {
  return {
    nodeType,
    content,
    data: {},
  };
}

export function inline(nodeType: INLINES, ...content: Array<Inline | Text>): Inline {
  return {
    nodeType,
    content,
    data: {},
  };
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
