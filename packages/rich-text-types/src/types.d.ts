export declare type NodeData = Record<string, any>;
export interface Node {
  readonly nodeType: string;
  data: NodeData;
}
export interface Document extends Node {
  nodeType: 'document';
  nodeClass: 'block';
  content: Block[];
}
export interface Block extends Node {
  nodeClass: 'block';
  content: Array<Block | Inline | Text>;
}
export interface Inline extends Node {
  nodeClass: 'inline';
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
