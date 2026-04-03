import { SidefenceParser } from '../block';
import { Input, Recursion } from '../context';
import { List, Node } from '../../combinator/parser';
import { union, some, force, recursion, scope, block, line, validate, rewrite, open, lazy, fmap } from '../../combinator';
import { autolink } from '../autolink';
import { contentline } from '../source';
import { unwrap, invalid } from '../util';
import { html, define, defrag } from 'typed-dom/dom';

export const sidefence: SidefenceParser = lazy(() => validate(/\|+ /y, block(fmap(
  union([source]),
  ([{ value }]) => new List([
    new Node(define(value, {
      class: 'invalid',
      ...invalid('sidefence', 'syntax', 'Reserved syntax'),
    })),
  ])))));

const opener = /(?=\|\|+(?:$|[ \r\n]))/y;
const indent = open(opener, some(contentline, /\|(?:$|[ \r\n])/y));
const unindent = ({ source }: Input) => source.replace(/(?<=^|\n)\|(?: |(?=\|*(?:$|[ \r\n])))|\r?\n$/g, '');

const source: SidefenceParser.SourceParser = lazy(() => fmap(
  recursion(Recursion.block, some(union([
    rewrite(
      indent,
      scope(unindent, source, false)),
    rewrite(
      some(validate(/\|(?:$|[ \r\n])/y, contentline), opener),
      scope(unindent, force(fmap(autolink, ns => new List([new Node(html('pre', defrag(unwrap(ns))))]))), false)),
    line(({source}, output) => output.append(
      new Node(html('pre',
        {
          class: 'invalid',
          ...invalid('sidefence', 'syntax', 'Missing the start symbol "|"'),
        },
        source.trimEnd())))),
  ]))),
  ns => new List([new Node(html('blockquote', unwrap(ns)))])));
