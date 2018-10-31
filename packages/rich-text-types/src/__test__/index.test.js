"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var faker_1 = __importDefault(require("faker"));
describe('Document', function () {
    it('empty Document', function () {
        var document = {
            nodeType: 'document',
            nodeClass: 'block',
            data: {},
            content: [],
        };
    });
    it('Document with blocks', function () {
        var document = {
            nodeType: 'document',
            nodeClass: 'block',
            data: {},
            content: [
                {
                    nodeType: faker_1.default.name.title(),
                    nodeClass: 'block',
                    data: {},
                    content: [],
                },
            ],
        };
    });
});
describe('Block', function () {
    it('empty Block', function () {
        var block = {
            nodeType: 'paragraph',
            nodeClass: 'block',
            data: {},
            content: [],
        };
    });
    it('Block with block', function () {
        var block = {
            nodeType: 'paragraph',
            nodeClass: 'block',
            data: {},
            content: [
                {
                    nodeType: faker_1.default.name.title(),
                    nodeClass: 'block',
                    data: {},
                    content: [],
                },
            ],
        };
    });
    it('Block with text', function () {
        var block = {
            nodeType: 'paragraph',
            nodeClass: 'block',
            data: {},
            content: [
                {
                    nodeType: 'text',
                    value: 'hi',
                    data: {},
                    marks: [],
                },
            ],
        };
    });
});
describe('Inline', function () {
    it('empty Inline', function () {
        var inline = {
            nodeType: 'hyperlink',
            nodeClass: 'inline',
            data: {},
            content: [],
        };
    });
    it('Inline with inline', function () {
        var inline = {
            nodeType: 'hyperlink',
            nodeClass: 'inline',
            data: {},
            content: [
                {
                    nodeType: faker_1.default.name.title(),
                    nodeClass: 'inline',
                    data: {},
                    content: [],
                },
            ],
        };
    });
    it('Inline with text', function () {
        var inline = {
            nodeType: faker_1.default.name.title(),
            nodeClass: 'inline',
            data: {},
            content: [
                {
                    nodeType: 'text',
                    value: 'hi',
                    data: {},
                    marks: [],
                },
            ],
        };
    });
});
describe('text', function () {
    it('instantiates text', function () {
        var text = {
            nodeType: 'text',
            value: '',
            data: {},
            marks: [],
        };
    });
    it('instantiates text with marks', function () {
        var textWithMarks = {
            nodeType: 'text',
            data: {},
            value: '',
            marks: [{ type: 'bold' }],
        };
    });
});
//# sourceMappingURL=index.test.js.map