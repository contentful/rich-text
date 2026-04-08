export { BLOCKS } from './blocks.js';
export { INLINES } from './inlines.js';
export { MARKS } from './marks.js';

export * from './schemaConstraints.js';

export * from './types.js';
export * from './nodeTypes.js';

export { EMPTY_DOCUMENT } from './emptyDocument.js';

import * as helpers from './helpers.js';
export { helpers };

export { validateRichTextDocument } from './validator/index.js';
export type { ValidationError } from './validator/index.js';
