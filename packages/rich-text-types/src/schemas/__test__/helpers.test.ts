import { BLOCKS } from '../../blocks';
import { isBlock, isInline } from '../../helpers';
import { INLINES } from '../../inlines';

test('isBlock', () => {
  const block: any = { nodeType: BLOCKS.PARAGRAPH };
  const nonBlock: any = { nodeType: 'Paragraph' };
  const nonBlock2: any = { nodeType: undefined };

  expect(isBlock(block)).toBe(true);
  expect(isBlock(nonBlock)).toBe(false);
  expect(isBlock(nonBlock2)).toBe(false);
});

test('isInline', () => {
  const inline: any = { nodeType: INLINES.HYPERLINK };
  const noninline: any = { nodeType: 'Hyperlink' };
  const noninline2: any = { nodeType: undefined };

  expect(isInline(inline)).toBe(true);
  expect(isInline(noninline)).toBe(false);
  expect(isInline(noninline2)).toBe(false);
});
