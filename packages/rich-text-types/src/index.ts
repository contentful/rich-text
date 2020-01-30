import 'core-js/features/object/values';
import 'core-js/features/array/includes';

export { default as BLOCKS } from './blocks';
export { default as INLINES } from './inlines';
export { default as MARKS } from './marks';

export * from './schemaConstraints';

export * from './types';
export * from './nodeTypes';

export { default as EMPTY_DOCUMENT } from './emptyDocument';

import * as helpers from './helpers';
export { helpers };
