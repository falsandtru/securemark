import { ParagraphParser } from '../../block';
import { combine, some, bracket, transform } from '../../../combinator';
import { line } from '../../source/line';
import { unescsource } from '../../source/unescapable';
import { match } from '../../source/validation';
import { html } from 'typed-dom';

const syntax = /^>+[^>\s]\S*\s*?(?=\n|$)/;
const closer = /^\s/;

export const reference: ParagraphParser.ReferenceParser = source => {
  if (!match(source, '>', syntax)) return;
  return transform(
    line(bracket(/^>+/, some(combine<ParagraphParser.ReferenceParser>([unescsource]), closer), /^[^\S\n]*(?:\n|$)/)),
    (ts, rest, source) =>
      ts.length === 0
        ? undefined
        : [[html('a', { class: 'reference', rel: 'noopener' }, source.slice(0, source.length - rest.length).trim())], rest])
    (source);
};
