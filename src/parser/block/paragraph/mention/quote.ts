import { ParagraphParser } from '../../../block';
import { union, some, block, validate, rewrite, convert, lazy, fmap } from '../../../../combinator';
import { contentline } from '../../../source/line';
import { autolink } from '../../../autolink';
import { defrag } from '../../../util';
import { html } from 'typed-dom';

export const quote: ParagraphParser.MentionParser.QuoteParser = lazy(() => block(fmap(
  union([
    validate(
      /^(?=>+(?:[^\S\n]|\n\s*\S))/,
      rewrite(
        some(validate(/^(?=>+(?:\s|$))/, contentline)),
        convert(source => source.replace(/\n$/, ''), defrag(some(autolink))))),
    validate(
      /^(?=>+(?:[^>\n]|\n\s*\S))/,
      rewrite(
        some(validate(/^(?=>+)/, contentline)),
        convert(source => source.replace(/\n$/, ''), defrag(some(autolink))))),
  ]),
  ns => [html('span', { class: 'quote' }, ns)]),
  false));
