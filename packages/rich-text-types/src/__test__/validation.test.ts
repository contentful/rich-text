import { BLOCKS } from '../blocks';
import { INLINES } from '../inlines';
import { validateRichTextDocument } from '../validation';

const document = (args: any, ...content: any) => ({
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content,
  ...args,
});

const node = (nodeType: string, args?: any, ...content: any) => ({
  nodeType,
  data: {},
  content,
  ...args,
});

const text = (value = '', args?: any) => ({
  nodeType: 'text',
  data: {},
  marks: [],
  value,
  ...args,
});

const topLevelBlocks = [
  BLOCKS.EMBEDDED_ASSET,
  BLOCKS.EMBEDDED_ENTRY,
  BLOCKS.HEADING_1,
  BLOCKS.HEADING_2,
  BLOCKS.HEADING_3,
  BLOCKS.HEADING_4,
  BLOCKS.HEADING_5,
  BLOCKS.HEADING_6,
  BLOCKS.HR,
  BLOCKS.OL_LIST,
  BLOCKS.PARAGRAPH,
  BLOCKS.QUOTE,
  BLOCKS.TABLE,
  BLOCKS.UL_LIST,
].sort();

const listBlocks = [
  BLOCKS.EMBEDDED_ASSET,
  BLOCKS.EMBEDDED_ENTRY,
  BLOCKS.HEADING_1,
  BLOCKS.HEADING_2,
  BLOCKS.HEADING_3,
  BLOCKS.HEADING_4,
  BLOCKS.HEADING_5,
  BLOCKS.HEADING_6,
  BLOCKS.HR,
  BLOCKS.OL_LIST,
  BLOCKS.PARAGRAPH,
  BLOCKS.QUOTE,
  BLOCKS.UL_LIST,
].sort();

describe('validateRichTextDocument', () => {
  describe('root node', () => {
    it('fails if it is not document node', () => {
      const value = node(BLOCKS.PARAGRAPH);
      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          instancePath: '/nodeType',
          message: 'must be equal to one of the allowed values',
          params: {
            allowedValues: ['document'],
          },
          data: BLOCKS.PARAGRAPH,
        }),
      ]);
    });

    it('does not allow invalid root document shape', () => {
      const value: any = { nodeType: BLOCKS.DOCUMENT };
      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'required',
          instancePath: '',
          message: "must have required property 'content'",
        }),
        expect.objectContaining({
          keyword: 'required',
          instancePath: '',
          message: "must have required property 'data'",
        }),
      ]);
    });

    it('does not allow nested documents', () => {
      const value = document(
        {},
        node(BLOCKS.PARAGRAPH),
        node(BLOCKS.UL_LIST, {}, node(BLOCKS.LIST_ITEM, {}, node(BLOCKS.DOCUMENT))),
      );

      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          message: 'must be equal to one of the allowed values',
          keyword: 'enum',
          instancePath: '/content/0/nodeType',
          params: {
            allowedValues: listBlocks,
          },
          data: 'document',
        }),
      ]);
    });

    it('does not allow custom nodeTypes', () => {
      const value = document(
        {},
        node(BLOCKS.PARAGRAPH, {}, node('custom-type', {}, node(BLOCKS.PARAGRAPH))),
      );

      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          instancePath: '/content/0/nodeType',
          message: 'must be equal to one of the allowed values',
          params: {
            allowedValues: Object.values(INLINES).sort(),
          },
          data: 'custom-type',
        }),
      ]);
    });
  });

  describe('direct children of root node', () => {
    it('validate with blocks as direct children of the root node', () => {
      const value = document({}, node(BLOCKS.PARAGRAPH, {}));
      const errorsResult = validateRichTextDocument(value);
      expect(errorsResult).toEqual([]);
    });

    it(`fails with ${BLOCKS.LIST_ITEM} as immediate child of root node`, () => {
      const value = document({}, node(BLOCKS.LIST_ITEM, {}, node(BLOCKS.PARAGRAPH, {}, text(''))));
      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          message: 'must be equal to one of the allowed values',
          instancePath: '/content/0/nodeType',
          params: {
            allowedValues: topLevelBlocks,
          },
          data: BLOCKS.LIST_ITEM,
        }),
      ]);
    });

    for (const dependentNode of [BLOCKS.TABLE_ROW, BLOCKS.TABLE_CELL, BLOCKS.TABLE_HEADER_CELL]) {
      it(`fails with ${dependentNode} as immediate child of root node`, () => {
        const value = document({}, node(dependentNode, {}, node(BLOCKS.PARAGRAPH, {}, text(''))));
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'enum',
            message: 'must be equal to one of the allowed values',
            instancePath: '/content/0/nodeType',
            params: {
              allowedValues: topLevelBlocks,
            },
            data: dependentNode,
          }),
        ]);
      });
    }

    it('fail with inlines as direct children', () => {
      const value = document({}, node(INLINES.HYPERLINK, { data: { uri: '' } }));
      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          instancePath: '/content/0/nodeType',
          message: 'must be equal to one of the allowed values',
          params: {
            allowedValues: topLevelBlocks,
          },
          data: INLINES.HYPERLINK,
        }),
      ]);
    });

    it('fail with text as direct children', () => {
      const value = document({}, text());
      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          instancePath: '/content/0/nodeType',
          message: `must be equal to one of the allowed values`,
          params: {
            allowedValues: topLevelBlocks,
          },
          data: 'text',
        }),
      ]);
    });

    it('fail with text and inline as direct children', () => {
      const value = document(
        {},
        text(),
        node(BLOCKS.PARAGRAPH),
        node(INLINES.ASSET_HYPERLINK, { data: { target: {} } }),
      );

      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          instancePath: '/content/0/nodeType',
          message: `must be equal to one of the allowed values`,
          params: {
            allowedValues: topLevelBlocks,
          },
          data: 'text',
        }),
      ]);
    });
  });

  describe('children constraints', () => {
    for (const listNode of [BLOCKS.UL_LIST, BLOCKS.OL_LIST]) {
      it(`allows only ${BLOCKS.LIST_ITEM} as immediate children of list nodes (${listNode})`, () => {
        const value = document({}, node(listNode, {}, node(BLOCKS.PARAGRAPH, {}, text(''))));
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'enum',
            instancePath: '/content/0/nodeType',
            message: `must be equal to one of the allowed values`,
            params: {
              allowedValues: [BLOCKS.LIST_ITEM],
            },
            data: BLOCKS.PARAGRAPH,
          }),
        ]);
      });
    }

    it(`allows only ${BLOCKS.TABLE_ROW} as immediate children of table nodes`, () => {
      const value = document({}, node(BLOCKS.TABLE, {}, node(BLOCKS.PARAGRAPH, {}, text(''))));

      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          instancePath: '/content/0/nodeType',
          message: `must be equal to one of the allowed values`,
          params: {
            allowedValues: [BLOCKS.TABLE_ROW],
          },
          data: BLOCKS.PARAGRAPH,
        }),
      ]);
    });

    it(`allows only table cell nodes as immediate children of a ${BLOCKS.TABLE_ROW} nodes`, () => {
      const value = document(
        {},
        node(BLOCKS.TABLE, {}, node(BLOCKS.TABLE_ROW, {}, node(BLOCKS.PARAGRAPH, {}, text('')))),
      );

      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          instancePath: '/content/0/nodeType',
          message: `must be equal to one of the allowed values`,
          params: {
            allowedValues: [BLOCKS.TABLE_CELL, BLOCKS.TABLE_HEADER_CELL],
          },
          data: BLOCKS.PARAGRAPH,
        }),
      ]);
    });

    it(`allows only block nodes as direct children of ${BLOCKS.LIST_ITEM} nodes`, () => {
      const value = document({}, node(BLOCKS.UL_LIST, {}, node(BLOCKS.LIST_ITEM, {}, text(''))));
      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          instancePath: '/content/0/nodeType',
          message: `must be equal to one of the allowed values`,
          params: {
            allowedValues: listBlocks,
          },
          data: 'text',
        }),
      ]);
    });

    it(`allows only paragraphs as direct children of ${BLOCKS.TABLE_CELL} nodes`, () => {
      const value = document(
        {},
        node(BLOCKS.TABLE, {}, node(BLOCKS.TABLE_ROW, {}, node(BLOCKS.TABLE_CELL, {}, text('')))),
      );

      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          instancePath: '/content/0/nodeType',
          message: `must be equal to one of the allowed values`,
          params: {
            allowedValues: ['paragraph'],
          },
          data: 'text',
        }),
      ]);
    });

    it('allows inlines to contain only inline or text nodes', () => {
      const value = document(
        {},
        node(
          BLOCKS.PARAGRAPH,
          {},
          node(INLINES.HYPERLINK, { data: { uri: '' } }, node(BLOCKS.PARAGRAPH, {}, text(''))),
        ),
      );

      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          instancePath: '/content/0/nodeType',
          message: `must be equal to one of the allowed values`,
          params: {
            allowedValues: ['text'],
          },
          data: BLOCKS.PARAGRAPH,
        }),
      ]);
    });

    it(`allows only ${BLOCKS.PARAGRAPH} as children of ${BLOCKS.QUOTE}`, () => {
      const value = document(
        {},
        node(BLOCKS.QUOTE, {}, node(INLINES.HYPERLINK, { data: { uri: '' } })),
      );

      const errorsResult = validateRichTextDocument(value);

      expect(errorsResult).toEqual([
        expect.objectContaining({
          keyword: 'enum',
          message: `must be equal to one of the allowed values`,
          instancePath: '/content/0/nodeType',
          data: INLINES.HYPERLINK,
          params: {
            allowedValues: [BLOCKS.PARAGRAPH],
          },
        }),
      ]);
    });
  });

  describe('node properties', () => {
    describe('blocks and inlines', () => {
      it('validate with required properties', () => {
        const value: any = {
          nodeType: BLOCKS.DOCUMENT,
          data: {},
          content: [],
        };

        const errorsResult = validateRichTextDocument(value);
        expect(errorsResult).toEqual([]);
      });

      it('fail without required `nodeType` property', () => {
        const value = document({}, node(BLOCKS.PARAGRAPH, { data: {}, nodeType: null }, text('')));
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'enum',
            instancePath: '/content/0/nodeType',
            message: 'must be equal to one of the allowed values',
            params: {
              allowedValues: topLevelBlocks,
            },
            data: null,
          }),
        ]);
      });

      it('fail without required `content` property', () => {
        const value = document(
          {},
          node(
            BLOCKS.OL_LIST,
            {},
            node(BLOCKS.LIST_ITEM, {}, { nodeType: BLOCKS.PARAGRAPH, data: {} }),
          ),
        );

        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'required',
            instancePath: '',
            message: "must have required property 'content'",
          }),
        ]);
      });

      it('fail with invalid `content` property', () => {
        // We already test `undefined` value above (that would throw a "required" error)
        // that's why it's not included in the list.
        ['hello', 123, true, null].forEach(content => {
          const value: any = {
            nodeType: 'document',
            data: {},
            content,
          };

          const errorsResult = validateRichTextDocument(value);

          expect(errorsResult).toEqual([
            expect.objectContaining({
              keyword: 'type',
              instancePath: '/content',
              message: 'must be array',
              schema: 'array',
              data: content,
            }),
          ]);
        });
      });

      it('fail with unknown/custom properties', () => {
        const value = document({
          data: {},
          content: [],
          customProp: 1,
        });
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'additionalProperties',
            instancePath: '',
            params: {
              additionalProperty: 'customProp',
            },
            message: 'must NOT have additional properties',
          }),
        ]);
      });

      it('fail with missing & unknown/custom properties', () => {
        const value = document({
          data: {},
          customProp: 1,
          content: null,
        });
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'additionalProperties',
            instancePath: '',
            params: {
              additionalProperty: 'customProp',
            },
            message: `must NOT have additional properties`,
          }),
          expect.objectContaining({
            keyword: 'type',
            instancePath: '/content',
            message: 'must be array',
            data: null,
            schema: 'array',
          }),
        ]);
      });
    });

    describe('text nodes', () => {
      it('validate with required properties', () => {
        const value = document({}, node(BLOCKS.PARAGRAPH, {}, text('')));
        const errorResults = validateRichTextDocument(value);
        expect(errorResults).toEqual([]);
      });

      it('fail without required properties', () => {
        const value = document({}, node(BLOCKS.PARAGRAPH, {}, text('', { data: null })));
        const errorsResult = validateRichTextDocument(value);
        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'type',
            instancePath: '/data',
            message: 'must be object',
            schema: 'object',
            data: null,
          }),
        ]);
      });

      it('fail without required `value` property', () => {
        const value = document({}, node(BLOCKS.PARAGRAPH, {}, text(null)));
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'type',
            instancePath: '/value',
            message: 'must be string',
            schema: 'string',
            data: null,
          }),
        ]);
      });

      it('fail with unknown/custom properties', () => {
        const value = document({}, node(BLOCKS.PARAGRAPH, {}, text('', { customProp: true })));
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'additionalProperties',
            instancePath: '',
            params: {
              additionalProperty: 'customProp',
            },
            message: `must NOT have additional properties`,
          }),
        ]);
      });

      it('fail with missing & unknown/custom properties', () => {
        const value = document({}, node(BLOCKS.PARAGRAPH, {}, text(null)));
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'type',
            instancePath: '/value',
            message: 'must be string',
            schema: 'string',
            data: null,
          }),
        ]);
      });
    });
  });

  describe('properties shape', () => {
    describe('`data` property', () => {
      it('fails with missing `data` property', () => {
        const value = document(
          {},
          node(BLOCKS.PARAGRAPH, {}, { nodeType: INLINES.HYPERLINK, content: [] }),
        );
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'required',
            message: "must have required property 'data'",
          }),
        ]);
      });

      it(`fails with invalid properties for ${INLINES.HYPERLINK} nodeTypes`, () => {
        const value = document(
          {},
          node(
            BLOCKS.PARAGRAPH,
            {},
            {
              nodeType: INLINES.HYPERLINK,
              data: {},
              content: [text('')],
            },
          ),
        );
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'required',
            instancePath: '/data',
            message: "must have required property 'uri'",
          }),
        ]);
      });

      it(`fails with invalid properties for ${INLINES.ASSET_HYPERLINK} nodeTypes`, () => {
        const value = document(
          {},
          node(
            BLOCKS.PARAGRAPH,
            {},
            { nodeType: INLINES.ASSET_HYPERLINK, data: {}, content: [text()] },
          ),
        );
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'required',
            instancePath: '/data',
            message: "must have required property 'target'",
          }),
        ]);
      });

      it(`fails with invalid properties for ${INLINES.ENTRY_HYPERLINK} nodeTypes`, () => {
        const value = document(
          {},
          node(
            BLOCKS.PARAGRAPH,
            {},
            { nodeType: INLINES.ENTRY_HYPERLINK, data: {}, content: [text()] },
          ),
        );
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'required',
            instancePath: '/data',
            message: "must have required property 'target'",
          }),
        ]);
      });

      it(`fails with invalid properties of ${INLINES.EMBEDDED_ENTRY} nodeTypes`, () => {
        const value = document(
          {},
          node(
            BLOCKS.PARAGRAPH,
            {},
            { nodeType: INLINES.EMBEDDED_ENTRY, data: {}, content: [text()] },
          ),
        );
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'required',
            instancePath: '/data',
            message: "must have required property 'target'",
          }),
          expect.objectContaining({
            keyword: 'maxItems',
            instancePath: '/content',
            message: 'must NOT have more than 0 items',
            data: [
              {
                data: {},
                marks: [],
                nodeType: 'text',
                value: '',
              },
            ],
          }),
        ]);
      });

      it('fails with unknown/custom properties', () => {
        const value = document(
          {},
          node(
            BLOCKS.PARAGRAPH,
            {},
            {
              nodeType: INLINES.HYPERLINK,
              data: { foo: true, uri: 'https://world.com' },
              content: [text()],
            },
          ),
        );
        const errorsResult = validateRichTextDocument(value);

        expect(errorsResult).toEqual([
          expect.objectContaining({
            keyword: 'additionalProperties',
            instancePath: '/data',
            params: {
              additionalProperty: 'foo',
            },
            message: 'must NOT have additional properties',
          }),
        ]);
      });
    });
  });
});
