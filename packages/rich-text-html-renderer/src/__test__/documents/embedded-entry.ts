import { Document, BLOCKS } from '@contentful/rich-text-types';

export default function(entry: Object) {
  return {
    nodeType: 'document',
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
