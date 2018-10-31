"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var blocks_1 = __importDefault(require("./blocks"));
/**
 * Array of all top level block types.
 * Only these block types can be the direct children of the document.
 */
exports.TOP_LEVEL_BLOCKS = [
    blocks_1.default.PARAGRAPH,
    blocks_1.default.HEADING_1,
    blocks_1.default.HEADING_2,
    blocks_1.default.HEADING_3,
    blocks_1.default.HEADING_4,
    blocks_1.default.HEADING_5,
    blocks_1.default.HEADING_6,
    blocks_1.default.OL_LIST,
    blocks_1.default.UL_LIST,
    blocks_1.default.HR,
    blocks_1.default.QUOTE,
    blocks_1.default.EMBEDDED_ENTRY,
    blocks_1.default.EMBEDDED_ASSET,
];
/**
 * Array of all void block types
 */
exports.VOID_BLOCKS = [blocks_1.default.HR, blocks_1.default.EMBEDDED_ENTRY, blocks_1.default.EMBEDDED_ASSET];
/**
 * Dictionary of all container block types, and the set block types they accept as children.
 */
exports.CONTAINERS = (_a = {},
    _a[blocks_1.default.OL_LIST] = [blocks_1.default.LIST_ITEM],
    _a[blocks_1.default.UL_LIST] = [blocks_1.default.LIST_ITEM],
    _a[blocks_1.default.LIST_ITEM] = exports.TOP_LEVEL_BLOCKS.slice(),
    _a[blocks_1.default.QUOTE] = [blocks_1.default.PARAGRAPH],
    _a);
//# sourceMappingURL=schemaConstraints.js.map