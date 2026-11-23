import { Document, BLOCKS, Mark } from '@contentful/rich-text-types';

type CellType = BLOCKS.TABLE_CELL | BLOCKS.TABLE_HEADER_CELL;

const cell = (
  nodeType: CellType,
  value: string,
  data: { colspan?: number; rowspan?: number } = {},
) => ({
  nodeType,
  data,
  content: [
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [{ nodeType: 'text', data: {}, marks: [] as Mark[], value }],
    },
  ],
});

const row = (...content: ReturnType<typeof cell>[]) => ({
  nodeType: BLOCKS.TABLE_ROW,
  data: {},
  content,
});

const th = (value: string, data?: { colspan?: number; rowspan?: number }) =>
  cell(BLOCKS.TABLE_HEADER_CELL, value, data);
const td = (value: string, data?: { colspan?: number; rowspan?: number }) =>
  cell(BLOCKS.TABLE_CELL, value, data);

/**
 * A 3-column table with merged cells:
 *
 * | H 1 (colspan 2)   | H 2 (rowspan 2) |
 * | H 3     | H 4     |                 |
 * | A (rowspan 2) | B (colspan 2)       |
 * |               | C       | D         |
 * | E (colspan 2, rowspan 2)  | F       |
 * |                           | G       |
 */
export default {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.TABLE,
      data: {},
      content: [
        row(th('H 1', { colspan: 2 }), th('H 2', { rowspan: 2 })),
        row(th('H 3'), th('H 4')),
        row(td('A', { rowspan: 2 }), td('B', { colspan: 2 })),
        row(td('C'), td('D')),
        row(td('E', { colspan: 2, rowspan: 2 }), td('F')),
        row(td('G')),
      ],
    },
  ],
} as Document;
