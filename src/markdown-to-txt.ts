import { marked } from "marked";
import escape from "lodash.escape";
import unescape from "lodash.unescape";

const block = (text: string) => text + "";
const escapeBlock = (text: string) => escape(text) + "";
const line = (text: string) => text + "";
const inline = (text: string) => text;
const newline = () => "";
const empty = () => "";

const TxtRenderer: marked.Renderer = {
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
export function markdownToTxt(
	markdown: string,
	options?: marked.MarkedOptions
): string {
	const unmarked = marked(markdown, { ...options, renderer: TxtRenderer });
	const unescaped = unescape(unmarked);
	const trimmed = unescaped.trim();
	return trimmed;
}

export default markdownToTxt;
