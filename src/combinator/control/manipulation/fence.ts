import { Parser, Ctx, failsafe } from '../../data/parser';
import { firstline, isBlank } from '../constraint/line';
import { push } from 'spica/array';

export function fence<C extends Ctx, D extends Parser<unknown, C>[]>(opener: RegExp, limit: number, separation = true): Parser<string, C, D> {
  return failsafe(({ source, context }) => {
    if (source === '') return;
    const matches = source.match(opener);
    if (!matches) return;
    assert(matches[0] === firstline(source));
    const delim = matches[1];
    assert(delim && delim === delim.trim());
    if (matches[0].includes(delim, delim.length)) return;
    let rest = source.slice(matches[0].length);
    // Prevent annoying parsing in editing.
    if (isBlank(firstline(rest)) && firstline(rest.slice(firstline(rest).length)).trimEnd() !== delim) return;
    let block = '';
    let closer = '';
    let overflow = '';
    for (let count = 1; ; ++count) {
      if (rest === '') break;
      const line = firstline(rest);
      if ((closer || count > limit + 1) && isBlank(line)) break;
      if(closer) {
        overflow += line;
      }
      if (!closer && count <= limit + 1 && line.slice(0, delim.length) === delim && line.trimEnd() === delim) {
        closer = line;
        if (isBlank(firstline(rest.slice(line.length)))) {
          rest = rest.slice(line.length);
          break;
        }
        if (!separation) {
          rest = rest.slice(line.length);
          break;
        }
        assert(!overflow);
        overflow = line;
      }
      if (!overflow) {
        block += line;
      }
      rest = rest.slice(line.length);
    }
    context.position += matches[0].length;
    return [push([block, overflow, closer], matches), rest];
  });
}
