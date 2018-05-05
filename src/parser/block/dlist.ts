import { DListParser } from '../block';
import { union, inits, some, surround, transform, rewrite, trim, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { indexer, defineIndex } from './indexer';
import { inline } from '../inline';
import { unescsource } from '../source/unescapable';
import { compress } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

export const dlist: DListParser = block(transform(build(() =>
  some(inits<DListParser>([
    some(term),
    some(desc)
  ]))),
  (es, rest) => [
    [html('dl', es[es.length - 1].tagName.toLowerCase() === 'dt' ? concat(es, [html('dd')]) : es)],
    rest
  ]));

const term: DListParser.TermParser = line(transform(build(() =>
  surround<DListParser.TermParser>(/^~(?=\s|$)/, compress(trim(some(union([indexer, inline])))), '', false)),
  (ns, rest) => {
    const dt = html('dt', ns);
    void defineIndex(dt);
    if (dt.querySelector('.media')) return;
    return [[dt], rest];
  }
), true, true);

const desc: DListParser.DescriptionParser = block(transform(build(() =>
  rewrite<DListParser.DescriptionParser>(
    surround(/^:(?=\s|$)|/, some(line(some(unescsource), true, true), /^[~:](?:\s|$)/), '', false),
    surround(/^:(?=\s|$)|/, trim(some(union([inline]))), '', false))),
  (ns, rest) =>
    [[html('dd', ns)], rest]
), false);
