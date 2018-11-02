import { Node, Block, Inline, Text } from './types';
import BLOCKS from './blocks';
import INLINES from './inlines';

/**
 * Checks if the node is an instance of Inline.
 */
export function isInline(node: Node): node is Inline {
  return Object.values(INLINES).includes(node.nodeType);
}

/**
 * Checks if the node is an instance of Block.
 */
export function isBlock(node: Node): node is Block {
  return Object.values(BLOCKS).includes(node.nodeType);
}

/**
 * Checks if the node is an instance of Text.
 */
export function isText(node: Node): node is Text {
  return node.nodeType === 'text';
}
