import { ReferenceParser } from '../inline';
import { State, Backtrack, Command } from '../context';
import { eval } from '../../combinator/data/parser';
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
  ([, ns], context) => {
    const { position, range = 0, linebreak = 0 } = context;
    if (linebreak === 0) {
      return [[html('sup', attributes(ns), [html('span', defrag(trimBlankNodeEnd(ns)))])]];
    }
    else {
      const head = position - range!;
      setBacktrack(context, [2 | Backtrack.link], head, 2);
    }
  },
  ([as, bs], context) => {
    const { source, position, range = 0, linebreak = 0, state = 0 } = context;
    const head = position - range;
    if (source[position] !== ']') {
      setBacktrack(context, [2 | Backtrack.bracket], head, 2);
    }
    else if (linebreak !== 0) {
      setBacktrack(context, [2 | Backtrack.link], head, 2);
    }
    else {
      assert(source[position] === ']');
      if (state & State.annotation) {
        push(bs, [source[position]]);
      }
      context.position += 1;
      let result: ReturnType<typeof textlink>;
      if (source[context.position] !== '{') {
        setBacktrack(context, [2 | Backtrack.link], head + 1);
        result = [[]];
      }
      else {
        result = !isBacktrack(context, [1 | Backtrack.link])
          ? textlink({ context })
          : undefined;
        context.range = range;
        if (!result) {
          setBacktrack(context, [2 | Backtrack.link], head + 1);
          result = [[]];
        }
      }
      assert(result);
      if (context.position === source.length) {
        setBacktrack(context, [2 | Backtrack.link], head);
      }
      else {
        assert(state ^ State.link);
        const next = surround(
          '',
          some(inline, ']', [[']', 1]]),
          str(']'),
          true,
          ([, cs = [], ds]) =>
            [push(cs, ds)],
          ([, cs = []]) => {
            setBacktrack(context, [2 | Backtrack.link], head);
            return [cs];
          })
          ({ context });
        if (state & State.annotation && next) {
          return [push(push(unshift(as, bs), eval(result)), eval(next))];
        }
      }
      context.position = position;
    }
    return state & State.annotation
      ? [unshift(as, bs)]
      : undefined;
  },
  [3 | Backtrack.doublebracket, 1 | Backtrack.bracket])));

// Chicago-Style
const abbr: ReferenceParser.AbbrParser = surround(
  str('^'),
  union([str(/^(?=[A-Z])(?:[0-9A-Za-z]'?|(?:[-.:]|\.?\??,? ?)(?!['\-.:?, ]))+/)]),
  /^\|?(?=]])|^\|/,
  true,
  ([, ns], context) => {
    const { source, position, range = 0 } = context;
    if (!ns) return [['', source.slice(position - range, source[position - 1] === '|' ? position - 1 : position)]];
    context.position += source.slice(position).match(blank.start)?.[0].length ?? 0;
    return [[Command.Escape, ns[0].trimEnd()]];
  },
  (_, context) => {
    context.position -= context.range!;
    return [['']];
  });

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
