import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export function documentToMarkdown(
  document: any,
  renderNodeExt: any = {},
  renderMarkExt: any = {},
): string {
  let orderedListCounter = -1;

  return documentToHtmlString(document, {
    renderMark: {
      [MARKS.BOLD]: (text: any) => `**${text}**`,
      [MARKS.ITALIC]: (text: any) => `*${text}*`,
      [MARKS.UNDERLINE]: (text: any) => `~~${text}~~`,
      [MARKS.CODE]: (text: any) => `\`${text}\``,
      ...renderMarkExt,
    },
    renderNode: {
      // text: (node: any, next: any) => `=>node.value`,
      [BLOCKS.PARAGRAPH]: (node: any, next: any) => `${next(node.content)}\n`,
      [BLOCKS.HEADING_1]: (node: any, next: any) => `# ${next(node.content)}\n`,
      [BLOCKS.HEADING_2]: (node: any, next: any) => `## ${next(node.content)}\n`,
      [BLOCKS.HEADING_3]: (node: any, next: any) => `### ${next(node.content)}\n`,
      [BLOCKS.HEADING_4]: (node: any, next: any) => `#### ${next(node.content)}\n`,
      [BLOCKS.HEADING_5]: (node: any, next: any) => `##### ${next(node.content)}\n`,
      [BLOCKS.HEADING_6]: (node: any, next: any) => `###### ${next(node.content)}\n`,
      [BLOCKS.UL_LIST]: (node: any, next: any) => {
        orderedListCounter = -1;
        return `${next(node.content)}`;
      },
      [BLOCKS.OL_LIST]: (node: any, next: any) => {
        orderedListCounter = 0; // Reset the counter for each new ordered list
        return `${next(node.content)}`;
      },
      [BLOCKS.LIST_ITEM]: (node: any, next: any) => {
        const itemText = next(node.content);
        if (orderedListCounter > -1) orderedListCounter++;

        return `${orderedListCounter > 0 ? `${orderedListCounter}.` : '-'} ${itemText}`;
      },
      // [BLOCKS.OL_LIST]: (node: any, next: any) => `${next(node.content)}`,
      // [BLOCKS.LIST_ITEM]: (node: any, next: any) => `- ${next(node.content)}`,
      [BLOCKS.QUOTE]: (node: any, next: any) => `> ${next(node.content)}\n`,
      [BLOCKS.HR]: () => '\n---\n',
      [BLOCKS.EMBEDDED_ENTRY]: () => '', // You can customize embedded entries if needed
      [INLINES.HYPERLINK]: (node: any, next: any) => `[${next(node.content)}](${node.data.uri})`,
      // [INLINES.ASSET_HYPERLINK]: (node: any, next: any) =>
      //   `[${next(node.content)}](${node.data.target.fields.file.url})`,
      // [BLOCKS.EMBEDDED_ASSET]: (node: any, next: any) =>
      //   `![${node.data.target.fields.title}](${node.data.target.fields.file.url})`,
      // [INLINES.ENTRY_HYPERLINK]: (node: any, next: any) =>
      //   `[${next(node.content)}](${node.data.target.sys.id})`,
      ...renderNodeExt,
    },
  });
}
