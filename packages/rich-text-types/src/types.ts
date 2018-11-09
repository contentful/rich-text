// tslint:disable-next-line: no-any
export type NodeData = Record<string, any>;
const t: string = '1';

export interface Node {
  readonly nodeType: string;
  data: NodeData;
}

export interface Block extends Node {
  content: Array<Block | Inline | Text>;
}

export interface Inline extends Node {
  content: Array<Inline | Text>;
}

export interface Document extends Node {
  nodeType: 'document';
  data: NodeData;
  content: Block[];
}

export interface Text extends Node {
  value: string;
  marks: Mark[];
}

export interface Mark {
  type: string;
}
