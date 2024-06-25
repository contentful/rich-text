import { faker } from '@faker-js/faker';
import { BLOCKS, INLINES } from '..';
import { TopLevelBlockEnum } from '../schemaConstraints';
import { Block, Document, Inline, Text } from '../types';

describe('Document', () => {
  it('empty Document', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [],
    };
  });

  it('Document with blocks', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: faker.person.prefix() as TopLevelBlockEnum,
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
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [],
    };
  });

  it('Block with block', () => {
    const block: Block = {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: faker.person.prefix() as INLINES,
          data: {},
          content: [],
        },
      ],
    };
  });

  it('Block with text', () => {
    const block: Block = {
      nodeType: BLOCKS.PARAGRAPH,
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
      nodeType: INLINES.HYPERLINK,
      data: {},
      content: [],
    };
  });

  it('Inline with inline', () => {
    const inline: Inline = {
      nodeType: INLINES.HYPERLINK,
      data: {},
      content: [
        {
          nodeType: faker.person.prefix() as INLINES,
          data: {},
          content: [],
        },
      ],
    };
  });

  it('Inline with text', () => {
    const inline: Inline = {
      nodeType: faker.person.prefix() as INLINES,
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
