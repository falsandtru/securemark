import { undefined, location } from 'spica/global';
import { ParserOptions } from '../../..';
import { MarkdownParser } from '../../../markdown';
import { eval } from '../../combinator/data/parser';
import { header } from '../header';
import { block } from '../block';
import { segment, validate, MAX_SEGMENT_SIZE } from '../segment';
import { normalize } from './normalize';
import { headers } from './header';
import { figure } from '../processor/figure';
import { footnote } from '../processor/footnote';
import { frag } from 'typed-dom';
import { ReadonlyURL } from 'spica/url';

interface Options extends ParserOptions {
  readonly test?: boolean;
}

export function parse(source: string, opts: Options = {}, context?: MarkdownParser.Context): DocumentFragment {
  if (!validate(source, MAX_SEGMENT_SIZE)) throw new Error(`Too large input over ${MAX_SEGMENT_SIZE.toLocaleString('en')} bytes.`);
  const url = headers(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() ?? '';
  source = !context ? normalize(source) : source;
  assert(!context?.delimiters);
  context = {
    url: url ? new ReadonlyURL(url as ':') : context?.url,
    host: opts.host ?? context?.host ?? new ReadonlyURL(location.pathname, location.origin),
    caches: context?.caches,
    test: undefined,
    ...opts,
  };
  if (context.host?.origin === 'null') throw new Error(`Invalid host: ${context.host.href}`);
  const node = frag();
  let index = 0;
  for (const seg of segment(source)) {
    node.append(...eval(header(seg, { header: index++ === 0 }) || block(seg, context), []));
  }
  assert(opts.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  if (opts.test) return node;
  for (const _ of figure(node, opts.footnotes, context));
  for (const _ of footnote(node, opts.footnotes, context));
  assert(opts.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  assert(opts.id !== '' || !opts.footnotes?.annotations.querySelector('[id], .index[href], .label[href]'));
  assert(opts.id !== '' || !opts.footnotes?.references.querySelector('[id], .index[href], .label[href]'));
  return node;
}
