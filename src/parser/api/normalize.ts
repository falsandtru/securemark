import { eval } from '../../combinator/data/parser';
import { unsafehtmlentity } from '../inline/htmlentity';

const UNICODE_REPLACEMENT_CHARACTER = '\uFFFD';
assert(UNICODE_REPLACEMENT_CHARACTER.trim());

export function normalize(source: string): string {
  return sanitize(format(source));
}

function format(source: string): string {
  return source
    .replace(/\r\n?/g, '\n');
}

function sanitize(source: string): string {
  return source
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]|[\u2006\u200B-\u200F\u202A-\u202F\u2060\uFEFF]|(?<![\u1820\u1821])\u180E/g, UNICODE_REPLACEMENT_CHARACTER)
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, char =>
      char.length === 1
        ? UNICODE_REPLACEMENT_CHARACTER
        : char);
}

// https://dev.w3.org/html5/html-author/charref
// https://en.wikipedia.org/wiki/Whitespace_character
export const invisibleHTMLEntityNames = [
  'Tab',
  'NewLine',
  'NonBreakingSpace',
  'nbsp',
  'shy',
  'ensp',
  'emsp',
  'emsp13',
  'emsp14',
  'numsp',
  'puncsp',
  'ThinSpace',
  'thinsp',
  'VeryThinSpace',
  'hairsp',
  'ZeroWidthSpace',
  'NegativeVeryThinSpace',
  'NegativeThinSpace',
  'NegativeMediumSpace',
  'NegativeThickSpace',
  'zwj',
  'zwnj',
  'lrm',
  'rlm',
  'MediumSpace',
  'NoBreak',
  'ApplyFunction',
  'af',
  'InvisibleTimes',
  'it',
  'InvisibleComma',
  'ic',
] as const;
const unreadableHTMLEntityNames: readonly string[] = invisibleHTMLEntityNames.slice(2);
const unreadableEscapableCharacters = unreadableHTMLEntityNames
  .map(name => eval(unsafehtmlentity({ source: `&${name};`, context: {} }))![0]);
assert(unreadableEscapableCharacters.length === unreadableHTMLEntityNames.length);
assert(unreadableEscapableCharacters.every(c => c.length === 1));
const unreadableEscapableCharacter = new RegExp(`[${
  [...new Set<string>(unreadableEscapableCharacters)].join('')
}]`, 'g');
assert(!unreadableEscapableCharacter.source.includes('&'));

// https://www.pandanoir.info/entry/2018/03/11/193000
// http://anti.rosx.net/etc/memo/002_space.html
// http://nicowiki.com/%E7%A9%BA%E7%99%BD%E3%83%BB%E7%89%B9%E6%AE%8A%E8%A8%98%E5%8F%B7.html
const unreadableSpecialCharacters = [
  // SIX-PER-EM SPACE
  '\u2006',
  // ZERO WIDTH SPACE
  '\u200B',
  // ZERO WIDTH NON-JOINER
  '\u200C',
  // ZERO WIDTH JOINER
  '\u200D',
  // LEFT-TO-RIGHT MARK
  '\u200E',
  // RIGHT-TO-LEFT MARK
  '\u200F',
  // LEFT-TO-RIGHT EMBEDDING
  '\u202A',
  // RIGHT-TO-LEFT EMBEDDING
  '\u202B',
  // POP DIRECTIONAL FORMATTING
  '\u202C',
  // LEFT-TO-RIGHT OVERRIDE
  '\u202D',
  // RIGHT-TO-LEFT OVERRIDE
  '\u202E',
  // NARROW NO-BREAK SPACE
  '\u202F',
  // WORD JOINER
  '\u2060',
  // ZERO WIDTH NON-BREAKING SPACE
  '\uFEFF',
] as const;
assert(unreadableSpecialCharacters.every(c => sanitize(c) === UNICODE_REPLACEMENT_CHARACTER));

// 特殊不可視文字はエディタおよびソースビューアでは等幅および強調表示により可視化する
export function escape(source: string): string {
  return source
    .replace(unreadableEscapableCharacter, char =>
      `&${unreadableHTMLEntityNames[unreadableEscapableCharacters.indexOf(char)]};`);
}
