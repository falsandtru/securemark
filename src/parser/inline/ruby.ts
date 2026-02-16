import { RubyParser } from '../inline';
import { Backtrack } from '../context';
import { eval } from '../../combinator/data/parser';
import { inits, surround, setBacktrack, dup, lazy, bind } from '../../combinator';
import { unsafehtmlentity } from './htmlentity';
import { txt } from '../source';
import { isTightNodeStart } from '../visibility';
import { unshift, push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const ruby: RubyParser = lazy(() => bind(
  inits([
    dup(surround(
      '[', text, ']',
      false,
      ([, ns], rest) => {
        ns && ns.at(-1) === '' && ns.pop();
        return isTightNodeStart(ns) ? [ns, rest] : undefined;
      },
      undefined,
      [3 | Backtrack.ruby, 1 | Backtrack.bracket])),
    dup(surround(
      '(', text, ')',
      false, undefined, undefined,
      [3 | Backtrack.ruby, 1 | Backtrack.bracket])),
  ]),
  ([texts, rubies], rest, context) => {
    if (rubies === undefined) {
      const head = context.recent!.reduce((a, b) => a + b.length, rest.length);
      return void setBacktrack(context, [2 | Backtrack.ruby], head);
    }
    switch (true) {
      case rubies.length <= texts.length:
        return [[
          html('ruby', defrag(texts
            .reduce((acc, _, i) =>
              push(acc, unshift(
                [texts[i]],
                i < rubies.length && rubies[i]
                  ? [html('rp', '('), html('rt', rubies[i]), html('rp', ')')]
                  : [html('rt')]))
            , []))),
        ], rest];
      case texts.length === 1 && [...texts[0]].length >= rubies.length:
        return [[
          html('ruby', defrag([...texts[0]]
            .reduce((acc, _, i, texts) =>
              push(acc, unshift(
                [texts[i]],
                i < rubies.length && rubies[i]
                  ? [html('rp', '('), html('rt', rubies[i]), html('rp', ')')]
                  : [html('rt')]))
            , []))),
        ], rest];
      default:
        assert(rubies.length > 0);
        return [[
          html('ruby', defrag(unshift(
            [texts.join(' ')],
            [html('rp', '('), html('rt', rubies.join(' ').trim()), html('rp', ')')]))),
        ], rest];
    }
  }));

const text: RubyParser.TextParser = input => {
  const { context } = input;
  const { source } = context;
  const acc = [''];
  let state = false;
  for (let { position } = context; position < source.length; position = context.position) {
    if (!/^(?:\\[^\n]|[^\\[\](){}<>"$#\n])/.test(source.slice(position, position + 2))) break;
    assert(source[position] !== '\n');
    switch (source[position]) {
      case '&': {
        const result = unsafehtmlentity({ source: source.slice(position), context }) ?? txt(input)!;
        assert(result);
        acc[acc.length - 1] += eval(result)[0];
        continue;
      }
      default: {
        if (source[position].trimStart() === '') {
          state ||= acc.at(-1)!.trimStart() !== '';
          acc.push('');
          context.position += 1;
          continue;
        }
        const result = txt(input)!;
        assert(result);
        acc[acc.length - 1] += eval(result)[0] ?? source.slice(position, context.position);
        continue;
      }
    }
  }
  state ||= acc.at(-1)!.trimStart() !== '';
  return state
    ? [acc, source.slice(context.position)]
    : undefined;
};

//function attributes(texts: string[], rubies: string[]): Record<string, string> {
//  let attrs: Record<string, string> | undefined;
//  for (const ss of [texts, rubies]) {
//    for (let i = 0; i < ss.length; ++i) {
//      if (!ss[i].includes(Command.Error)) continue;
//      ss[i] = ss[i].replace(CmdRegExp.Error, '');
//      attrs ??= {
//        class: 'invalid',
//        ...invalid('ruby', ss === texts ? 'content' : 'argument', 'Invalid HTML entity'),
//      };
//    }
//  }
//  return attrs ?? {};
//}
