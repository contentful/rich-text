import BLOCKS from '../../blocks';
import INLINES from '../../inlines';
import { getSchemaWithNodeType } from '../index';

const matchesSnapshot = (nodeType: string): void => {
  const jsonSchema = getSchemaWithNodeType(nodeType);

  expect(jsonSchema).toMatchSnapshot(nodeType);
};

describe('getSchemaWithNodeType', () => {
  it('returns json schema for each nodeType', () => {
    Object.values(INLINES).forEach(nodeType => {
      matchesSnapshot(nodeType);
    });
    Object.values(BLOCKS).forEach(nodeType => {
      matchesSnapshot(nodeType);
    });

    matchesSnapshot('text');
  });

  it('throws error if no schema found', () => {
    expect(() => getSchemaWithNodeType('unknown-node-type')).toThrowErrorMatchingSnapshot();
  });
});
