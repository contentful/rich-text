import { BLOCKS } from '../blocks';
import { helpers } from '../index';
import { Document, Mark } from '../types';

describe('helpers', () => {
  describe('isEmptyParagraph', () => {
    it('returns true for empty paragraph', () => {
      const node = {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: 'text' as const,
            value: '',
            marks: [] as Mark[],
            data: {},
          },
        ],
      };
      expect(helpers.isEmptyParagraph(node)).toBe(true);
    });

    it('returns false for non-empty paragraph', () => {
      const node = {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: 'text' as const,
            value: 'Hello world',
            marks: [] as Mark[],
            data: {},
          },
        ],
      };
      expect(helpers.isEmptyParagraph(node)).toBe(false);
    });

    it('returns false for paragraph with multiple text nodes', () => {
      const node = {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: 'text' as const,
            value: '',
            marks: [] as Mark[],
            data: {},
          },
          {
            nodeType: 'text' as const,
            value: '',
            marks: [] as Mark[],
            data: {},
          },
        ],
      };
      expect(helpers.isEmptyParagraph(node)).toBe(false);
    });

    it('returns false for non-paragraph node', () => {
      const node = {
        nodeType: BLOCKS.HEADING_1,
        data: {},
        content: [
          {
            nodeType: 'text' as const,
            value: '',
            marks: [] as Mark[],
            data: {},
          },
        ],
      };
      expect(helpers.isEmptyParagraph(node)).toBe(false);
    });
  });

  describe('stripEmptyTrailingParagraphFromDocument', () => {
    it('strips empty trailing paragraph', () => {
      const document: Document = {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [
              {
                nodeType: 'text' as const,
                value: 'Hello world',
                marks: [] as Mark[],
                data: {},
              },
            ],
          },
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [
              {
                nodeType: 'text' as const,
                value: '',
                marks: [] as Mark[],
                data: {},
              },
            ],
          },
        ],
      };

      const result = helpers.stripEmptyTrailingParagraphFromDocument(document);
      expect(result.content).toHaveLength(1);
      expect(result.content[0].nodeType).toBe(BLOCKS.PARAGRAPH);
    });

    it('does not strip empty trailing paragraph when it is the only child', () => {
      const document: Document = {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [
              {
                nodeType: 'text' as const,
                value: '',
                marks: [] as Mark[],
                data: {},
              },
            ],
          },
        ],
      };

      const result = helpers.stripEmptyTrailingParagraphFromDocument(document);
      expect(result.content).toHaveLength(1);
    });

    it('does not strip non-empty trailing paragraph', () => {
      const document: Document = {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [
              {
                nodeType: 'text' as const,
                value: 'Hello world',
                marks: [] as Mark[],
                data: {},
              },
            ],
          },
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [
              {
                nodeType: 'text' as const,
                value: 'Not empty',
                marks: [] as Mark[],
                data: {},
              },
            ],
          },
        ],
      };

      const result = helpers.stripEmptyTrailingParagraphFromDocument(document);
      expect(result.content).toHaveLength(2);
    });
  });
});
