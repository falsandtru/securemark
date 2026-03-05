import { Parser, List, Data, Ctx, failsafe } from '../../data/parser';
import { consume } from '../../../combinator';
import { firstline, isBlankline } from '../constraint/line';
import { push } from 'spica/array';

export function fence<C extends Ctx, D extends Parser<unknown, C>[]>(opener: RegExp, limit: number, separation = true): Parser<string, C, D> {
  assert(!opener.flags.match(/[gm]/) && opener.sticky && !opener.source.startsWith('^'));
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    opener.lastIndex = position;
    const matches = opener.exec(source);
    if (!matches) return;
    assert(matches[0] === firstline(source, position));
    consume(matches[0].length, context);
    const delim = matches[1];
    assert(delim && delim === delim.trim());
    if (matches[0].includes(delim, delim.length)) return;
    context.position += matches[0].length;
    // Prevent annoying parsing in editing.
    const secondline = firstline(source, context.position);
    if (isBlankline(secondline, 0) && firstline(source, context.position + secondline.length).trimEnd() !== delim) return;
    let block = '';
    let closer = '';
    let overflow = '';
    for (let count = 1; ; ++count) {
      if (context.position === source.length) break;
      const line = firstline(source, context.position);
      if ((closer || count > limit + 1) && isBlankline(line, 0)) break;
      if(closer) {
        overflow += line;
      }
      if (!closer && count <= limit + 1 && line.slice(0, delim.length) === delim && line.trimEnd() === delim) {
        closer = line;
        if (isBlankline(source, context.position + line.length)) {
          context.position += line.length;
          break;
        }
        if (!separation) {
          context.position += line.length;
          break;
        }
        assert(!overflow);
        overflow = line;
      }
      if (!overflow) {
        block += line;
      }
      context.position += line.length;
    }
    return new List(push([block, overflow, closer], matches).map(str => new Data(str)));
  });
}
