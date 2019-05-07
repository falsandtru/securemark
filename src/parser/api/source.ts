import { BlockParser } from '../block';
import { bind } from '../../combinator';
import { parse } from './parse';
import { concat } from 'spica/concat';

const sources: WeakMap<Element, string> = new WeakMap();

export function breaklines(source: string): string {
  return [...parse(source).children]
    .map<string>(el => {
      if (el instanceof HTMLParagraphElement === false) return sources.get(el)!;
      const breaks = [...el.querySelectorAll<HTMLElement>('.address, .quote, br, .linebreak, .comment')]
        .reduce<Element[]>((acc, el) => {
          switch (true) {
            case el.matches('.quote'):
              return concat(acc, Array<Element>(el.textContent!.split('\n').length).fill(el));
            case el.matches('.comment'):
              return concat(acc, Array<Element>(el.title.split('\n').length - 1).fill(el));
            default:
              return concat(acc, [el]);
          }
        }, []);
      return sources.get(el)!
        .split('\n')
        .map((line, i) =>
          breaks[i] &&
          breaks[i].matches('.linebreak') &&
          !breaks[i].closest('.media, .annotation')
            ? `${line}\\`
            : line)
        .join('\n');
    })
    .join('\n');
}

export function memorize(parser: BlockParser): BlockParser {
  return ((source: string) =>
    bind(parser, (rs, rest) => {
      if (rs.length === 0) return [rs, rest];
      assert(rs.length === 1);
      void sources.set(rs[0], source.slice(0, source.length - rest.length));
      return [rs, rest];
    })(source));
}
