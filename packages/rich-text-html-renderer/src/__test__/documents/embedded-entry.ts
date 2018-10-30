import { Document, BLOCKS } from '@contentful/rich-text-types';

export default function(entry: Object) {
  return {
    nodeType: 'document',
    nodeClass: 'block',
    data: {},
    content: [
      {
        nodeType: BLOCKS.EMBEDDED_ENTRY,
        nodeClass: 'block',
        content: [],
        data: {
          target: entry,
        },
      },
    ],
  } as Document;
}
