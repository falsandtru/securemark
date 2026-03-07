import { ReferenceParser } from '../inline';
import { State, Backtrack, Command } from '../context';
import { List, Data } from '../../combinator/data/parser';
import { union, subsequence, some, precedence, state, constraint, surround, isBacktrack, setBacktrack, lazy } from '../../combinator';
import { inline } from '../inline';
import { textlink } from './link';
import { str } from '../source';
import { trimBlankStart, trimBlankNodeEnd } from '../visibility';
import { unwrap, invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const reference: ReferenceParser = lazy(() => constraint(State.reference, surround(
  str('[['),
  precedence(1, state(State.annotation | State.reference,
  subsequence([
    abbr,
    trimBlankStart(some(inline, ']', [[']', 1]])),
  ]))),
  ']]',
  false,
  [1 | Backtrack.common, 3 | Backtrack.doublebracket],
  ([, ns], context) => {
    const { position, range = 0, linebreak = 0 } = context;
    if (linebreak === 0) {
      return new List([new Data(html('sup', attributes(ns), [html('span', defrag(unwrap(trimBlankNodeEnd(ns))))]))]);
    }
    else {
      const head = position - range;
      setBacktrack(context, [2 | Backtrack.link], head, 2);
    }
  },
  ([as, bs], context) => {
    if (!bs) return;
    const { source, position, range = 0, linebreak = 0, state = 0 } = context;
    const head = position - range;
    if (source[position] !== ']') {
      setBacktrack(context, [2 | Backtrack.common], head, 2);
    }
    else if (linebreak !== 0) {
      setBacktrack(context, [2 | Backtrack.link, 2 | Backtrack.ruby], head, 2);
    }
    else {
      assert(source[position] === ']');
      if (state & State.annotation) {
        bs.push(new Data(source[position]));
      }
      context.position += 1;
      let result: ReturnType<typeof textlink>;
      if (source[context.position] !== '{') {
        setBacktrack(context, [2 | Backtrack.link], head + 1);
        result = new List();
      }
      else {
        result = !isBacktrack(context, [1 | Backtrack.link])
          ? textlink({ context })
          : undefined;
        context.range = range;
        if (!result) {
          setBacktrack(context, [2 | Backtrack.link], head + 1);
          result = new List();
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
          true, [],
          ([, cs = new List(), ds]) =>
            cs.import(ds),
          ([, cs = new List()]) => {
            setBacktrack(context, [2 | Backtrack.link], head);
            return cs;
          })
          ({ context });
        if (state & State.annotation && next) {
          return (as as List<Data<string | HTMLElement>>).import(bs).import(result).import(next);
        }
      }
      context.position = position;
    }
    return state & State.annotation
      ? as.import(bs as List<Data<string>>)
      : undefined;
  })));

// Chicago-Style
const abbr: ReferenceParser.AbbrParser = surround(
  str('^'),
  union([str(/(?=[A-Z])(?:[0-9A-Za-z]'?|(?:[-.:]|\.?\??,? ?)(?!['\-.:?, ]))+/y)]),
  /\|?(?=]])|\|/y,
  true, [],
  ([, ns], context) => {
    const { source, position, range = 0 } = context;
    if (!ns) return new List([new Data(''), new Data(source.slice(position - range, source[position - 1] === '|' ? position - 1 : position))]);
    context.position += source[position] === ' ' ? 1 : 0;
    return new List([new Data(Command.Separator), new Data(ns.head!.value.trimEnd())]);
  },
  (_, context) => {
    context.position -= context.range!;
    return new List([new Data('')]);
  });

function attributes(ns: List<Data<string | HTMLElement>>): Record<string, string | undefined> {
  switch (ns.head!.value) {
    case '':
      return { class: 'invalid', ...invalid('reference', 'syntax', 'Invalid abbreviation') };
    case Command.Separator:
      const abbr = ns.head!.next!.value as string;
      ns.head!.value = ns.head!.next!.value = '';
      return { class: 'reference', 'data-abbr': abbr };
    default:
      return { class: 'reference' };
  }
}
