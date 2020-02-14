import { ParagraphParser } from '../../../block';
import { union, some, block, validate, rewrite, creation, convert, lazy, fmap } from '../../../../combinator';
import { contentline } from '../../../source';
import { autolink } from '../../../autolink';
import { defrag } from '../../../util';
import { html } from 'typed-dom';

export const quotation: ParagraphParser.MentionParser.QuotationParser = lazy(() => block(creation(fmap(
  union([
    rewrite(
      some(validate(/^>+(?:$|\s)/, contentline)),
      convert(source => source.replace(/\n$/, ''), some(autolink))),
    rewrite(
      some(validate(/^>+/, contentline)),
      convert(source => source.replace(/\n$/, ''), some(autolink))),
  ]),
  ns => [html('span', { class: 'quotation' }, defrag(ns))])),
  false));
