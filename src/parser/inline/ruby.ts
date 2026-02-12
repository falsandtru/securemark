import { RubyParser } from '../inline';
import { Backtrack, Command, CmdRegExp } from '../context';
import { eval, exec } from '../../combinator/data/parser';
import { inits, surround, setBacktrack, dup, lazy, bind } from '../../combinator';
import { unsafehtmlentity } from './htmlentity';
import { text as txt, str } from '../source';
import { isTightNodeStart } from '../visibility';
import { invalid } from '../util';
import { unshift, push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const ruby: RubyParser = lazy(() => bind(
  inits([
    dup(surround(
      '[', str(/^(?:\\[^\n]|[^\\[\](){}<>"\n])+/), ']',
      false,
      ([, [source]], rest, context) => {
        const ns = eval(text({ source, context }), [undefined])[0];
        ns && ns.at(-1) === '' && ns.pop();
        return ns && isTightNodeStart(ns) ? [ns, rest] : undefined;
      },
      undefined,
      [3 | Backtrack.ruby | 1, Backtrack.link, 1 | Backtrack.bracket])),
    dup(surround(
      '(', str(/^(?:\\[^\n]|[^\\[\](){}<>"\n])+/), ')',
      false,
      ([, [source]], rest, context) => {
        const ns = eval(text({ source, context }), [undefined])[0];
        return ns && [ns, rest];
      },
      undefined,
      [3 | Backtrack.ruby | 1, Backtrack.link, 1 | Backtrack.bracket])),
  ]),
  ([texts, rubies], rest, context) => {
    if (rubies === undefined) {
      return void setBacktrack(context, [2 | Backtrack.ruby], context.recent!.reduce((a, b) => a + b.length, 0));
    }
    switch (true) {
      case rubies.length <= texts.length:
        return [[
          html('ruby', attributes(texts, rubies), defrag(texts
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
          html('ruby', attributes(texts, rubies), defrag([...texts[0]]
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
          html('ruby', attributes(texts, rubies), defrag(unshift(
            [texts.join(' ')],
            [html('rp', '('), html('rt', rubies.join(' ').trim()), html('rp', ')')]))),
        ], rest];
    }
  }));

const text: RubyParser.TextParser = ({ source, context }) => {
  const acc = [''];
  while (source !== '') {
    assert(source[0] !== '\n');
    switch (source[0]) {
      // @ts-expect-error
      case '&': {
        const result = unsafehtmlentity({ source, context });
        if (result) {
          acc[acc.length - 1] += eval(result)[0];
          source = exec(result, source.slice(1));
          continue;
        }
        // fallthrough
      }
      default: {
        if (source[0].trimStart() === '') {
          acc.push('');
          source = source.slice(1);
          continue;
        }
        const result = txt({ source, context })!;
        assert(result);
        acc[acc.length - 1] += eval(result)[0] ?? source.slice(0, source.length - exec(result).length);
        source = exec(result);
        continue;
      }
    }
  }
  return acc.join('').trimStart()
    ? [[acc], '']
    : undefined;
};

function attributes(texts: string[], rubies: string[]): Record<string, string> {
  let attrs: Record<string, string> | undefined;
  for (const ss of [texts, rubies]) {
    for (let i = 0; i < ss.length; ++i) {
      if (!ss[i].includes(Command.Error)) continue;
      ss[i] = ss[i].replace(CmdRegExp.Error, '');
      attrs ??= {
        class: 'invalid',
        ...invalid('ruby', ss === texts ? 'content' : 'argument', 'Invalid HTML entity'),
      };
    }
  }
  return attrs ?? {};
}
