import { HeadingParser } from '../block';
import { Segment, State } from '../context';
import { List, Node } from '../../combinator/parser';
import { union, some, state, block, line, focus, rewrite, open, fmap, firstline } from '../../combinator';
import { inline, indexee, indexer, dataindex } from '../inline';
import { str, strs } from '../source';
import { visualize, trimBlank } from '../visibility';
import { unwrap, invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const segment: HeadingParser.SegmentParser = block(focus(
  /#+ +\S[^\r\n]*(?:\r?\n#+(?=$|[ \r\n])[^\r\n]*)*(?:$|\r?\n(?=[^\S\r\n]*(?:$|\r?\n)))/y,
  (input, output) => {
    const { source, range } = input;
    const acc = new List<Node<string>>();
    for (const len = input.position + range; input.position < len;) {
      const line = firstline(source, input.position);
      acc.push(new Node(line));
      input.position += line.length;
    }
    return output.import(acc);
  }, false), true, Segment.heading);

export const heading: HeadingParser = block(rewrite(segment,
  // その他の表示制御は各所のCSSで行う。
  state(State.annotation | State.reference | State.index | State.label | State.link,
  indexee(fmap(union([
    open(
      strs('#', 2),
      line(visualize(trimBlank(some(union([indexer, inline])))), true)),
    open(
      str('#'),
      state(State.linkers,
      line(visualize(trimBlank(some(union([indexer, inline])))))), true),
  ]),
  (nodes, { source, position, range }) => {
    const [h, ...ns] = unwrap(nodes) as [string, ...(HTMLElement | string)[]];
    return new List([
      h.length <= 6
        ? new Node(html(`h${h.length as 1}`, { 'data-index': dataindex(nodes) }, defrag(ns)))
        : new Node(html(`h6`,
            {
              class: 'invalid',
              ...invalid('heading', 'syntax', 'Heading level must be up to 6'),
            },
            source.slice(position - range, position)))
    ]);
  })))));
