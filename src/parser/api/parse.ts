import { location } from 'spica/global';
import { ParserOptions } from '../../..';
import { eval } from '../../combinator';
import { header } from '../header';
import { block } from '../block';
import { segment } from '../segment';
import { normalize } from './normalize';
import { headers } from '../api/header';
import { figure } from '../../util/figure';
import { footnote } from '../../util/footnote';
import { URL } from 'spica/url';
import { push } from 'spica/array';
import { frag } from 'typed-dom';

interface Options extends ParserOptions {
  readonly url?: global.URL;
  readonly test?: boolean;
}

export function parse(source: string, opts: Options = {}): DocumentFragment {
  opts = opts.host ? opts : { ...opts, host: new URL(location.pathname, location.origin) };
  if (opts.host?.origin === 'null') throw new Error(`Invalid host: ${opts.host.href}`);
  const url = headers(source).find(field => field.toLowerCase().startsWith('url:'))?.slice(4).trim() || '';
  opts = url ? { ...opts, url: new URL(url, url) } : opts;
  //assert(Object.freeze(opts));
  const node = frag([...segment(normalize(source))]
    .reduce((acc, seg, i) =>
      push(acc, eval(i === 0 && header(seg, opts) || block(seg, opts), []))
    , []));
  if (opts.test && opts.hasOwnProperty('test')) return node;
  for (const _ of footnote(node, opts.footnotes, opts));
  for (const _ of figure(node, opts.footnotes, opts));
  assert(opts.id !== '' || !node.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
  assert(opts.id !== '' || !opts.footnotes?.annotation.querySelector('[id], .index[href], .label[href]'));
  assert(opts.id !== '' || !opts.footnotes?.reference.querySelector('[id], .index[href], .label[href]'));
  return node;
}
