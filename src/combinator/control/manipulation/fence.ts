import { Parser, Ctx } from '../../data/parser';
import { firstline, isEmpty } from '../constraint/line';
import { unshift } from 'spica/array';

export function fence<D extends Parser<unknown, C>[], C extends Ctx>(opener: RegExp, limit: number, separation: boolean = true): Parser<string, C, D> {
  return source => {
    if (source === '') return;
    const matches = source.match(opener);
    if (!matches) return;
    assert(matches[0] === firstline(source));
    const delim = matches[1];
    if (matches[0].indexOf(delim, delim.length) > -1) return;
    let rest = source.slice(matches[0].length);
    // Prevent annoying parsing in editing.
    if (isEmpty(firstline(rest)) && firstline(rest.slice(firstline(rest).length)).trimEnd() !== delim) return;
    let block = '';
    let closer = '';
    for (let count = 1, next = firstline(rest); ; ++count) {
      if (rest === '') break;
      const line = next;
      next = firstline(rest.slice(line.length));
      if (count > limit + 1 && isEmpty(line)) break;
      if (count <= limit + 1 &&
          line.slice(0, delim.length) === delim &&
          line.trimEnd() === delim &&
          (!separation || isEmpty(next))) {
        assert(line.trimEnd() === delim);
        closer = delim;
        rest = rest.slice(line.length);
        break;
      }
      block += line;
      rest = rest.slice(line.length);
    }
    return [unshift([block, closer], matches), rest];
  };
}
