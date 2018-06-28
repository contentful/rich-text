export function document(...nodes: Slate.Block[]): Slate.Document {
  return {
    object: 'document',
    nodes,
  };
}

export function block(
  type: string,
  ...nodes: Array<Slate.Block | Slate.Inline | Slate.Text>
): Slate.Block {
  return {
    object: 'block',
    type,
    nodes,
  };
}

export function inline(type: string, ...nodes: Array<Slate.Inline | Slate.Text>): Slate.Inline {
  return {
    object: 'inline',
    type,
    nodes,
  };
}

export function text(...leaves: Slate.TextLeave[]): Slate.Text {
  return {
    object: 'text',
    leaves,
  };
}

export function leaf(value: string, ...marks: Slate.Mark[]): Slate.TextLeave {
  return {
    text: value,
    marks,
  };
}

export function mark(type: string): Slate.Mark {
  return {
    type,
  };
}
