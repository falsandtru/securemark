import { RubyParser } from '../inline';
import { Backtrack } from '../context';
import { List, Data } from '../../combinator/data/parser';
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
      ([, ns]) => {
        ns && ns.last?.value === '' && ns.pop();
        return isTightNodeStart(ns) ? ns : undefined;
      },
      undefined,
      [1 | Backtrack.bracket, 3 | Backtrack.ruby])),
    dup(surround(
      '(', text, ')',
      false, undefined, undefined,
      [1 | Backtrack.bracket, 3 | Backtrack.ruby])),
  ]),
  ([{ value: texts }, { value: rubies = undefined } = {}], context) => {
    if (rubies === undefined) {
      const head = context.position - context.range!;
      return void setBacktrack(context, [2 | Backtrack.ruby], head);
    }
    switch (true) {
      case texts.length >= rubies.length:
        return new List([
          new Data(html('ruby', defrag(unwrap([...zip(texts, rubies)]
            .reduce((acc, [{ value: text = '' } = {}, { value: ruby = '' } = {}]) =>
              acc.import(
                ruby
                  ? new List([new Data(text), new Data(html('rp', '(')), new Data(html('rt', ruby)), new Data(html('rp', ')'))])
                  : new List([new Data(text), new Data(html('rt'))]))
            , new List<Data<string | HTMLElement>>()))))),
        ]);
      case texts.length === 1 && [...texts.head!.value].length >= rubies.length:
        return new List([
          new Data(html('ruby', defrag(unwrap([...zip(new List([...texts.head!.value].map(char => new Data(char))), rubies)]
            .reduce((acc, [{ value: text = '' } = {}, { value: ruby = '' } = {}]) =>
              acc.import(
                ruby
                  ? new List([new Data(text), new Data(html('rp', '(')), new Data(html('rt', ruby)), new Data(html('rp', ')'))])
                  : new List([new Data(text), new Data(html('rt'))]))
            , new List<Data<string | HTMLElement>>()))))),
        ]);
      default:
        assert(rubies.length > 0);
        return new List([
          new Data(html('ruby', defrag(unwrap(new List<Data<string | HTMLElement>>([
            new Data(texts.foldr(({ value }, acc) => value + ' ' + acc, '').slice(0, -1)),
            new Data(html('rp', '(')),
            new Data(html('rt', rubies.foldr(({ value }, acc) => value + ' ' + acc, '').trim())),
            new Data(html('rp', ')')),
          ]))))),
        ]);
    }
  }));

const delimiter = /[$"`\[\](){}<>（）［］｛｝]|\\?\n/y;

const text: RubyParser.TextParser = input => {
  const { context } = input;
  const { source } = context;
  const acc = new List([new Data('')]);
  let state = false;
  context.sequential = true;
  for (let { position } = context; position < source.length; position = context.position) {
    delimiter.lastIndex = position;
    if (delimiter.test(source)) break;
    assert(source[position] !== '\n');
    switch (source[position]) {
      case '&': {
        const result = unsafehtmlentity(input) ?? txt(input)!;
        assert(result);
        acc.last!.value += result.head!.value;
        continue;
      }
      default: {
        if (source[position].trimStart() === '') {
          state ||= acc.last!.value.trimStart() !== '';
          acc.push(new Data(''));
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
