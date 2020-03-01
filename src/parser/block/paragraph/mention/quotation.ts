import { ParagraphParser } from '../../../block';
import { union, some, block, validate, rewrite, creator, fmap, convert, lazy } from '../../../../combinator';
import { defrag } from '../../../util';
import { contentline } from '../../../source';
import { autolink } from '../../../autolink';
import { html } from 'typed-dom';

export const quotation: ParagraphParser.MentionParser.QuotationParser = lazy(() => block(creator(fmap(
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
