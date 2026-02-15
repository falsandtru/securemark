import { ReferenceParser } from '../inline';
import { State, Backtrack, Command } from '../context';
import { eval, exec } from '../../combinator/data/parser';
import { union, subsequence, some, precedence, state, constraint, surround, isBacktrack, setBacktrack, lazy } from '../../combinator';
import { inline } from '../inline';
import { textlink } from './link';
import { str } from '../source';
import { blank, trimBlankStart, trimBlankNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';
import { unshift, push } from 'spica/array';
import { invalid } from '../util';

export const reference: ReferenceParser = lazy(() => constraint(State.reference, surround(
  str('[['),
  precedence(1, state(State.annotation | State.reference,
  subsequence([
    abbr,
    trimBlankStart(some(inline, ']', [[']', 1]])),
  ]))),
  ']]',
  false,
  ([, ns], rest, context) => {
    if (context.linebreak === 0) {
      return [[html('sup', attributes(ns), [html('span', defrag(trimBlankNodeEnd(ns)))])], rest];
    }
    else {
      const head = context.recent!.reduce((a, b) => a + b.length, rest.length);
      setBacktrack(context, [2 | Backtrack.link], head, 2);
    }
  },
  ([as, bs], rest, context) => {
    const { recent } = context;
    const head = recent!.reduce((a, b) => a + b.length, rest.length);
    if (rest[0] !== ']') {
      setBacktrack(context, [2 | Backtrack.bracket], head, 2);
    }
    else if (context.linebreak! > 0) {
      setBacktrack(context, [2 | Backtrack.link], head, 2);
    }
    else {
      assert(rest[0] === ']');
      if (context.state! & State.annotation) {
        push(bs, [rest[0]]);
      }
      const source = rest.slice(1);
      let result: ReturnType<typeof textlink>;
      if (source[0] !== '{') {
        setBacktrack(context, [2 | Backtrack.link], head - 1);
        result = [[], source];
      }
      else {
        assert(source.length > 0);
        result = !isBacktrack(context, [1 | Backtrack.link], source)
          ? textlink({ source, context })
          : undefined;
        context.recent = recent;
        if (!result) {
          setBacktrack(context, [2 | Backtrack.link], head - 1);
          result = [[], source];
        }
      }
      assert(result);
      if (exec(result) === '') {
        setBacktrack(context, [2 | Backtrack.link], head);
      }
      else {
        assert(context.state! ^ State.link);
        const next = surround(
          '',
          some(inline, ']', [[']', 1]]),
          str(']'),
          true,
          ([, cs = [], ds], rest) =>
            [push(cs, ds), rest],
          ([, cs = []], rest) => {
            setBacktrack(context, [2 | Backtrack.link], head);
            return [cs, rest];
          })
          ({ source: exec(result), context });
        if (context.state! & State.annotation && next) {
          push(push(bs, eval(result)), eval(next));
          rest = exec(next);
        }
      }
    }
    return context.state! & State.annotation
      ? [unshift(as, bs), rest]
      : undefined;
  },
  [3 | Backtrack.doublebracket, 1 | Backtrack.bracket])));

// Chicago-Style
const abbr: ReferenceParser.AbbrParser = surround(
  str('^'),
  union([str(/^(?=[A-Z])(?:[0-9A-Za-z]'?|(?:[-.:]|\.?\??,? ?)(?!['\-.:?, ]))+/)]),
  /^\|?(?=]])|^\|[^\S\n]*/,
  true,
  ([, ns], rest) => ns ? [[Command.Escape, ns[0].trimEnd()], rest.replace(blank.start, '')] : [[''], `^${rest}`],
  ([as, bs = ['']], rest) => [[''], as[0] + bs[0] + rest]);

function attributes(ns: (string | HTMLElement)[]): Record<string, string | undefined> {
  switch (ns[0]) {
    case '':
      return { class: 'invalid', ...invalid('reference', 'syntax', 'Invalid abbreviation') };
    case Command.Escape:
      const abbr = ns[1] as string;
      ns[0] = ns[1] = '';
      return { class: 'reference', 'data-abbr': abbr };
    default:
      return { class: 'reference' };
  }
}
