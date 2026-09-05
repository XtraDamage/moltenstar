export function isEmojiOnly(text) {
  const regex = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200D\uFE0F\u20E3\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\s]+$/u;
  const withoutWhitespace = text.replace(/\s/g, '');
  if (withoutWhitespace.length === 0) return false;
  return regex.test(text);
}

export function splitEmojis(text) {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  const segments = Array.from(segmenter.segment(text));
  return segments.map(s => s.segment).filter(s => s.trim().length > 0);
}

export function emojiToCodepoint(emoji) {
  return Array.from(emoji)
    .map(char => char.codePointAt(0).toString(16).toLowerCase())
    .join('_');
}

export function getNotoEmojiUrl(emoji) {
  const codepoint = emojiToCodepoint(emoji);
  return {
    webp: `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/512.webp`,
    gif: `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/512.gif`
  };
}
