import { marked } from 'marked';

export function parseMarkdownTokens(text) {
  return marked.lexer(text);
}

export function renderInlineMarkdown(text) {
  return marked.parseInline(text);
}
