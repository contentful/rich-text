// tslint:disable-next-line: no-any
export type NodeData = Record<string, any>;

export interface Node {
  readonly nodeType: string;
  data: NodeData;
}

export interface Document extends Node {
  nodeType: 'document';
  content: Block[];
}

export interface Block extends Node {
  content: Array<Block | Inline | Text>;
}

export interface Inline extends Node {
  content: Array<Inline | Text>;
}

export interface Text extends Node {
  nodeType: 'text';
  value: string;
  marks: Mark[];
}

export interface Mark {
  type: string;
}
