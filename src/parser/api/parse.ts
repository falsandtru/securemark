import { ParserOptions } from '../../..';
import { input } from '../../combinator/data/parser';
import { Context, Options, Segment } from '../context';
import { segment } from '../segment';
import { block } from '../block';
import { headers } from './header';
import { figure } from '../processor/figure';
import { note } from '../processor/note';
import { ReadonlyURL } from 'spica/url';
import { frag } from 'typed-dom/dom';

interface Opts extends ParserOptions {
  readonly local?: boolean;
  readonly test?: boolean;
}

export function parse(source: string, opts: Opts = {}, options?: Options): DocumentFragment {
  const url = headers(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() ?? '';
  options = {
    host: opts.host ?? options?.host ?? new ReadonlyURL(location.pathname, location.origin),
    url: url ? new ReadonlyURL(url as ':') : options?.url,
    id: opts.id ?? options?.id,
    local: opts.local ?? options?.local ?? false,
    caches: options?.caches,
    resources: options?.resources,
  };
  if (options.id?.match(/[^0-9a-z/-]/i)) throw new Error('Invalid ID: ID must be alphanumeric');
  if (options.host?.origin === 'null') throw new Error(`Invalid host: ${options.host.href}`);
  const node = frag();
  // @ts-expect-error
  options.header = true;
  for (const [seg, attr] of segment(source, !options.local)) {
    options.segment = attr | Segment.write;
    const es = block(input(seg, new Context(options)))!
      .foldl<HTMLElement[]>((acc, { value }) => void acc.push(value) || acc, [])
    // @ts-expect-error
    options.header = false;
    if (es.length === 0) continue;
    node.append(...es);
  }
  assert(opts.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  if (opts.test) return node;
  for (const _ of figure(node, opts.notes, options));
  for (const _ of note(node, opts.notes, options));
  assert(opts.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  assert(opts.id !== '' || !opts.notes?.references.querySelector('[id], .index[href], .label[href]'));
  return node;
}
