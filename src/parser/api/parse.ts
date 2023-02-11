import { ParserOptions } from '../../..';
import { MarkdownParser } from '../../../markdown';
import { eval } from '../../combinator/data/parser';
import { Memo } from '../../combinator/data/parser/context/memo';
import { segment, validate, MAX_SEGMENT_SIZE } from '../segment';
import { header } from '../header';
import { block } from '../block';
import { State } from '../context';
import { normalize } from './normalize';
import { headers } from './header';
import { figure } from '../processor/figure';
import { footnote } from '../processor/footnote';
import { ReadonlyURL } from 'spica/url';
import { frag } from 'typed-dom/dom';

interface Options extends ParserOptions {
  readonly test?: boolean;
}

export function parse(source: string, opts: Options = {}, context?: MarkdownParser.Context): DocumentFragment {
  if (!validate(source, MAX_SEGMENT_SIZE)) throw new Error(`Too large input over ${MAX_SEGMENT_SIZE.toLocaleString('en')} bytes`);
  const url = headers(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() ?? '';
  source = !context ? normalize(source) : source;
  assert(!context?.delimiters);
  context = {
    host: opts.host ?? context?.host ?? new ReadonlyURL(location.pathname, location.origin),
    url: url ? new ReadonlyURL(url as ':') : context?.url,
    id: opts.id ?? context?.id,
    caches: context?.caches,
    ...context?.resources && {
      resources: context.resources,
    },
    memo: new Memo({ targets: State.backtrackers }),
  };
  if (context.id?.match(/[^0-9a-z-]/i)) throw new Error('Invalid ID: ID must be alphanumeric');
  if (context.host?.origin === 'null') throw new Error(`Invalid host: ${context.host.href}`);
  const node = frag();
  let index = 0;
  for (const seg of segment(source)) {
    node.append(...eval(header({ source: seg, context: { header: index++ === 0 } }) || block({ source: seg, context }), []));
  }
  assert(opts.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  if (opts.test) return node;
  for (const _ of figure(node, opts.footnotes, context));
  for (const _ of footnote(node, opts.footnotes, context));
  assert(opts.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  assert(opts.id !== '' || !opts.footnotes?.references.querySelector('[id], .index[href], .label[href]'));
  return node;
}
