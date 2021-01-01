import { undefined, location } from 'spica/global';
import { ObjectAssign, ObjectCreate } from 'spica/alias';
import { ParserOptions } from '../../..';
import { MarkdownParser } from '../../../markdown';
import { eval } from '../../combinator';
import { header } from '../header';
import { block } from '../block';
import { segment } from '../segment';
import { normalize } from './normalize';
import { headers } from '../api/header';
import { figure } from '../../util/figure';
import { footnote } from '../../util/footnote';
import { memoize } from 'spica/memoize';
import { URL } from 'spica/url';
import { push } from 'spica/array';
import { frag } from 'typed-dom';

interface Options extends ParserOptions {
  readonly header?: boolean;
  readonly test?: boolean;
}

const inherit = memoize<MarkdownParser.Context, MarkdownParser.Context>(context => ObjectCreate(context), new WeakMap());

export function parse(source: string, opts: Options = {}, context?: MarkdownParser.Context): DocumentFragment {
  const url = headers(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() || '';
  context = context ? inherit(context) : {};
  context = ObjectAssign(context, opts, {
    host: opts.host ?? context.host ?? new URL(location.pathname, location.origin),
    url: url ? new URL(url, url) : context.url,
    id: opts.id ?? context.id,
    header: undefined,
    test: undefined,
    footnotes: undefined,
  });
  if (context.host?.origin === 'null') throw new Error(`Invalid host: ${context.host.href}`);
  const node = frag([...segment(normalize(source))]
    .reduce((acc, seg, i) =>
      push(acc, eval(i === 0 && opts.header !== false && header(seg, context!) || block(seg, context!), []))
    , []));
  if (opts.test) return node;
  for (const _ of footnote(node, opts.footnotes, context));
  for (const _ of figure(node, opts.footnotes, context));
  assert(opts.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  assert(opts.id !== '' || !opts.footnotes?.annotation.querySelector('[id], .index[href], .label[href]'));
  assert(opts.id !== '' || !opts.footnotes?.reference.querySelector('[id], .index[href], .label[href]'));
  return node;
}
