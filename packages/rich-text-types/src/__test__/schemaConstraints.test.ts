import BLOCKS from '../blocks';
import { VOID_BLOCKS, CONTAINERS, TEXT_CONTAINERS } from '../schemaConstraints';

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
});
