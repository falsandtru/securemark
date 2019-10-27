import { ParagraphParser } from '../../../block';
import { union, some, block, validate, rewrite, convert, lazy, fmap } from '../../../../combinator';
import { contentline } from '../../../source';
import { autolink } from '../../../autolink';
import { defrag } from '../../../util';
import { html } from 'typed-dom';

export const quotation: ParagraphParser.MentionParser.QuotationParser = lazy(() => block(fmap(
  union([
    rewrite(
      some(validate(/^(?=>+(?:\s|$))/, contentline)),
      convert(source => source.replace(/\n$/, ''), defrag(some(autolink)))),
    rewrite(
      some(validate(/^>/, contentline)),
      convert(source => source.replace(/\n$/, ''), defrag(some(autolink)))),
  ]),
  ns => [html('span', { class: 'quotation' }, ns)]),
  false));
