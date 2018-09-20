export function document(...nodes: Slate.Block[]): Slate.Document {
  return {
    object: 'document',
    nodes,
  };
}

export function block(
  type: string,
  isVoid: false,
  ...nodes: Array<Slate.Block | Slate.Inline | Slate.Text>
): Slate.Block {
  return {
    object: 'block',
    isVoid,
    type,
    nodes,
  };
}

export function inline(
  type: string,
  isVoid: false,
  ...nodes: Array<Slate.Inline | Slate.Text>
): Slate.Inline {
  return {
    object: 'inline',
    isVoid,
    type,
    nodes,
  };
}

export function text(...leaves: Slate.TextLeaf[]): Slate.Text {
  return {
    object: 'text',
    leaves,
  };
}

export function leaf(value: string, ...marks: Slate.Mark[]): Slate.TextLeaf {
  return {
    object: 'leaf',
    text: value,
    marks,
  };
}

export function mark(type: string): Slate.Mark {
  return {
    type,
  };
}
