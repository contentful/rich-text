declare module 'unified' {
  interface MarkdownNode {
    depth: string;
    type: string;
    ordered: Boolean;
    children: Array<MarkdownNode>;
    content: Array<MarkdownNode>;
    value: string;
  }

  interface MarkdownTree {
    children: MarkdownNode[];
  }

  interface Processor {
    parse(md: string): MarkdownTree;
  }

  export default function(): { use(md: Object, config: Object): Processor };
}

declare module 'remark-parse' {
  export default function(one: Object, two: Object): void;
}
