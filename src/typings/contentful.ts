namespace Contentful {
  export interface Node {
    category: 'document' | 'block' | 'inline' | 'text';
    type?: string;
  }

  export interface Document extends Node {
    category: 'document';
    content: Block[];
  }

  export interface Block extends Node {
    category: 'block';
    content: Array<Block | Inline | Text>;
  }

  export interface Inline extends Node {
    category: 'inline';
    content: Array<Inline | Text>;
  }

  export interface Text extends Node {
    category: 'text';
    type: 'text';
    value: string;
    marks: Mark[];
  }

  export interface Mark {
    type: string;
  }
}
