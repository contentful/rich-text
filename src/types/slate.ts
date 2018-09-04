namespace Slate {
  export interface Node {
    object: 'document' | 'block' | 'inline' | 'text';
    type?: string;
    data?: object;
  }

  export interface Document extends Node {
    object: 'document';
    nodes: Block[];
  }

  export interface Block extends Node {
    object: 'block';

    nodes: Array<Block | Inline | Text>;
  }

  export interface Inline extends Node {
    object: 'inline';
    nodes: Array<Inline | Text>;
  }

  export interface Text extends Node {
    object: 'text';
    leaves: TextLeaf[];
  }

  export interface Mark {
    type: string;
  }

  export interface TextLeaf {
    object: 'leaf';
    text: string;
    marks?: Mark[];
  }
}
