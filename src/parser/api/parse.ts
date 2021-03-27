import { undefined, location } from 'spica/global';
import { ObjectAssign, ObjectCreate } from 'spica/alias';
import { ParserOptions } from '../../..';
import { MarkdownParser } from '../../../markdown';
import { eval } from '../../combinator/data/parser';
import { header } from '../header';
import { block } from '../block';
import { segment, SEGMENT_LENGTH_LIMIT } from '../segment';
import { normalize } from './normalize';
import { headers } from './header';
import { figure } from '../function/figure';
import { footnote } from '../function/footnote';
import { frag } from 'typed-dom';
import { memoize } from 'spica/memoize';
import { ReadonlyURL } from 'spica/url';
import { push } from 'spica/array';

interface Options extends ParserOptions {
  readonly header?: boolean;
  readonly test?: boolean;
}

const inherit = memoize<MarkdownParser.Context, MarkdownParser.Context>(context => ObjectCreate(context), new WeakMap());
const inherit2 = memoize<MarkdownParser.Context, (url: string) => MarkdownParser.Context>(context => memoize((_: string) => ObjectCreate(context)), new WeakMap());

export function parse(source: string, opts: Options = {}, context?: MarkdownParser.Context): DocumentFragment {
  if (source.length > SEGMENT_LENGTH_LIMIT) throw new Error(`Too large input over ${SEGMENT_LENGTH_LIMIT.toLocaleString('en')} in length.`);
  const url = headers(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() ?? '';
  source = !context ? normalize(source) : source;
  assert(!context?.delimiters);
  context = context && url === '' && context.id === opts.id
    ? context
    : ObjectAssign(context ? url ? inherit2(context)(url) : inherit(context) : {}, opts, {
        host: opts.host ?? context?.host ?? new ReadonlyURL(location.pathname, location.origin),
        url: url ? new ReadonlyURL(url) : context?.url,
        id: opts.id ?? context?.id,
        footnotes: undefined,
        header: undefined,
        test: undefined,
      });
  if (context.host?.origin === 'null') throw new Error(`Invalid host: ${context.host.href}`);
  const es: HTMLElement[] = [];
  let head = opts.header ?? true;
  for (const seg of segment(source)) {
    push(es, eval(head && header(seg, context) || block(seg, context), []));
    head = false;
  }
  const node = frag(es);
  assert(opts.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  if (opts.test) return node;
  for (const _ of footnote(node, opts.footnotes, context));
  for (const _ of figure(node, opts.footnotes, context));
  assert(opts.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  assert(opts.id !== '' || !opts.footnotes?.annotation.querySelector('[id], .index[href], .label[href]'));
  assert(opts.id !== '' || !opts.footnotes?.reference.querySelector('[id], .index[href], .label[href]'));
  return node;
}
