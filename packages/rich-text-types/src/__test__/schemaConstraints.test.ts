import { BLOCKS } from '../blocks';
import { CONTAINERS, TEXT_CONTAINERS, VOID_BLOCKS } from '../schemaConstraints';

const allKnownBlocks = Object.values(BLOCKS);

describe('schema constraints', () => {
  it('all block node types are either considered a container or void', () => {
    const blocks = [
      BLOCKS.DOCUMENT, // Root block could be in CONTAINERS but isn't.
      ...VOID_BLOCKS,
      ...TEXT_CONTAINERS,
      ...Object.keys(CONTAINERS),
    ];
    expect(blocks).toEqual(expect.arrayContaining(allKnownBlocks));
    expect(blocks.length).toEqual(allKnownBlocks.length);
  });

  it('should allow UL_LIST and OL_LIST blocks as children of TABLE_CELL', () => {
    // Get the children of TABLE_CELL
    const tableCellChildren = CONTAINERS[BLOCKS.TABLE_CELL];

    // Check that UL_LIST and OL_LIST are in the children array
    expect(tableCellChildren).toContain(BLOCKS.UL_LIST);
    expect(tableCellChildren).toContain(BLOCKS.OL_LIST);
  });
});
