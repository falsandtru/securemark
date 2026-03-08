import { RubyParser } from '../inline';
import { Backtrack } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { inits, surround, setBacktrack, dup, lazy, bind } from '../../combinator';
import { unsafehtmlentity } from './htmlentity';
import { txt } from '../source';
import { isTightNodeStart } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const ruby: RubyParser = lazy(() => bind(
  inits([
    dup(surround(
      '[', text, ']',
      false,
      [1 | Backtrack.common, 3 | Backtrack.ruby],
      ([, ns]) => {
        ns && ns.last?.value === '' && ns.pop();
        return isTightNodeStart(ns) ? ns : undefined;
      })),
    dup(surround(
      '(', text, ')',
      false,
      [3 | Backtrack.ruby])),
  ]),
  ([{ value: texts }, { value: rubies = undefined } = {}], context) => {
    if (rubies === undefined) {
      const head = context.position - context.range!;
      return void setBacktrack(context, 2 | Backtrack.ruby, head);
    }
    switch (true) {
      case texts.length >= rubies.length:
        return new List([
          new Node(html('ruby', defrag(unwrap([...zip(texts, rubies)]
            .reduce((acc, [{ value: text = '' } = {}, { value: ruby = '' } = {}]) =>
              acc.import(
                ruby
                  ? new List([new Node(text), new Node(html('rp', '(')), new Node(html('rt', ruby)), new Node(html('rp', ')'))])
                  : new List([new Node(text), new Node(html('rt'))]))
            , new List<Node<string | HTMLElement>>()))))),
        ]);
      case texts.length === 1 && [...texts.head!.value].length >= rubies.length:
        return new List([
          new Node(html('ruby', defrag(unwrap([...zip(new List([...texts.head!.value].map(char => new Node(char))), rubies)]
            .reduce((acc, [{ value: text = '' } = {}, { value: ruby = '' } = {}]) =>
              acc.import(
                ruby
                  ? new List([new Node(text), new Node(html('rp', '(')), new Node(html('rt', ruby)), new Node(html('rp', ')'))])
                  : new List([new Node(text), new Node(html('rt'))]))
            , new List<Node<string | HTMLElement>>()))))),
        ]);
      default:
        assert(rubies.length > 0);
        return new List([
          new Node(html('ruby', defrag(unwrap(new List<Node<string | HTMLElement>>([
            new Node(texts.foldr(({ value }, acc) => value + ' ' + acc, '').slice(0, -1)),
            new Node(html('rp', '(')),
            new Node(html('rt', rubies.foldr(({ value }, acc) => value + ' ' + acc, '').trim())),
            new Node(html('rp', ')')),
          ]))))),
        ]);
    }
  }));

const delimiter = /[$"`\[\](){}<>（）［］｛｝|]|\\?\n/y;

const text: RubyParser.TextParser = input => {
  const { context } = input;
  const { source } = context;
  const acc = new List([new Node('')]);
  let state = false;
  context.sequential = true;
  for (let { position } = context; position < source.length; position = context.position) {
    delimiter.lastIndex = position;
    if (delimiter.test(source)) break;
    assert(source[position] !== '\n');
    switch (source[position]) {
      case '&': {
        const result = source[position + 1] !== ' '
          ? unsafehtmlentity(input) ?? txt(input)!
          : txt(input)!;
        assert(result);
        acc.last!.value += result.head!.value;
        continue;
      }
      default: {
        if (source[position].trimStart() === '') {
          state ||= acc.last!.value.trimStart() !== '';
          acc.push(new Node(''));
          context.position += 1;
          continue;
        }
        const result = txt(input)!;
        assert(result);
        acc.last!.value += result.head?.value ?? '';
        continue;
      }
    }
  }
  context.sequential = false;
  state ||= acc.last!.value.trimStart() !== '';
  return state
    ? acc
    : undefined;
};

function* zip<N extends List.Node>(a: List<N>, b: List<N>): Iterable<[N | undefined, N | undefined]> {
  const ia = a[Symbol.iterator]();
  const ib = b[Symbol.iterator]();
  for (; ;) {
    const ra = ia.next();
    const rb = ib.next();
    if (ra.done) break;
    yield [ra.value, rb.value];
  }
}
