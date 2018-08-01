import { DListParser } from '../block';
import { union, inits, some, surround, verify, fmap, rewrite, trim, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { indexer, defineIndex } from './indexer';
import { inline } from '../inline';
import { compress, hasMedia } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

export const dlist: DListParser = block(fmap(build(() =>
  some(inits<DListParser>([
    some(term),
    some(desc)
  ]))),
  es => [html('dl', es.length > 0 && es[es.length - 1].tagName.toLowerCase() === 'dt' ? concat(es, [html('dd')]) : es)]));

const term: DListParser.TermParser = line(verify(fmap<DListParser.TermParser>(build(() =>
  surround(/^~(?=\s|$)/, compress(trim(some(union([indexer, inline])))), '', false)),
  ns => {
    const dt = html('dt', ns);
    void defineIndex(dt);
    return [dt];
  }
), ([el]) => !hasMedia(el)), true, true);

const desc: DListParser.DescriptionParser = block(fmap<DListParser.DescriptionParser>(build(() =>
  rewrite(
    surround(/^:(?=\s|$)|/, some(line(() => [[], ''], true, true), /^[~:](?:\s|$)/), '', false),
    surround(/^:(?=\s|$)|/, trim(some(union([inline]))), '', false))),
  ns => [html('dd', ns)]
), false);
