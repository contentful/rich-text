export function document(...nodes: Slate.Block[]): Slate.Document {
  return {
    object: 'document',
    data: {},
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
    data: {},
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
    data: {},
    type,
    nodes,
  };
}

export function text(...leaves: Slate.TextLeaf[]): Slate.Text {
  return {
    object: 'text',
    data: {},
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

export function mark(type: string, data?: Record<string, any>): Slate.Mark {
  return {
    type,
    data: data || {},
    object: 'mark',
  };
}
