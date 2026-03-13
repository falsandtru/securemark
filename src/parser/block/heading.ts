import { HeadingParser } from '../block';
import { Segment, State } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, state, block, line, focus, rewrite, open, fmap, firstline } from '../../combinator';
import { inline, indexee, indexer, dataindex } from '../inline';
import { str, strs } from '../source';
import { visualize, trimBlank } from '../visibility';
import { unwrap, invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const segment: HeadingParser.SegmentParser = block(focus(
  /#+ +\S[^\n]*(?:\n#+(?=$|[ \n])[^\n]*)*(?:$|\n)/y,
  input => {
    const { context } = input;
    const { source, range } = context;
    const acc = new List<Node<string>>();
    for (const len = context.position + range; context.position < len;) {
      const line = firstline(source, context.position);
      acc.push(new Node(line));
      context.position += line.length;
    }
    return acc;
  }, false), true, Segment.heading);

export const heading: HeadingParser = block(rewrite(segment,
  // その他の表示制御は各所のCSSで行う。
  state(State.annotation | State.reference | State.index | State.label | State.link,
  line(indexee(fmap(union([
    open(
      strs('#', 2),
      visualize(trimBlank(some(union([indexer, inline])))), true),
    open(
      str('#'),
      state(State.linkers,
      visualize(trimBlank(some(union([indexer, inline]))))), true),
  ]),
  (nodes, context) => {
    const [h, ...ns] = unwrap(nodes) as [string, ...(HTMLElement | string)[]];
    return new List([
      h.length <= 6
        ? new Node(html(`h${h.length as 1}`, { 'data-index': dataindex(nodes) }, defrag(ns)))
        : new Node(html(`h6`, {
          class: 'invalid',
          ...invalid('heading', 'syntax', 'Heading level must be up to 6'),
        }, context.source.slice(context.position - context.range, context.position)))
    ]);
  }))))));
