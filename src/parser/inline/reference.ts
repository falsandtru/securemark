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
    if (context.linebreak === 0) {
      return [[html('sup', attributes(ns), [html('span', defrag(trimBlankNodeEnd(ns)))])]];
    }
    else {
      const head = context.position - context.recent!.reduce((a, b) => a + b.length, 0);
      setBacktrack(context, [2 | Backtrack.link], head, 2);
    }
  },
  ([as, bs], context) => {
    const { source, position, recent = [] } = context;
    const head = position - recent.reduce((a, b) => a + b.length, 0);
    if (source[position] !== ']') {
      setBacktrack(context, [2 | Backtrack.bracket], head, 2);
    }
    else if (context.linebreak !== 0) {
      setBacktrack(context, [2 | Backtrack.link], head, 2);
    }
    else {
      assert(source[position] === ']');
      if (context.state! & State.annotation) {
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
        context.recent = recent;
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
        assert(context.state! ^ State.link);
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
        if (context.state! & State.annotation && next) {
          return [push(push(unshift(as, bs), eval(result)), eval(next))];
        }
      }
      context.position = position;
    }
    return context.state! & State.annotation
      ? [unshift(as, bs)]
      : undefined;
  },
  [3 | Backtrack.doublebracket, 1 | Backtrack.bracket])));

// Chicago-Style
const abbr: ReferenceParser.AbbrParser = surround(
  str('^'),
  union([str(/^(?=[A-Z])(?:[0-9A-Za-z]'?|(?:[-.:]|\.?\??,? ?)(?!['\-.:?, ]))+/)]),
  /^\|?(?=]])|^\|[^\S\n]*/,
  true,
  ([, ns], context) => {
    const { source, position } = context;
    if (!ns) return [['', context.recent!.join('')]];
    context.position += source.slice(position).match(blank.start)?.[0].length ?? 0;
    return [[Command.Escape, ns[0].trimEnd()]];
  },
  (_, context) => {
    context.position -= context.recent!.reduce((a, b) => a + b.length, 0);
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
