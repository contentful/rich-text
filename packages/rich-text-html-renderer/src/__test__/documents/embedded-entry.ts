import { BLOCKS, Document } from '@contentful/rich-text-types';

export default function (entry: Record<string, any>) {
  return {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.EMBEDDED_ENTRY,
        content: [],
        data: {
          target: entry,
        },
      },
    ],
  } as Document;
}
