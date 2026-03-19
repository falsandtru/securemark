import { SidefenceParser } from '../block';
import { Recursion } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, block, focus, rewrite, open, convert, lazy, fmap } from '../../combinator';
import { autolink } from '../autolink';
import { contentline } from '../source';
import { unwrap, invalid } from '../util';
import { html, define, defrag } from 'typed-dom/dom';

export const sidefence: SidefenceParser = lazy(() => block(fmap(focus(
  /\|+ [^\r\n]*(?:\r?\n\|+(?=$|[ \r\n])[^\r\n]*)*(?:$|\r?\n)/y,
  union([source])),
  ([{ value }]) => new List([
    new Node(define(value, {
      class: 'invalid',
      ...invalid('sidefence', 'syntax', 'Reserved syntax'),
    })),
  ]))));

const opener = /(?=\|\|+(?:$|[ \r\n]))/y;
const indent = open(opener, some(contentline, /\|(?:$|[ \r\n])/y));
const unindent = (source: string) => source.replace(/(?<=^|\n)\|(?: |(?=\|*(?:$|[ \r\n])))|\r?\n$/g, '');

const source: SidefenceParser.SourceParser = lazy(() => fmap(
  recursion(Recursion.block, some(union([
    rewrite(
      indent,
      convert(unindent, source)),
    rewrite(
      some(contentline, opener),
      convert(unindent, fmap(autolink, ns => new List([new Node(html('pre', defrag(unwrap(ns))))])))),
  ]))),
  ns => new List([new Node(html('blockquote', unwrap(ns)))])));
