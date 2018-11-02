import { Document, Block, Inline, Text } from '../types';
import faker from 'faker';

describe('Document', () => {
  it('empty Document', () => {
    const document: Document = {
      nodeType: 'document',
      data: {},
      content: [],
    };
  });

  it('Document with blocks', () => {
    const document: Document = {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: faker.name.title(),
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
      data: {},
      content: [],
    };
  });

  it('Block with block', () => {
    const block: Block = {
      nodeType: 'paragraph',
      data: {},
      content: [
        {
          nodeType: faker.name.title(),
          data: {},
          content: [],
        },
      ],
    };
  });

  it('Block with text', () => {
    const block: Block = {
      nodeType: 'paragraph',
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
      data: {},
      content: [],
    };
  });

  it('Inline with inline', () => {
    const inline: Inline = {
      nodeType: 'hyperlink',
      data: {},
      content: [
        {
          nodeType: faker.name.title(),
          data: {},
          content: [],
        },
      ],
    };
  });

  it('Inline with text', () => {
    const inline: Inline = {
      nodeType: faker.name.title(),
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
