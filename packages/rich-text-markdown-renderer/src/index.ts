import he from 'he';
import { BLOCKS, MARKS, INLINES, Block, Inline, Document } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export interface RenderNode {
  [k: string]: NodeRenderer;
}

export interface RenderMark {
  [k: string]: (text: string) => string;
}

export type CommonNode = Text | Block | Inline;

export interface Next {
  (nodes: CommonNode[]): string;
}

export interface NodeRenderer {
  (node: Block | Inline, next: Next): string;
}

export interface Options {
  /**
   * Node renderers
   */
  renderNode?: RenderNode;
  /**
   * Mark renderers
   */
  renderMark?: RenderMark;
}

export function documentToMarkdown(document: Document, options: Partial<Options> = {}): string {
  let orderedListCounter = -1;
  let nestedListCounter = -1;

  return he.decode(
    documentToHtmlString(document, {
      renderMark: {
        [MARKS.BOLD]: (text: any) => `**${text}**`,
        [MARKS.ITALIC]: (text: any) => `*${text}*`,
        [MARKS.UNDERLINE]: (text: any) => `~~${text}~~`,
        [MARKS.CODE]: (text: any) => `\`${text}\``,
        ...options.renderMark,
      },
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node: any, next: any) => `${next(node.content)}\n\n`,
        [BLOCKS.HEADING_1]: (node: any, next: any) => `# ${next(node.content)}\n`,
        [BLOCKS.HEADING_2]: (node: any, next: any) => `## ${next(node.content)}\n`,
        [BLOCKS.HEADING_3]: (node: any, next: any) => `### ${next(node.content)}\n`,
        [BLOCKS.HEADING_4]: (node: any, next: any) => `#### ${next(node.content)}\n`,
        [BLOCKS.HEADING_5]: (node: any, next: any) => `##### ${next(node.content)}\n`,
        [BLOCKS.HEADING_6]: (node: any, next: any) => `###### ${next(node.content)}\n`,
        [BLOCKS.UL_LIST]: (node: any, next: any) => {
          orderedListCounter = -1;
          nestedListCounter++;
          const content = `${next(node.content)}`;
          nestedListCounter--;
          return content;
        },
        [BLOCKS.OL_LIST]: (node: any, next: any) => {
          orderedListCounter = 0; // Reset the counter for each new ordered list

          nestedListCounter++;
          const content = `${next(node.content)}`;
          nestedListCounter--;
          return content;
        },
        [BLOCKS.LIST_ITEM]: (node: any, next: any) => {
          const itemText = next(node.content);
          if (orderedListCounter > -1) orderedListCounter++;

          return `${
            orderedListCounter > 0
              ? `${'\t'.repeat(nestedListCounter)}${orderedListCounter}.`
              : `${'\t'.repeat(nestedListCounter)}-`
          } ${itemText}`;
        },
        [BLOCKS.QUOTE]: (node: any, next: any) => `> ${next(node.content)}\n`,
        [BLOCKS.HR]: () => '\n---\n',
        [BLOCKS.EMBEDDED_ENTRY]: () => '', // You can customize embedded entries if needed
        [INLINES.HYPERLINK]: (node: any, next: any) => `[${next(node.content)}](${node.data.uri})`,
        ...options.renderNode,
      },
    }),
  );
}
