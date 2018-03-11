import { Result } from '../../../combinator';
import { firstline } from '../../source/line';

export function verify<T extends Result<any, any>>(parser: (source: string) => T): (source: string) => T {
  return source => {
    const result = parser(source);
    if (!result) return result;
    assert(result[0].length < 2);
    if (firstline(result[1]).trim() !== '') return undefined as T;
    return result;
  };
}
