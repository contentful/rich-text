import BLOCKS from './blocks';
import INLINES from './inlines';
import { TopLevelBlockEnum } from './schemaConstraints';

/**
 * @additionalProperties true
 */
export type NodeData = Record<string, any>; // tslint:disable-line:no-any
export interface Node {
  readonly nodeType: string;

  data: NodeData;
}

export interface Block extends Node {
  nodeType: BLOCKS;
  content: Array<Block | Inline | Text>;
}

export interface Inline extends Node {
  nodeType: INLINES;
  content: Array<Inline | Text>;
}

export interface TopLevelBlock extends Block {
  nodeType: TopLevelBlockEnum;
}

export interface Document extends Node {
  nodeType: BLOCKS.DOCUMENT;
  content: TopLevelBlock[];
}

export interface Text extends Node {
  nodeType: 'text';
  value: string;
  marks: Mark[];
}

export interface Mark {
  type: string;
}
