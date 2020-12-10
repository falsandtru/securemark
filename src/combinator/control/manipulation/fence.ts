import { undefined } from 'spica/global';
import { Parser, Ctx } from '../../data/parser';
import { firstline } from '../constraint/line';
import { unshift } from 'spica/array';

export function fence<D extends Parser<unknown, any, C>[], C extends Ctx>(opener: RegExp, limit: number, separation: boolean = true): Parser<string, D, C> {
  return source => {
    if (source === '') return;
    const matches = source.match(opener);
    if (!matches) return;
    assert(matches[0] === firstline(source));
    const delim = matches[1];
    if (matches[0].slice(delim.length).indexOf(delim) > -1) return;
    let rest = source.slice(matches[0].length);
    let block = '';
    let closer = '';
    for (let count = 1, next: string | undefined; ; ++count) {
      if (rest === '') break;
      const line = next ?? firstline(rest);
      next = undefined;
      if (count > limit + 1 && (!separation || line.trimStart() === '')) break;
      if (count <= limit + 1 &&
          line.slice(0, delim.length) === delim &&
          line.trimEnd() === delim &&
          (!separation || (next = firstline(rest.slice(line.length))).trimStart() === '')) {
        assert(line.slice(0, delim.length) === delim);
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
