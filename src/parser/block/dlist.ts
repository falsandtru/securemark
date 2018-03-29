import { DListParser } from '../block';
import { combine, inits, some, surround, transform, rewrite, trim, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { indexer, defineIndex } from './indexer';
import { inline } from '../inline';
import { unescsource } from '../source/unescapable';
import { compress } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

const syntax = /^~(?=\s|$)/;

export const dlist: DListParser = block(transform(build(() =>
  some(inits<DListParser>([
    some(term),
    some(desc, syntax)
  ]))),
  (es, rest) => [
    [html('dl', es[es.length - 1].tagName.toLowerCase() === 'dt' ? concat(es, [html('dd')]) : es)],
    rest
  ]));

const term = line(transform(build(() =>
  surround(syntax, compress(trim(some(combine<[typeof indexer, typeof inline]>([indexer, inline])))), '')),
  (ns, rest) => {
    const dt = html('dt', ns);
    void defineIndex(dt);
    return [[dt], rest];
  }
), true, true);

const desc = block(transform(build(() =>
  rewrite(
    surround(/^:(?=\s|$)|/, some(line(some(unescsource), true, true), /^[~:](?:\s|$)/), ''),
    surround(/^:(?=\s|$)|/, trim(some(combine<[typeof inline]>([inline]))), ''))),
  (ns, rest) =>
    [[html('dd', ns)], rest]
), false);
