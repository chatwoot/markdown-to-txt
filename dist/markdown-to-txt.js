"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToTxt = void 0;
const marked_1 = require("marked");
const lodash_escape_1 = __importDefault(require("lodash.escape"));
const lodash_unescape_1 = __importDefault(require("lodash.unescape"));
const block = (text) => text + "";
const escapeBlock = (text) => (0, lodash_escape_1.default)(text) + "";
const line = (text) => text + "";
const inline = (text) => text;
const newline = () => "";
const empty = () => "";
const TxtRenderer = {
    // Block elements
    code: escapeBlock,
    blockquote: block,
    html: empty,
    heading: block,
    hr: newline,
    list: (text) => block(text.trim()),
    listitem: line,
    checkbox: empty,
    paragraph: block,
    table: (header, body) => line(header + body),
    tablerow: (text) => line(text.trim()),
    tablecell: (text) => text + " ",
    // Inline elements
    strong: inline,
    em: inline,
    codespan: inline,
    br: newline,
    del: inline,
    link: (href, _1, text) => {
        if (href && href.startsWith("mention://")) {
            return text;
        }
        if (href && href.startsWith("mailto:")) {
            const encoded = href.replace("mailto:", "");
            // Create a temporary textarea to decode HTML entities
            const txt = document.createElement("textarea");
            txt.innerHTML = encoded;
            const decoded = txt.value;
            return decoded;
        }
        return text;
    },
    image: (_0, _1, text) => text,
    text: inline,
    // etc.
    options: {},
};
/**
 * Converts markdown to plaintext using the marked Markdown library.
 * Accepts [MarkedOptions](https://marked.js.org/using_advanced#options) as
 * the second argument.
 *
 * NOTE: The output of markdownToTxt is NOT sanitized. The output may contain
 * valid HTML, JavaScript, etc. Be sure to sanitize if the output is intended
 * for web use.
 *
 * @param markdown the markdown text to txtify
 * @param options  the marked options
 * @returns the unmarked text
 */
function markdownToTxt(markdown, options) {
    const unmarked = (0, marked_1.marked)(markdown, Object.assign(Object.assign({}, options), { renderer: TxtRenderer }));
    const unescaped = (0, lodash_unescape_1.default)(unmarked);
    const trimmed = unescaped.trim();
    return trimmed;
}
exports.markdownToTxt = markdownToTxt;
exports.default = markdownToTxt;
