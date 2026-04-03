import { RubyParser } from '../inline';
import { Input, Backtrack } from '../context';
import { Parser, Result, List, Node } from '../../combinator/parser';
import { union, inits, always, backtrack, surround, setBacktrack, dup, lazy, bind } from '../../combinator';
import { unsafehtmlentity } from './htmlentity';
import { txt } from '../source';
import { isNonblankNodeStart } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const ruby: RubyParser = lazy(() => backtrack(bind(
  inits([
    dup(surround(
      '[', text, ']',
      false,
      [1 | Backtrack.common, 3 | Backtrack.ruby],
      ([, ns], _, output) => {
        ns && ns.last?.value === '' && ns.pop();
        return isNonblankNodeStart(ns)
          ? output.import(ns)
          : Result.fail;
      })),
    dup(surround(
      '(', text, ')',
      false)),
  ]),
  ([{ value: texts }, { value: rubies = undefined } = {}], input) => {
    if (rubies === undefined) {
      const head = input.position - input.range;
      return void setBacktrack(input, 2 | Backtrack.link | Backtrack.ruby, head);
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
            new Node(texts.foldl((acc, { value }) => acc ? acc + ' ' + value : value, '')),
            new Node(html('rp', '(')),
            new Node(html('rt', rubies.foldl((acc, { value }) => acc ? acc + ' ' + value : value, '').trim())),
            new Node(html('rp', ')')),
          ]))))),
        ]);
    }
  })));

const delimiter = /[$"`\[\](){}<>（）［］｛｝|]|\\?\r?\n/y;

interface Memory {
  position: number;
  state: boolean;
  nodes: List<Node<string>>;
}
const text: RubyParser.TextParser = always<Parser<string, Input<Memory>>>([
  (input, output) => {
    input.sequential = true;
    input.memory = {
      position: 0,
      state: false,
      nodes: new List([new Node('')]),
    };
    return output.context;
  },
  () => loop,
  (input, output) => {
    const { memory } = input;
    input.sequential = false;
    return memory.state || memory.nodes.last!.value.trimStart() !== ''
      ? output.import(memory.nodes)
      : undefined;
  },
]);
const loop: Result<string, Input<Memory>> = [
  (input, output) => {
    const { source, memory } = input;
    for (let { position } = input; ; position = input.position) {
      if (position === source.length) return Result.skip;
      delimiter.lastIndex = position;
      if (delimiter.test(source)) return Result.skip;
      assert(source[position] !== '\n');
      if (source[position].trimStart() !== '') break;
      memory.state ||= memory.nodes.last!.value.trimStart() !== '';
      memory.nodes.push(new Node(''));
      input.position += 1;
    }
    memory.position = input.position;
    return output.context;
  },
  union([unsafehtmlentity, txt]),
  (input, output) => {
    assert(output.state);
    input.memory.nodes.last!.value += output.peek().pop()?.value ?? '';
    assert(output.peek().length === 0);
    return loop;
  },
];

function* zip<N extends Node<unknown>>(a: List<N>, b: List<N>): Iterable<[N | undefined, N | undefined]> {
  const ia = a[Symbol.iterator]();
  const ib = b[Symbol.iterator]();
  for (; ;) {
    const ra = ia.next();
    const rb = ib.next();
    if (ra.done) break;
    yield [ra.value, rb.value];
  }
}
