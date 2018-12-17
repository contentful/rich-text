import _ from 'lodash';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { document, block, text, mark, inline } from './helpers';
import { richTextFromMarkdown } from '..';
import { readFileSync } from 'fs';
import path from 'path';
import { MARKS } from '@contentful/rich-text-types/src';

describe('rich-text-from-markdown', () => {
  it('should parse md with all formatting options', async () => {
    const md = readFileSync(path.resolve(__dirname, './real-world.md'), 'utf8');

    const result = await richTextFromMarkdown(md);
    expect(result).toEqual(
      document(
        {},
        block(BLOCKS.HEADING_1, {}, text('h1 Heading')),
        block(BLOCKS.HEADING_2, {}, text('h2 Heading')),
        block(BLOCKS.HEADING_3, {}, text('h3 Heading')),
        block(BLOCKS.HEADING_4, {}, text('h4 Heading')),
        block(BLOCKS.HEADING_5, {}, text('h5 Heading')),
        block(BLOCKS.HEADING_6, {}, text('h6 Heading')),
        block(BLOCKS.HEADING_2, {}, text('Horizontal Rules')),
        block(BLOCKS.HR),
        block(BLOCKS.HR),
        block(BLOCKS.HR),
        block(BLOCKS.HEADING_2, {}, text('Emphasis')),
        block(BLOCKS.PARAGRAPH, {}, text('This is bold text', mark('bold'))),
        block(BLOCKS.PARAGRAPH, {}, text('This is bold text', mark('bold'))),
        block(BLOCKS.PARAGRAPH, {}, text('This is italic text', mark('italic'))),
        block(BLOCKS.PARAGRAPH, {}, text('This is italic text', mark('italic'))),
        block(BLOCKS.PARAGRAPH, {}, text('Strikethrough', mark(undefined))),
        block(BLOCKS.HEADING_2, {}, text('Blockquotes')),
        block(BLOCKS.QUOTE, {}, block(BLOCKS.PARAGRAPH, {}, text('Blockquotes'))),
        block(BLOCKS.HEADING_2, {}, text('Lists')),
        block(BLOCKS.PARAGRAPH, {}, text('Unordered')),
        block(
          BLOCKS.UL_LIST,
          {},
          block(
            BLOCKS.LIST_ITEM,
            {},
            block(
              BLOCKS.PARAGRAPH,
              {},
              text('Create a list by starting a line with '),
              text('+', mark(MARKS.CODE)),
              text(', '),
              text('-', mark(MARKS.CODE)),
              text(', or '),
              text('*', mark(MARKS.CODE)),
            ),
          ),
          block(
            BLOCKS.LIST_ITEM,
            {},
            block(BLOCKS.PARAGRAPH, {}, text('Sub-lists are made by indenting 2 spaces:')),

            block(
              BLOCKS.UL_LIST,
              {},
              block(
                BLOCKS.LIST_ITEM,
                {},
                block(BLOCKS.PARAGRAPH, {}, text('Marker character change forces new list start:')),

                block(
                  BLOCKS.UL_LIST,
                  {},
                  block(
                    BLOCKS.LIST_ITEM,
                    {},
                    block(BLOCKS.PARAGRAPH, {}, text('Ac tristique libero volutpat at')),
                  ),
                ),
                block(
                  BLOCKS.UL_LIST,
                  {},
                  block(
                    BLOCKS.LIST_ITEM,
                    {},
                    block(BLOCKS.PARAGRAPH, {}, text('Facilisis in pretium nisl aliquet')),
                  ),
                ),
                block(
                  BLOCKS.UL_LIST,
                  {},
                  block(
                    BLOCKS.LIST_ITEM,
                    {},
                    block(BLOCKS.PARAGRAPH, {}, text('Nulla volutpat aliquam velit')),
                  ),
                ),
              ),
            ),
          ),
          block(BLOCKS.LIST_ITEM, {}, block(BLOCKS.PARAGRAPH, {}, text('Very easy!'))),
        ),
        block(BLOCKS.PARAGRAPH, {}, text('Ordered')),
        block(
          BLOCKS.OL_LIST,
          {},
          block(
            BLOCKS.LIST_ITEM,
            {},
            block(BLOCKS.PARAGRAPH, {}, text('Lorem ipsum dolor sit amet')),
          ),
          block(
            BLOCKS.LIST_ITEM,
            {},
            block(BLOCKS.PARAGRAPH, {}, text('Consectetur adipiscing elit')),
          ),
          block(
            BLOCKS.LIST_ITEM,
            {},
            block(BLOCKS.PARAGRAPH, {}, text('Integer molestie lorem at massa')),
          ),
          block(
            BLOCKS.LIST_ITEM,
            {},
            block(BLOCKS.PARAGRAPH, {}, text('You can use sequential numbers...')),
          ),
          block(
            BLOCKS.LIST_ITEM,
            {},
            block(
              BLOCKS.PARAGRAPH,
              {},
              text('...or keep all the numbers as '),
              text('1.', mark(MARKS.CODE)),
            ),
          ),
        ),
        block(BLOCKS.PARAGRAPH, {}, text('Start numbering with offset:')),
        block(
          BLOCKS.OL_LIST,
          {},
          block(BLOCKS.LIST_ITEM, {}, block(BLOCKS.PARAGRAPH, {}, text('foo'))),
          block(BLOCKS.LIST_ITEM, {}, block(BLOCKS.PARAGRAPH, {}, text('bar'))),
        ),
        block(BLOCKS.HEADING_2, {}, text('Code')),
        block(BLOCKS.PARAGRAPH, {}, text('Inline '), text('code', mark('code'))),
        block(BLOCKS.HEADING_2, {}, text('Links')),
        block(
          BLOCKS.PARAGRAPH,
          {},
          inline(
            INLINES.HYPERLINK,
            { data: { uri: 'https://www.contentful.com' } },
            text('link text'),
          ),
        ),
        block(
          BLOCKS.PARAGRAPH,
          {},
          inline(
            INLINES.HYPERLINK,
            { data: { uri: 'https://www.contentful.com/blog/' } },
            text('link with title'),
          ),
        ),
      ),
    );
  });
});
