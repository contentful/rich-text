export interface MarkdownNode extends MarkdownTree {
  depth: string;
  type: string;
  ordered: Boolean;
  value: string;
}

export interface MarkdownTree {
  children: MarkdownNode[];
}

export interface MarkdownLinkNode extends MarkdownNode {
  url: string;
}
