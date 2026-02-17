import { Parser, Ctx, failsafe } from '../../data/parser';
import { firstline, isBlank } from '../constraint/line';
import { push } from 'spica/array';

export function fence<C extends Ctx, D extends Parser<unknown, C>[]>(opener: RegExp, limit: number, separation = true): Parser<string, C, D> {
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    const matches = source.slice(position).match(opener);
    if (!matches) return;
    assert(matches[0] === firstline(source, position));
    const delim = matches[1];
    assert(delim && delim === delim.trim());
    if (matches[0].includes(delim, delim.length)) return;
    context.position += matches[0].length;
    // Prevent annoying parsing in editing.
    const secondline = firstline(source, context.position);
    if (isBlank(secondline) && firstline(source, context.position + secondline.length).trimEnd() !== delim) return;
    let block = '';
    let closer = '';
    let overflow = '';
    for (let count = 1; ; ++count) {
      if (context.position === source.length) break;
      const line = firstline(source, context.position);
      if ((closer || count > limit + 1) && isBlank(line)) break;
      if(closer) {
        overflow += line;
      }
      if (!closer && count <= limit + 1 && line.slice(0, delim.length) === delim && line.trimEnd() === delim) {
        closer = line;
        if (isBlank(firstline(source, context.position + line.length))) {
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
    return [push([block, overflow, closer], matches)];
  });
}
