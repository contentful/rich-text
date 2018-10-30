import { Document, Block, Inline, Text } from '../types';
import faker from 'faker';

describe('Document', () => {
  it('empty Document', () => {
    const document: Document = {
      nodeType: 'document',
      nodeClass: 'block',
      data: {},
      content: [],
    };
  });

  it('Document with blocks', () => {
    const document: Document = {
      nodeType: 'document',
      nodeClass: 'block',
      data: {},
      content: [
        {
          nodeType: faker.name.title(),
          nodeClass: 'block',
          data: {},
          content: [],
        },
      ],
    };
  });
});

describe('Block', () => {
  it('empty Block', () => {
    const block: Block = {
      nodeType: 'paragraph',
      nodeClass: 'block',
      data: {},
      content: [],
    };
  });

  it('Block with block', () => {
    const block: Block = {
      nodeType: 'paragraph',
      nodeClass: 'block',
      data: {},
      content: [
        {
          nodeType: faker.name.title(),
          nodeClass: 'block',
          data: {},
          content: [],
        },
      ],
    };
  });

  it('Block with text', () => {
    const block: Block = {
      nodeType: 'paragraph',
      nodeClass: 'block',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'hi',
          data: {},
          marks: [],
        },
      ],
    };
  });
});

describe('Inline', () => {
  it('empty Inline', () => {
    const inline: Inline = {
      nodeType: 'hyperlink',
      nodeClass: 'inline',
      data: {},
      content: [],
    };
  });

  it('Inline with inline', () => {
    const inline: Inline = {
      nodeType: 'hyperlink',
      nodeClass: 'inline',
      data: {},
      content: [
        {
          nodeType: faker.name.title(),
          nodeClass: 'inline',
          data: {},
          content: [],
        },
      ],
    };
  });

  it('Inline with text', () => {
    const inline: Inline = {
      nodeType: faker.name.title(),
      nodeClass: 'inline',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'hi',
          data: {},
          marks: [],
        },
      ],
    };
  });
});

describe('text', () => {
  it('instantiates text', () => {
    const text: Text = {
      nodeType: 'text',
      value: '',
      data: {},
      marks: [],
    };
  });

  it('instantiates text with marks', () => {
    const textWithMarks: Text = {
      nodeType: 'text',
      data: {},
      value: '',
      marks: [{ type: 'bold' }],
    };
  });
});
